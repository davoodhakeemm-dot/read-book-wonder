import { Link, createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { useLibrary } from "@/lib/library-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Reading Corner" },
      {
        name: "description",
        content:
          "Control app appearance, reading defaults, notifications and reset your local reading data.",
      },
      { property: "og:title", content: "Settings — Reading Corner" },
      { property: "og:description", content: "Tune Reading Corner to the way you read." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, update, setReader, reset } = useLibrary();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-5 sm:px-6">
        <PageHeader title="Settings" subtitle="Appearance, reading defaults and data." />

        <Card title="Appearance">
          <Row label="App theme">
            <Segmented
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ]}
              value={state.appTheme}
              onChange={(v) => update({ appTheme: v as typeof state.appTheme })}
            />
          </Row>
        </Card>

        <Card title="Reading defaults">
          <Row label="Reader theme">
            <Segmented
              options={[
                { value: "light", label: "Light" },
                { value: "sepia", label: "Sepia" },
                { value: "dark", label: "Night" },
              ]}
              value={state.reader.theme}
              onChange={(v) => setReader({ theme: v as typeof state.reader.theme })}
            />
          </Row>
          <Row label="Font">
            <Segmented
              options={[
                { value: "serif", label: "Serif" },
                { value: "sans", label: "Sans" },
              ]}
              value={state.reader.font}
              onChange={(v) => setReader({ font: v as typeof state.reader.font })}
            />
          </Row>
          <Row label="Line spacing">
            <Segmented
              options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
              ]}
              value={state.reader.lineSpacing}
              onChange={(v) => setReader({ lineSpacing: v as typeof state.reader.lineSpacing })}
            />
          </Row>
        </Card>

        <Card title="Notifications">
          <Toggle
            label="Daily reading reminder"
            checked={state.notifications.reminders}
            onChange={(v) =>
              update({ notifications: { ...state.notifications, reminders: v } })
            }
          />
          <Toggle
            label="New book announcements"
            checked={state.notifications.newBooks}
            onChange={(v) => update({ notifications: { ...state.notifications, newBooks: v } })}
          />
        </Card>

        <Card title="Preferences">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/onboarding/language"
              className="press rounded-full bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground"
            >
              Change languages
            </Link>
            <Link
              to="/onboarding/categories"
              className="press rounded-full bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground"
            >
              Change categories
            </Link>
          </div>
        </Card>

        <Card title="Data">
          <p className="text-sm text-muted-foreground">
            Your progress, favorites and bookmarks are stored on this device only.
          </p>
          <button
            onClick={() => reset()}
            className="press mt-3 inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-xs font-bold text-destructive-foreground"
          >
            <RotateCcw className="size-3.5" /> Reset all reading data
          </button>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-3xl bg-card p-5 shadow-soft">
      <h2 className="font-display text-base font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className="flex w-full items-center justify-between gap-3 text-left"
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand" : "bg-secondary",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-card shadow transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "press flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors",
            value === o.value
              ? "bg-brand text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
