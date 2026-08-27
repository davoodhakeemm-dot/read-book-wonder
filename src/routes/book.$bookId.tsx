import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck, Heart, Plus, Share2, Star } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { BookCover } from "@/components/BookCover";
import { BookGrid, SectionHeader } from "@/components/Sections";
import { EmptyState } from "@/components/EmptyState";
import { BOOKS, bookById, readingMinutes } from "@/lib/books";
import { categoryBySlug, languageByCode } from "@/lib/catalog";
import { progressPercent, useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book/$bookId")({
  loader: ({ params }) => {
    const book = bookById(params.bookId);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Book not found — Reading Corner" }, { name: "robots", content: "noindex" }],
      };
    }
    const b = loaderData.book;
    return {
      meta: [
        { title: `${b.title} by ${b.author} — Reading Corner` },
        { name: "description", content: b.description.slice(0, 155) },
        { property: "og:title", content: `${b.title} — ${b.author}` },
        { property: "og:description", content: b.description.slice(0, 155) },
        { property: "og:type", content: "book" },
      ],
    };
  },
  component: BookDetails,
  notFoundComponent: BookNotFound,
});

function BookNotFound() {
  return (
    <AppShell>
      <div className="px-4 py-16">
        <EmptyState
          title="Book not found"
          description="This title may have been moved. Explore the library instead."
          actionLabel="Explore Books"
        />
      </div>
    </AppShell>
  );
}

function BookDetails() {
  const { book } = Route.useLoaderData();
  const { state, toggleFavorite, toggleBookmark } = useLibrary();

  const cat = categoryBySlug(book.category);
  const lang = languageByCode(book.language);
  const fav = state.favorites.includes(book.id);
  const progress = state.progress[book.id];
  const bookmarked = state.bookmarks.some((b) => b.bookId === book.id);

  const similar = BOOKS.filter(
    (b) => b.id !== book.id && (b.category === book.category || b.language === book.language),
  ).slice(0, 5);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: book.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* share dismissed */
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/explore"
            aria-label="Back"
            className="press grid size-9 place-items-center rounded-full bg-secondary"
          >
            <ArrowLeft className="size-[18px]" />
          </Link>
          <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold">Book Details</p>
          <button
            onClick={share}
            aria-label="Share book"
            className="press grid size-9 place-items-center rounded-full bg-secondary"
          >
            <Share2 className="size-[18px]" />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:gap-8">
          <div className="mx-auto w-36 sm:mx-0 sm:w-full">
            <BookCover book={book} size="lg" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{book.title}</h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{book.author}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-1 font-bold text-gold-foreground">
                <Star className="size-3.5 fill-gold text-gold" />
                {book.rating.toFixed(1)}
                <span className="font-medium opacity-70">({book.reviews.toLocaleString()})</span>
              </span>
              <Link
                to="/language/$code"
                params={{ code: book.language }}
                className="rounded-full bg-secondary px-2.5 py-1 font-semibold"
              >
                {lang?.flag} {lang?.name}
              </Link>
              <Link
                to="/category/$slug"
                params={{ slug: book.category }}
                className="rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-foreground"
              >
                {cat?.icon} {cat?.name}
              </Link>
              <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">
                {book.pageCount} pages
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">
                ~{readingMinutes(book)} min
              </span>
            </div>

            {progress && (
              <div className="mt-4 rounded-2xl bg-card p-3 shadow-soft">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Your progress</span>
                  <span>{progressPercent(progress.page, progress.pages)}% completed</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${progressPercent(progress.page, progress.pages)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/read/$bookId"
                params={{ bookId: book.id }}
                className="press flex-1 rounded-full bg-brand px-5 py-3 text-center text-sm font-bold text-primary-foreground shadow-lift sm:flex-none sm:px-8"
              >
                {progress ? "Continue Reading" : "Read Now"}
              </Link>
              <button
                onClick={() => {
                  toggleFavorite(book.id);
                  toast.success(fav ? "Removed from library" : "Added to My Library");
                }}
                className="press flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-bold"
              >
                <Plus className="size-4" /> Add to Library
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => toggleFavorite(book.id)}
                aria-pressed={fav}
                className={cn(
                  "press flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-bold",
                  fav ? "bg-destructive/10 text-destructive" : "bg-card",
                )}
              >
                <Heart className={cn("size-4", fav && "fill-destructive")} />
                {fav ? "Favorited" : "Favorite"}
              </button>
              <button
                onClick={() => toggleBookmark(book.id, progress?.page ?? 0)}
                aria-pressed={bookmarked}
                className={cn(
                  "press flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-bold",
                  bookmarked ? "bg-sidebar-accent text-primary" : "bg-card",
                )}
              >
                {bookmarked ? (
                  <BookmarkCheck className="size-4" />
                ) : (
                  <Bookmark className="size-4" />
                )}
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
              <button
                onClick={share}
                className="press flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-bold"
              >
                <Share2 className="size-4" /> Share
              </button>
            </div>
          </div>
        </div>

        <section>
          <SectionHeader title="About This Book" />
          <div className="rounded-3xl bg-card p-5 shadow-soft">
            <p className="text-sm leading-relaxed text-muted-foreground">{book.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <Meta label="Publisher" value={book.publisher} />
              <Meta
                label="Published"
                value={book.year < 0 ? `${Math.abs(book.year)} BCE` : String(book.year)}
              />
              <Meta label="Pages" value={String(book.pageCount)} />
              <Meta label="Added" value={new Date(book.added).toLocaleDateString()} />
            </dl>
          </div>
        </section>

        {similar.length > 0 && (
          <section>
            <SectionHeader title="More Like This" />
            <BookGrid books={similar} />
          </section>
        )}
      </div>
    </AppShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate font-semibold">{value}</dd>
    </div>
  );
}
