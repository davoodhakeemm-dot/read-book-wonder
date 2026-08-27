import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";

import { CATEGORIES } from "@/lib/catalog";
import { useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/categories")({
  head: () => ({
    meta: [
      { title: "What would you like to read? — Reading Corner" },
      {
        name: "description",
        content:
          "Choose your favourite categories — fiction, mystery, romance, science, history, business, self development and more.",
      },
      { property: "og:title", content: "What would you like to read? — Reading Corner" },
      { property: "og:description", content: "Choose the categories you want in your library." },
    ],
  }),
  component: CategoryStep,
});

function CategoryStep() {
  const { state, update } = useLibrary();
  const navigate = useNavigate();
  const selected = state.categories;

  const toggle = (slug: string) =>
    update({
      categories: selected.includes(slug)
        ? selected.filter((c) => c !== slug)
        : [...selected, slug],
    });

  const finish = () => {
    update({ onboarded: true });
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 pb-32 pt-6">
        <Link
          to="/onboarding/language"
          className="press inline-grid size-9 place-items-center rounded-full bg-secondary"
          aria-label="Back"
        >
          <ArrowLeft className="size-[18px]" />
        </Link>

        <h1 className="mt-6 text-center text-2xl font-bold sm:text-3xl">
          What would you like to read?
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Select one or more categories
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const active = selected.includes(c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => toggle(c.slug)}
                aria-pressed={active}
                className={cn(
                  "press relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border-2 bg-gradient-to-br p-2 shadow-soft transition-colors dark:bg-card dark:bg-none",
                  c.tint,
                  active ? "border-primary" : "border-transparent",
                )}
              >
                {active && (
                  <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-brand text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                )}
                <span className="text-2xl">{c.icon}</span>
                <span className="text-center text-[11px] font-semibold leading-tight text-foreground">
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border/70 bg-background/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <button
            disabled={selected.length === 0}
            onClick={finish}
            className="press w-full rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lift disabled:opacity-40"
          >
            Continue{selected.length ? ` (${selected.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
