import type { Book } from "@/lib/books";
import { cn } from "@/lib/utils";

export function BookCover({
  book,
  className,
  size = "md",
}: {
  book: Book;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const titleClass =
    size === "lg" ? "text-lg sm:text-xl" : size === "sm" ? "text-[10px]" : "text-xs sm:text-sm";
  return (
    <div
      className={cn(
        "relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-xl p-3 shadow-book",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(150deg, ${book.cover.from}, ${book.cover.to})`,
        color: book.cover.ink,
      }}
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-[7%]"
        style={{ background: "rgba(0,0,0,0.22)" }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-6 -top-10 h-24 w-24 rounded-full opacity-25"
        style={{ background: "rgba(255,255,255,0.6)" }}
        aria-hidden
      />
      <div className="relative pl-2">
        <p className={cn("font-display font-semibold leading-snug", titleClass)}>{book.title}</p>
      </div>
      <div className="relative pl-2">
        <div className="mb-2 h-px w-8" style={{ background: "currentColor", opacity: 0.5 }} />
        <p className="text-[10px] font-medium uppercase tracking-wider opacity-85">{book.author}</p>
      </div>
    </div>
  );
}
