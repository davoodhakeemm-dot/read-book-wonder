import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { BookCard } from "@/components/BookCard";
import type { Book } from "@/lib/books";
import { CATEGORIES, LANGUAGES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  viewAllTo,
  children,
}: {
  title: string;
  viewAllTo?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="min-w-0 truncate text-lg font-bold sm:text-xl">{title}</h2>
      {children}
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-primary"
        >
          View all <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

export function BookScroller({ books }: { books: Book[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:gap-4">
      {books.map((b) => (
        <div key={b.id} className="w-[124px] shrink-0 snap-start sm:w-[150px]">
          <BookCard book={b} showMeta={false} />
        </div>
      ))}
    </div>
  );
}

export function BookGrid({ books, className }: { books: Book[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-x-4",
        className,
      )}
    >
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}

export function CategoryChips({ limit }: { limit?: number }) {
  const items = limit ? CATEGORIES.slice(0, limit) : CATEGORIES;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((c) => (
        <Link
          key={c.slug}
          to="/category/$slug"
          params={{ slug: c.slug }}
          className={cn(
            "press flex items-center gap-3 rounded-2xl bg-gradient-to-br p-3.5 shadow-soft dark:bg-card dark:bg-none",
            c.tint,
          )}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card/80 text-lg">
            {c.icon}
          </span>
          <span className="min-w-0 truncate text-sm font-semibold text-foreground">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}

export function LanguageChips({ limit }: { limit?: number }) {
  const items = limit ? LANGUAGES.slice(0, limit) : LANGUAGES;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((l) => (
        <Link
          key={l.code}
          to="/language/$code"
          params={{ code: l.code }}
          className="press flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-soft"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-lg">
            {l.flag}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{l.name}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{l.native}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
