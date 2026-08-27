import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { BookGrid, SectionHeader } from "@/components/Sections";
import { EmptyState } from "@/components/EmptyState";
import { BOOKS } from "@/lib/books";
import { LANGUAGES, languageByCode } from "@/lib/catalog";

export const Route = createFileRoute("/language/$code")({
  loader: ({ params }) => {
    const language = languageByCode(params.code);
    if (!language) throw notFound();
    return { language };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Language not found — Reading Corner" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const name = loaderData.language.name;
    return {
      meta: [
        { title: `${name} Books — Reading Corner` },
        {
          name: "description",
          content: `Popular, new, recommended and most read ${name} books, beautifully organised.`,
        },
        { property: "og:title", content: `${name} Books — Reading Corner` },
        { property: "og:description", content: `Read the best books available in ${name}.` },
      ],
    };
  },
  component: LanguagePage,
  notFoundComponent: LanguageNotFound,
});

function LanguageNotFound() {
  return (
    <AppShell>
      <div className="px-4 py-16">
        <EmptyState
          title="Language not found"
          description="We don't have that language yet. Browse the ones we do."
          actionLabel="Browse languages"
          actionTo="/languages"
        />
      </div>
    </AppShell>
  );
}

function LanguagePage() {
  const { language } = Route.useLoaderData();
  const all = BOOKS.filter((b) => b.language === language.code);

  const sections = [
    { title: `Popular ${language.name} Books`, books: all.filter((b) => b.tags.includes("popular")) },
    {
      title: `New ${language.name} Books`,
      books: [...all].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 5),
    },
    {
      title: `Recommended ${language.name} Books`,
      books: all.filter((b) => b.tags.includes("recommended")),
    },
    {
      title: `Most Read ${language.name} Books`,
      books: [...all].sort((a, b) => b.reviews - a.reviews).slice(0, 5),
    },
  ].filter((s) => s.books.length > 0);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/languages"
            aria-label="Back to languages"
            className="press grid size-9 shrink-0 place-items-center rounded-full bg-secondary"
          >
            <ArrowLeft className="size-[18px]" />
          </Link>
          <h1 className="min-w-0 truncate text-2xl font-bold sm:text-3xl">
            {language.flag} {language.name} Books
          </h1>
        </div>

        {all.length === 0 ? (
          <EmptyState
            title="No Books Found"
            description="No titles in this language yet — try another one."
            actionLabel="Browse languages"
            actionTo="/languages"
          />
        ) : (
          sections.map((s) => (
            <section key={s.title}>
              <SectionHeader title={s.title} />
              <BookGrid books={s.books} />
            </section>
          ))
        )}

        <section>
          <SectionHeader title="Other languages" />
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {LANGUAGES.filter((l) => l.code !== language.code).map((l) => (
              <Link
                key={l.code}
                to="/language/$code"
                params={{ code: l.code }}
                className="press shrink-0 rounded-full bg-card px-3.5 py-2 text-xs font-semibold shadow-soft"
              >
                {l.flag} {l.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
