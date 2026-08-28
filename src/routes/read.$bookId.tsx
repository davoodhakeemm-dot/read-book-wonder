import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Minus,
  Pause,
  Play,
  Plus,
  Settings2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { bookById } from "@/lib/books";
import { progressPercent, useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/read/$bookId")({
  validateSearch: (search: Record<string, unknown>): { page?: number } => ({
    page: search['page'] === undefined ? undefined : Number(search['page']),
  }),
  head: () => ({
    meta: [
      { title: "Reader — Reading Corner" },
      {
        name: "description",
        content:
          "A distraction-free reading view with adjustable font size, spacing, themes, bookmarks and read-aloud.",
      },
      { property: "og:title", content: "Reader — Reading Corner" },
      { property: "og:description", content: "Read comfortably with your own settings." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReaderPage,
});

function ReaderPage() {
  const { bookId } = Route.useParams();
  const book = bookById(bookId);
  const { page: pageParam } = Route.useSearch();
  const navigate = useNavigate();
  const { state, ready, setReader, saveProgress, toggleBookmark, isBookmarked } = useLibrary();
  const [page, setPage] = useState(0);
  const [panel, setPanel] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [restored, setRestored] = useState(false);

  const pages = useMemo(() => book?.content ?? [], [book]);
  const total = pages.length;

  useEffect(() => {
    if (!ready || restored || !book) return;
    if (pageParam !== undefined && Number.isFinite(pageParam)) {
      setPage(Math.min(Math.max(0, Math.floor(pageParam)), Math.max(0, total - 1)));
      setRestored(true);
      return;
    }
    const saved = state.progress[book.id];
    if (saved && saved.page < total) setPage(saved.page);
    setRestored(true);
  }, [ready, restored, book, state.progress, total, pageParam]);

  useEffect(() => {
    if (!restored || !book || total === 0) return;
    saveProgress(book.id, page, total);
  }, [page, restored, book, total, saveProgress]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window)
        window.speechSynthesis.cancel();
    };
  }, []);

  if (!book) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <EmptyState
          title="Book not found"
          description="This book isn't in the library. Try exploring our collection instead."
          actionLabel="Explore books"
          actionTo="/explore"
        />
      </div>
    );
  }

  const prefs = state.reader;
  const percent = progressPercent(page, total);
  const bookmarked = isBookmarked(book.id, page);

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(pages[page] ?? "");
    utter.rate = prefs.speechRate;
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const go = (dir: -1 | 1) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
    setPage((p) => Math.min(total - 1, Math.max(0, p + dir)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  return (
    <div
      className={cn(
        "min-h-screen",
        prefs.theme === "light" ? "reader-light" : prefs.theme === "sepia" ? "reader-sepia" : "reader-dark",
      )}
      style={{ background: "var(--reader-bg)", color: "var(--reader-fg)" }}
    >
      <header className="sticky top-0 z-30 border-b border-current/10 backdrop-blur-md" style={{ background: "color-mix(in oklab, var(--reader-bg) 88%, transparent)" }}>
        <div className="mx-auto grid max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <Link
            to="/book/$bookId"
            params={{ bookId: book.id }}
            aria-label="Back to book"
            className="press grid size-9 place-items-center rounded-full bg-current/10"
          >
            <ArrowLeft className="size-[18px]" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-semibold">{book.title}</p>
            <p className="truncate text-[11px] opacity-70">
              Page {page + 1} of {total} · {percent}%
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleBookmark(book.id, page)}
              aria-label="Bookmark this page"
              className="press grid size-9 place-items-center rounded-full bg-current/10"
            >
              <Bookmark className={cn("size-[18px]", bookmarked && "fill-current")} />
            </button>
            <button
              onClick={toggleSpeech}
              aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
              className="press grid size-9 place-items-center rounded-full bg-current/10"
            >
              {speaking ? <Pause className="size-[18px]" /> : <Play className="size-[18px]" />}
            </button>
            <button
              onClick={() => setPanel(true)}
              aria-label="Reader settings"
              className="press grid size-9 place-items-center rounded-full bg-current/10"
            >
              <Settings2 className="size-[18px]" />
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-current/10">
          <div className="h-full bg-current/50" style={{ width: `${percent}%` }} />
        </div>
      </header>

      <main
        className={cn(
          "mx-auto px-5 pb-32 pt-8",
          prefs.width === "compact" ? "max-w-xl" : prefs.width === "wide" ? "max-w-4xl" : "max-w-2xl",
        )}
      >
        <article
          className={cn(prefs.font === "serif" ? "font-display" : "font-sans")}
          style={{
            fontSize: `${prefs.fontSize}px`,
            lineHeight:
              prefs.lineSpacing === "small" ? 1.5 : prefs.lineSpacing === "large" ? 2.1 : 1.8,
          }}
        >
          <p className="whitespace-pre-line">{pages[page]}</p>
        </article>

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            onClick={() => go(-1)}
            disabled={page === 0}
            className="press inline-flex items-center gap-1.5 rounded-full bg-current/10 px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
          >
            <ChevronLeft className="size-4" /> Previous
          </button>
          {page === total - 1 ? (
            <button
              onClick={() => navigate({ to: "/library" })}
              className="press inline-flex items-center gap-1.5 rounded-full bg-current/15 px-4 py-2.5 text-sm font-bold"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={() => go(1)}
              className="press inline-flex items-center gap-1.5 rounded-full bg-current/15 px-4 py-2.5 text-sm font-bold"
            >
              Next <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </main>

      {panel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
          <div className="w-full max-w-md rounded-t-3xl bg-background p-5 text-foreground shadow-lift sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Reading settings</h2>
              <button
                onClick={() => setPanel(false)}
                aria-label="Close settings"
                className="press grid size-9 place-items-center rounded-full bg-secondary"
              >
                <X className="size-[18px]" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-sm">
              <Field label="Theme">
                <Segmented
                  options={[
                    { value: "light", label: "Light" },
                    { value: "sepia", label: "Sepia" },
                    { value: "dark", label: "Night" },
                  ]}
                  value={prefs.theme}
                  onChange={(v) => setReader({ theme: v as typeof prefs.theme })}
                />
              </Field>

              <Field label="Font">
                <Segmented
                  options={[
                    { value: "serif", label: "Serif" },
                    { value: "sans", label: "Sans" },
                  ]}
                  value={prefs.font}
                  onChange={(v) => setReader({ font: v as typeof prefs.font })}
                />
              </Field>

              <Field label={`Font size — ${prefs.fontSize}px`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReader({ fontSize: Math.max(14, prefs.fontSize - 1) })}
                    aria-label="Decrease font size"
                    className="press grid size-9 place-items-center rounded-full bg-secondary"
                  >
                    <Minus className="size-4" />
                  </button>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${((prefs.fontSize - 14) / 14) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setReader({ fontSize: Math.min(28, prefs.fontSize + 1) })}
                    aria-label="Increase font size"
                    className="press grid size-9 place-items-center rounded-full bg-secondary"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </Field>

              <Field label="Line spacing">
                <Segmented
                  options={[
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" },
                  ]}
                  value={prefs.lineSpacing}
                  onChange={(v) => setReader({ lineSpacing: v as typeof prefs.lineSpacing })}
                />
              </Field>

              <Field label="Page width">
                <Segmented
                  options={[
                    { value: "compact", label: "Compact" },
                    { value: "normal", label: "Normal" },
                    { value: "wide", label: "Wide" },
                  ]}
                  value={prefs.width}
                  onChange={(v) => setReader({ width: v as typeof prefs.width })}
                />
              </Field>

              <Field label={`Read-aloud speed — ${prefs.speechRate.toFixed(1)}x`}>
                <Segmented
                  options={[
                    { value: "0.8", label: "0.8x" },
                    { value: "1", label: "1x" },
                    { value: "1.3", label: "1.3x" },
                  ]}
                  value={String(prefs.speechRate)}
                  onChange={(v) => setReader({ speechRate: Number(v) })}
                />
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "press flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors",
            value === o.value
              ? "bg-brand text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
