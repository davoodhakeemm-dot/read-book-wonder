
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Compass,
  Grid2X2,
  Heart,
  Home,
  Languages,
  Library,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/library", label: "Library", icon: Library },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const DESKTOP_NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/categories", label: "Categories", icon: Grid2X2 },
  { to: "/languages", label: "Languages", icon: Languages },
  { to: "/library", label: "Library", icon: Library },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/history", label: "History", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const typedText = useRef("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        typedText.current += e.key.toLowerCase();
        typedText.current = typedText.current.slice(-2);
      }

      if (typedText.current === "hi") {
        typedText.current = "";
        window.location.href = "/chat";
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Link to="/home" className="mb-8 flex items-center gap-2.5 px-2">
          <Logo className="size-9" />
          <span className="font-display text-lg font-bold leading-tight">
            Reading
            <br />
            Corner
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {DESKTOP_NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="size-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl bg-hero p-4">
          <p className="font-display text-sm font-bold">Keep reading</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Pick up exactly where you left off.
          </p>

          <Link
            to="/library"
            className="press mt-3 inline-flex rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            My Library
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md lg:hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <Link
              to="/home"
              className="flex min-w-0 items-center gap-2"
            >
              <Logo className="size-8 shrink-0" />
              <span className="truncate font-display text-base font-bold">
                Reading Corner
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-1">
              <Link
                to="/search"
                aria-label="Search books"
                className="press grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <Search className="size-[18px]" />
              </Link>

              <Link
                to="/settings"
                aria-label="Settings"
                className="press grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <Settings className="size-[18px]" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-24 lg:pb-10">
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-5">
            {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;

              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[20px]",
                      active && "fill-primary/15",
                    )}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}
