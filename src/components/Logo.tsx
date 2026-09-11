import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <BookOpen
      data-secret-logo
      className={cn("shrink-0", className)}
      aria-hidden="true"
    />
  );
}
