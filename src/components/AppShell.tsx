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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
