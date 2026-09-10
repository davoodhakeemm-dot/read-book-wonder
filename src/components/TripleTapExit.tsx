import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

/**
 * Tap the screen 3 times quickly (outside inputs and buttons) to leave the
 * private messaging area and return straight to the reading app.
 */
export function TripleTapExit({ to = "/home" }: { to?: "/home" }) {
  const navigate = useNavigate();
  const taps = useRef<number[]>([]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select, label, [role='button']")) return;
      const now = Date.now();
      taps.current = [...taps.current, now].filter((t) => now - t < 700);
      if (taps.current.length >= 3) {
        taps.current = [];
        navigate({ to, replace: true });
      }
    }
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [navigate, to]);

  return null;
}
