import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/AppShell";
import { CategoryChips } from "@/components/Sections";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Reading Corner" },
      {
        name: "description",
        content:
          "Browse every reading category: fiction, mystery, romance, adventure, psychology, science, history, business and more.",
      },
      { property: "og:title", content: "Categories — Reading Corner" },
      { property: "og:description", content: "Browse books by category." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6">
        <PageHeader title="Categories" subtitle="Sixteen shelves, one library." />
        <CategoryChips />
      </div>
    </AppShell>
  );
}
