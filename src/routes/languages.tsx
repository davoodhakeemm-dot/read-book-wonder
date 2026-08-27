import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/AppShell";
import { LanguageChips } from "@/components/Sections";

export const Route = createFileRoute("/languages")({
  head: () => ({
    meta: [
      { title: "Languages — Reading Corner" },
      {
        name: "description",
        content:
          "Read in English, Malayalam, Kannada, Hindi, Tamil, Telugu, Arabic and more world languages.",
      },
      { property: "og:title", content: "Languages — Reading Corner" },
      { property: "og:description", content: "Browse books by language." },
    ],
  }),
  component: LanguagesPage,
});

function LanguagesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6">
        <PageHeader title="Languages" subtitle="Stories in the language you think in." />
        <LanguageChips />
      </div>
    </AppShell>
  );
}
