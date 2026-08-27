import { Link, createFileRoute } from "@tanstack/react-router";
import { Bell, Search, Star } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { BookRow } from "@/components/BookCard";
import {
  BookGrid,
  BookScroller,
  CategoryChips,
  LanguageChips,
  SectionHeader,
} from "@/components/Sections";
import { BOOKS, bookById, byTag } from "@/lib/books";
import { useLibrary, progressPercent } from "@/lib/library-store";
import heroBooks from "@/assets/hero-books.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Reading Corner" },
      {
        name: "description",
        content:
          "Your reading dashboard: continue reading, popular books, new arrivals and recommendations across every language and category.",
      },
      { property: "og:title", content: "Home — Reading Corner" },
      {
        property: "og:description",
        content: "Continue reading and discover popular books, new arrivals and recommendations.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { state } = useLibrary();

  const continueReading = state.history
    .map((h) => ({ book: bookById(h.bookId), p: state.progress[h.bookId] }))
    .filter((x): x is { book: NonNullable<ReturnType<typeof bookById>>; p: { page: number; pages: number; updatedAt: string } } => Boolean(x.book && x.p))
    .slice(0, 4);

  const preferred = BOOKS.filter(
    (b) =>
      (state.languages.length === 0 || state.languages.includes(b.language)) &&
      (state.categories.length === 0 || state.categories.includes(b.category)),
  );
  const recommended = (preferred.length >= 4 ? preferred : byTag("recommended")).slice(0, 10);
  const newArrivals = [...BOOKS].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 10);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-9 px-4 py-5 sm:px-6">
        {/* Desktop top bar */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/search"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm text-muted-foreground shadow-soft"
          >
            <Search className="size-4 shrink-0" />
            Search books, authors, categories…
          </Link>
          <Link
            to="/settings"
            aria-label="Notifications"
            className="press grid size-10 shrink-0 place-items-center rounded-full bg-card shadow-soft"
          >
            <Bell className="size-[18px]" />
          </Link>
          <Link
            to="/profile"
            className="press grid size-10 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground"
          >
            {state.profile.name.slice(0, 1).toUpperCase()}
          </Link>
        </div>

        {/* Hero */}
        <section className="grid gap-5 overflow-hidden rounded-3xl bg-hero p-5 shadow-soft sm:grid-cols-[1.1fr_1fr] sm:items-center sm:p-8">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">
              Find Your Next Story
            </h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Explore thousands of books across languages and categories.
            </p>
            <Link
              to="/explore"
              className="press mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lift"
            >
              Explore Books
            </Link>
          </div>
          <img
            src={heroBooks}
            alt="Books, an open novel and a warm drink"
            width={1280}
            height={800}
            className="w-full rounded-2xl"
          />
        </section>

        {/* Continue reading */}
        {continueReading.length > 0 && (
          <section>
            <SectionHeader title="Continue Reading" viewAllTo="/library" />
            <div className="grid gap-3 sm:grid-cols-2">
              {continueReading.map(({ book, p }) => (
                <BookRow key={book.id} book={book} percent={progressPercent(p.page, p.pages)} />
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeader title="Popular Books" viewAllTo="/explore" />
          <BookScroller books={byTag("popular")} />
        </section>

        <section>
          <SectionHeader title="Recommended for You" viewAllTo="/explore" />
          <BookGrid books={recommended.slice(0, 5)} />
        </section>

        <section>
          <SectionHeader title="New Arrivals" viewAllTo="/explore" />
          <BookScroller books={newArrivals} />
        </section>

        <section>
          <SectionHeader title="Top Rated" viewAllTo="/explore" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[...BOOKS]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map((b) => (
                <BookRow
                  key={b.id}
                  book={b}
                  trailing={
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold/20 px-2 py-1 text-[11px] font-bold text-gold-foreground">
                      <Star className="size-3 fill-gold text-gold" />
                      {b.rating.toFixed(1)}
                    </span>
                  }
                />
              ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Browse Categories" viewAllTo="/categories" />
          <CategoryChips limit={8} />
        </section>

        <section>
          <SectionHeader title="Browse Languages" viewAllTo="/languages" />
          <LanguageChips limit={8} />
        </section>
      </div>
    </AppShell>
  );
}
