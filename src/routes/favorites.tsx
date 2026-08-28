import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { BookGrid } from "@/components/Sections";
import { bookById, type Book } from "@/lib/books";
import { useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Reading Corner" },
      {
        name: "description",
        content: "All the books you've marked as favorites, gathered on one shelf.",
      },
      { property: "og:title", content: "Favorites — Reading Corner" },
      { property: "og:description", content: "The books you loved, kept close." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { state } = useLibrary();
  const books = state.favorites.map(bookById).filter((b): b is Book => Boolean(b));

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6">
        <PageHeader
          title="Favorites"
          subtitle={`${books.length} saved book${books.length === 1 ? "" : "s"}`}
        />
        {books.length ? (
          <BookGrid books={books} />
        ) : (
          <EmptyState
            title="No favorites yet"
            description="Tap the heart on any book and it will appear here."
            actionLabel="Explore books"
            actionTo="/explore"
          />
        )}
      </div>
    </AppShell>
  );
}
