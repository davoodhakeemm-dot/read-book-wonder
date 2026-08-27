import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { BookCover } from "@/components/BookCover";
import { BookGrid, SectionHeader } from "@/components/Sections";
import { EmptyState } from "@/components/EmptyState";
import { BOOKS } from "@/lib/books";
import { CATEGORIES, LANGUAGES, categoryBySlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category not found — Reading Corner" }, { name: "robots", content: "noindex" }],
      };
    }
    const name = loaderData.category.name;
    return {
      meta: [
        { title: `${name} Books — Reading Corner` },
        {
          name: "description",
          content: `Featured, popular, new and recommended ${name.toLowerCase()} books, with filtering and sorting.`,
        },
        { property: "og:title", content: `${name} Books — Reading Corner` },
        { property: "og:description", content: `Browse the best ${name.toLowerCase()} books.` },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: CategoryNotFound,
});

function CategoryNotFound() {
  return (
    <AppShell>
      <div className="px-4 py-16">
        <EmptyState
          title="Category not found"
          description="That shelf doesn't exist. Try browsing all categories."
          actionLabel="Browse categories"
          actionTo="/categories"
        />
      </div>
    </AppShell>
  );
}

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const [lang, setLang] = useState<string>("all");
  const [sort, setSort] = useState<"popular" | "rating" | "newest">("popular");

  const all = BOOKS.filter((b) => b.category === category.slug);
  let list = lang === "all" ? all : all.filter((b) => b.language === lang);
  list = [...list].sort((a, b) =>
    sort === "rating"
      ? b.rating - a.rating
      : sort === "newest"
        ? b.added.localeCompare(a.added)
        : b.reviews - a.reviews,
  );

  const featured = all.find((b) => b.tags.includes("featured")) ?? all[0];
  const popular = all.filter((b) => b.tags.includes("popular"));
  const fresh = [...all].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 5);
  const recommended = all.filter((b) => b.tags.includes("recommended"));

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/categories"
            aria-label="Back to categories"
            className="press grid size-9 shrink-0 place-items-center rounded-full bg-secondary"
          >
            <ArrowLeft className="size-[18px]" />
          </Link>
          <h1 className="min-w-0 truncate text-2xl font-bold sm:text-3xl">
            {category.icon} {category.name} Books
          </h1>
        </div>

        {featured && (
          <section className="grid gap-4 rounded-3xl bg-hero p-4 shadow-soft sm:grid-cols-[140px_1fr] sm:p-6">
            <Link to="/book/$bookId" params={{ bookId: featured.id }} className="press w-28 sm:w-full">
              <BookCover book={featured} />
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Featured
              </p>
              <h2 className="mt-1 text-xl font-bold">{featured.title}</h2>
              <p className="text-sm text-muted-foreground">{featured.author}</p>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {featured.description}
              </p>
              <Link
                to="/read/$bookId"
                params={{ bookId: featured.id }}
                className="press mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                Read Now
              </Link>
            </div>
          </section>
        )}

        {popular.length > 0 && (
          <section>
            <SectionHeader title={`Popular ${category.name}`} />
            <BookGrid books={popular} />
          </section>
        )}

        {fresh.length > 0 && (
          <section>
            <SectionHeader title={`New in ${category.name}`} />
            <BookGrid books={fresh} />
          </section>
        )}

        {recommended.length > 0 && (
          <section>
            <SectionHeader title="Recommended" />
            <BookGrid books={recommended} />
          </section>
        )}

        <section>
          <SectionHeader title={`All ${category.name} Books`} />
          <div className="mb-4 flex flex-wrap gap-2">
            <FilterChip active={lang === "all"} onClick={() => setLang("all")}>
              All languages
            </FilterChip>
            {LANGUAGES.filter((l) => all.some((b) => b.language === l.code)).map((l) => (
              <FilterChip key={l.code} active={lang === l.code} onClick={() => setLang(l.code)}>
                {l.flag} {l.name}
              </FilterChip>
            ))}
            <span className="mx-1 hidden w-px bg-border sm:block" />
            {(["popular", "rating", "newest"] as const).map((s) => (
              <FilterChip key={s} active={sort === s} onClick={() => setSort(s)}>
                {s === "popular" ? "Popular" : s === "rating" ? "Top Rated" : "Newest"}
              </FilterChip>
            ))}
          </div>
          {list.length ? (
            <BookGrid books={list} />
          ) : (
            <EmptyState
              title="No Books Found"
              description="Try another language or category."
              actionLabel="Explore Books"
            />
          )}
        </section>

        <section>
          <SectionHeader title="Other categories" />
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="press shrink-0 rounded-full bg-card px-3.5 py-2 text-xs font-semibold shadow-soft"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function FilterChip({
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
        "press rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
        active ? "bg-brand text-primary-foreground" : "bg-secondary text-secondary-foreground",
      )}
    >
      {children}
    </button>
  );
}
