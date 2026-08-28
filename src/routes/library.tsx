import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { BookRow } from "@/components/BookCard";
import { EmptyState } from "@/components/EmptyState";
import { BookGrid } from "@/components/Sections";
import { bookById } from "@/lib/books";
import { progressPercent, useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";

const TABS = ["Reading", "Favorites", "Completed", "Bookmarks"] as const;

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "My Library — Reading Corner" },
      {
        name: "description",
        content:
          "Your personal shelf: books you're reading, your favorites, completed titles and saved bookmarks.",
      },
      { property: "og:title", content: "My Library — Reading Corner" },
      { property: "og:description", content: "Pick up exactly where you left off." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { state } = useLibrary();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Reading");

  const reading = Object.entries(state.progress)
    .filter(([id]) => !state.completed.includes(id))
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt));
  const favorites = state.favorites.map(bookById).filter(Boolean);
  const completed = state.completed.map(bookById).filter(Boolean);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6">
        <PageHeader title="My Library" subtitle="Everything you've saved and started." />

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "press shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors",
                tab === t
                  ? "bg-brand text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground shadow-soft",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Reading" &&
          (reading.length ? (
            <div className="space-y-3">
              {reading.map(([id, p]) => {
                const book = bookById(id);
                if (!book) return null;
                return (
                  <BookRow
                    key={id}
                    book={book}
                    percent={progressPercent(p.page, p.pages)}
                    trailing={
                      <Link
                        to="/read/$bookId"
                        params={{ bookId: book.id }}
                        className="press grid size-10 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground"
                        aria-label={`Continue reading ${book.title}`}
                      >
                        <BookOpen className="size-[18px]" />
                      </Link>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Nothing in progress"
              description="Start a book and it will show up here so you can pick up where you left off."
              actionLabel="Explore books"
              actionTo="/explore"
            />
          ))}

        {tab === "Favorites" &&
          (favorites.length ? (
            <BookGrid books={favorites as never} />
          ) : (
            <EmptyState
              title="No favorites yet"
              description="Tap the heart on any book to keep it close at hand."
              actionLabel="Find something to love"
              actionTo="/explore"
            />
          ))}

        {tab === "Completed" &&
          (completed.length ? (
            <BookGrid books={completed as never} />
          ) : (
            <EmptyState
              title="No finished books yet"
              description="Books you read to the last page land here as a record of your journey."
              actionLabel="Start reading"
              actionTo="/explore"
            />
          ))}

        {tab === "Bookmarks" &&
          (state.bookmarks.length ? (
            <div className="space-y-3">
              {state.bookmarks.map((b) => {
                const book = bookById(b.bookId);
                if (!book) return null;
                return (
                  <BookRow
                    key={`${b.bookId}-${b.page}`}
                    book={book}
                    trailing={
                      <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                        Page {b.page + 1}
                      </span>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No bookmarks"
              description="While reading, tap the bookmark icon to save a page for later."
              actionLabel="Open a book"
              actionTo="/explore"
            />
          ))}
      </div>
    </AppShell>
  );
}
