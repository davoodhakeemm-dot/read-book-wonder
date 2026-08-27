import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { BookCover } from "@/components/BookCover";
import { categoryBySlug, languageByCode } from "@/lib/catalog";
import type { Book } from "@/lib/books";
import { cn } from "@/lib/utils";

export function BookCard({
  book,
  className,
  showMeta = true,
}: {
  book: Book;
  className?: string;
  showMeta?: boolean;
}) {
  const cat = categoryBySlug(book.category);
  const lang = languageByCode(book.language);
  return (
    <Link
      to="/book/$bookId"
      params={{ bookId: book.id }}
      className={cn(
        "group press block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="transition-transform duration-200 group-hover:-translate-y-1">
        <BookCover book={book} />
      </div>
      <div className="mt-2.5 space-y-1">
        <p className="line-clamp-2 text-sm font-semibold leading-tight">{book.title}</p>
        <p className="truncate text-xs text-muted-foreground">{book.author}</p>
        {showMeta && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Star className="size-3 fill-gold text-gold" />
              {book.rating.toFixed(1)}
            </span>
            <span className="rounded-full bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">
              {lang?.name}
            </span>
            <span className="rounded-full bg-accent px-1.5 py-0.5 font-medium text-accent-foreground">
              {cat?.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function BookRow({
  book,
  percent,
  trailing,
}: {
  book: Book;
  percent?: number;
  trailing?: React.ReactNode;
}) {
  return (
    <Link
      to="/book/$bookId"
      params={{ bookId: book.id }}
      className="press flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft"
    >
      <div className="w-14 shrink-0">
        <BookCover book={book} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{book.title}</p>
        <p className="truncate text-xs text-muted-foreground">{book.author}</p>
        {typeof percent === "number" ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">{percent}%</span>
          </div>
        ) : (
          <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold">
            <Star className="size-3 fill-gold text-gold" />
            {book.rating.toFixed(1)}
          </p>
        )}
      </div>
      {trailing}
    </Link>
  );
}
