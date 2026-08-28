import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/AppShell";
import { BookRow } from "@/components/BookCard";
import { EmptyState } from "@/components/EmptyState";
import { bookById } from "@/lib/books";
import { progressPercent, useLibrary } from "@/lib/library-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Reading History — Reading Corner" },
      {
        name: "description",
        content: "A timeline of everything you've read recently, with your progress in each book.",
      },
      { property: "og:title", content: "Reading History — Reading Corner" },
      { property: "og:description", content: "Look back at what you've been reading." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { state } = useLibrary();

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-5 sm:px-6">
        <PageHeader title="Reading History" subtitle="Your most recent reading sessions." />
        {state.history.length ? (
          <div className="space-y-3">
            {state.history.map((h) => {
              const book = bookById(h.bookId);
              if (!book) return null;
              const p = state.progress[h.bookId];
              return (
                <BookRow
                  key={`${h.bookId}-${h.at}`}
                  book={book}
                  percent={p ? progressPercent(p.page, p.pages) : undefined}
                  trailing={
                    <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                      {new Date(h.at).toLocaleDateString()}
                    </span>
                  }
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No history yet"
            description="Open a book and your reading activity will be listed here."
            actionLabel="Start reading"
            actionTo="/explore"
          />
        )}
      </div>
    </AppShell>
  );
}
