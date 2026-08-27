import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";

import { LANGUAGES } from "@/lib/catalog";
import { useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/language")({
  head: () => ({
    meta: [
      { title: "Choose Your Language — Reading Corner" },
      {
        name: "description",
        content:
          "Pick the languages you read in: English, Malayalam, Kannada, Hindi, Tamil, Telugu, Arabic and more.",
      },
      { property: "og:title", content: "Choose Your Language — Reading Corner" },
      { property: "og:description", content: "Pick the languages you love to read in." },
    ],
  }),
  component: LanguageStep,
});

function LanguageStep() {
  const { state, update } = useLibrary();
  const navigate = useNavigate();
  const selected = state.languages;

  const toggle = (code: string) =>
    update({
      languages: selected.includes(code)
        ? selected.filter((c) => c !== code)
        : [...selected, code],
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-6">
        <Link
          to="/"
          className="press inline-grid size-9 place-items-center rounded-full bg-secondary"
          aria-label="Back"
        >
          <ArrowLeft className="size-[18px]" />
        </Link>

        <h1 className="mt-6 text-center text-2xl font-bold sm:text-3xl">Choose Your Language</h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Select one or more languages
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {LANGUAGES.map((l) => {
            const active = selected.includes(l.code);
            return (
              <button
                key={l.code}
                onClick={() => toggle(l.code)}
                aria-pressed={active}
                className={cn(
                  "press relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border-2 bg-card p-2 shadow-soft transition-colors",
                  active ? "border-primary bg-sidebar-accent" : "border-transparent",
                )}
              >
                {active && (
                  <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-brand text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                )}
                <span className="text-2xl">{l.flag}</span>
                <span className="text-center text-[11px] font-semibold leading-tight">
                  {l.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border/70 bg-background/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button
            disabled={selected.length === 0}
            onClick={() => navigate({ to: "/onboarding/categories" })}
            className="press w-full rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lift disabled:opacity-40"
          >
            Continue{selected.length ? ` (${selected.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
