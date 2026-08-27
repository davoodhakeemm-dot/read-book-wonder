import { Link } from "@tanstack/react-router";
import { BookX, WifiOff } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo = "/explore",
  onAction,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-card px-6 py-12 text-center shadow-soft">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-hero text-primary">
        {icon ?? <BookX className="size-7" />}
      </div>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      {actionLabel &&
        (onAction ? (
          <button
            onClick={onAction}
            className="press mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            {actionLabel}
          </button>
        ) : (
          <Link
            to={actionTo}
            className="press mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            {actionLabel}
          </Link>
        ))}
    </div>
  );
}

export function OfflineBanner() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
      <WifiOff className="size-4 shrink-0 text-destructive" />
      <span className="min-w-0 flex-1 font-medium">
        No internet connection — check your connection and try again.
      </span>
      <button
        onClick={() => window.location.reload()}
        className="press shrink-0 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"
      >
        Retry
      </button>
    </div>
  );
}
