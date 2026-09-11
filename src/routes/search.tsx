        import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { BookGrid } from "@/components/Sections";
import { EmptyState } from "@/components/EmptyState";
import { searchBooks } from "@/lib/books";
import { CATEGORIES, LANGUAGES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const SORTS = [
  { key: "popular", label: "Popular" },
  { key: "newest", label: "Newest" },
  { key: "az", label: "A–Z" },
  { key: "rating", label: "Highest Rated" },
] as const;

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Books — Reading Corner" },
      {
        name: "description",
        content:
          "Search books by title, author, category or language, then filter by rating and sort your results.",
      },
      { property: "og:title", content: "Search Books — Reading Corner" },
      {
        property: "og:description",
        content: "Find any book by title, author, category or language.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [langs, setLangs] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] =
    useState<(typeof SORTS)[number]["key"]>("popular");
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(
    () =>
      searchBooks(q, {
        languages: langs,
        categories: cats,
        minRating,
        sort,
      }),
    [q, langs, cats, minRating, sort],
  );

  const toggle = (
    list: string[],
    set: (v: string[]) => void,
    value: string,
  ) =>
    set(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    );

  const clear = () => {
    setLangs([]);
    setCats([]);
    setMinRating(0);
  };

  const activeFilters =
    langs.length + cats.length + (minRating ? 1 : 0);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6">
        <PageHeader
          title="Search"
          subtitle="Books, authors, categories and languages."
        />

        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-card px-4 py-3 shadow-soft">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => {
                const value = e.target.value;
                setQ(value);

                // SECRET FEATURE:
                // Typing "hi" opens the hidden chat page.
                if (value.trim().toLowerCase() === "hi") {
                  setQ("");
                  navigate({ to: "/chat" });
                }
              }}
              placeholder="Search books, authors or categories..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />

            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="shrink-0"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters((s) => !s)}
            aria-label="Filters"
            className={cn(
              "press relative grid size-11 shrink-0 place-items-center rounded-full shadow-soft",
              showFilters
                ? "bg-brand text-primary-foreground"
                : "bg-card",
            )}
          >
            <SlidersHorizontal className="size-[18px]" />

            {activeFilters > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="fade-in-soft space-y-4 rounded-3xl bg-card p-4 shadow-soft">
            <Filter title="Language">
              {LANGUAGES.map((l) => (
                <Chip
                  key={l.code}
                  active={langs.includes(l.code)}
                  onClick={() =>
                    toggle(langs, setLangs, l.code)
                  }
                >
                  {l.flag} {l.name}
                </Chip>
              ))}
            </Filter>

            <Filter title="Category">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.slug}
                  active={cats.includes(c.slug)}
                  onClick={() =>
                    toggle(cats, setCats, c.slug)
                  }
                >
                  {c.icon} {c.name}
                </Chip>
              ))}
            </Filter>

            <Filter title="Minimum rating">
              {[0, 4, 4.5, 4.7].map((r) => (
                <Chip
                  key={r}
                  active={minRating === r}
                  onClick={() => setMinRating(r)}
                >
                  {r === 0 ? "Any" : `${r}+ ★`}
                </Chip>
              ))}
            </Filter>

            {activeFilters > 0 && (
              <button
                onClick={clear}
                className="text-xs font-semibold text-primary"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {results.length}{" "}
            {results.length === 1 ? "book" : "books"}
          </p>

          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {SORTS.map((s) => (
              <Chip
                key={s.key}
                active={sort === s.key}
                onClick={() => setSort(s.key)}
              >
                {s.label}
              </Chip>
            ))}
          </div>
        </div>

        {results.length ? (
          <BookGrid books={results} />
        ) : (
          <EmptyState
            title="No Books Found"
            description="Try another search or category."
            actionLabel="Explore Books"
            actionTo="/explore"
          />
        )}
      </div>
    </AppShell>
  );
}

function Filter({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "press shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-brand text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {children}
    </button>
  );
}  
