import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Flame, Heart, Settings } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { useLibrary } from "@/lib/library-store";
import { CATEGORIES, LANGUAGES } from "@/lib/catalog";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Reading Corner" },
      {
        name: "description",
        content:
          "Your reading stats: books in progress, completed titles, favorites, streak, and your chosen languages and categories.",
      },
      { property: "og:title", content: "Your Profile — Reading Corner" },
      { property: "og:description", content: "See your reading stats and preferences." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state } = useLibrary();
  const inProgress = Object.keys(state.progress).filter((id) => !state.completed.includes(id));

  const stats = [
    { label: "Reading", value: inProgress.length, icon: BookOpen },
    { label: "Completed", value: state.completed.length, icon: CheckCircle2 },
    { label: "Favorites", value: state.favorites.length, icon: Heart },
    { label: "Day streak", value: state.streak, icon: Flame },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-5 sm:px-6">
        <PageHeader
          title="Profile"
          subtitle="Your reading life at a glance."
          action={
            <Link
              to="/settings"
              className="press inline-flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-semibold shadow-soft"
            >
              <Settings className="size-4" /> Settings
            </Link>
          }
        />

        <div className="flex items-center gap-4 rounded-3xl bg-hero p-5 shadow-soft">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand font-display text-2xl font-bold text-primary-foreground">
            {state.profile.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-bold">{state.profile.name}</p>
            <p className="truncate text-sm text-muted-foreground">{state.profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-card p-4 shadow-soft">
              <Icon className="size-5 text-primary" />
              <p className="mt-2 font-display text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="mb-3 text-lg font-bold">Your languages</h2>
          <div className="flex flex-wrap gap-2">
            {state.languages.length ? (
              state.languages.map((code) => {
                const l = LANGUAGES.find((x) => x.code === code);
                return (
                  <span
                    key={code}
                    className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-soft"
                  >
                    {l?.flag} {l?.name ?? code}
                  </span>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No languages selected yet.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Your interests</h2>
          <div className="flex flex-wrap gap-2">
            {state.categories.length ? (
              state.categories.map((slug) => {
                const c = CATEGORIES.find((x) => x.slug === slug);
                return (
                  <span
                    key={slug}
                    className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-soft"
                  >
                    {c?.icon} {c?.name ?? slug}
                  </span>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No categories selected yet.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
