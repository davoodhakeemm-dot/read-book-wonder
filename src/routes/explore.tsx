import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { BookGrid } from "@/components/Sections";
import { EmptyState } from "@/components/EmptyState";
import { BOOKS, byTag } from "@/lib/books";
import { cn } from "@/lib/utils";

const TABS = ["Popular", "Trending", "New", "Recommended", "Top Rated"] as const;

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Books — Reading Corner" },
      {
        name: "description",
        content:
          "Browse popular, trending, new, recommended and top rated books across languages and categories.",
      },
      { property: "og:title", content: "Explore Books — Reading Corner" },
      {
        property: "og:description",
        content: "Popular, trending, new and top rated books, all in one place.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Popular");

  const books =
    tab === "Popular"
      ? byTag("popular")
      : tab === "Trending"
        ? byTag("trending")
        : tab === "New"
          ? [...BOOKS].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 12)
          : tab === "Recommended"
            ? byTag("recommended")
            : [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 12);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6">
        <PageHeader
          title="Explore Books"
          subtitle="Discover something new in every language."
          action={
            <Link
              to="/search"
              className="press hidden items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm text-muted-foreground shadow-soft sm:flex"
            >
              <Search className="size-4" /> Search
            </Link>
          }
        />

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

        {books.length ? (
          <BookGrid books={books} className="fade-in-soft" />
        ) : (
          <EmptyState
            title="No Books Found"
            description="Try another search or category."
            actionLabel="Explore Books"
            actionTo="/categories"
          />
        )}
      </div>
    </AppShell>
  );
}
