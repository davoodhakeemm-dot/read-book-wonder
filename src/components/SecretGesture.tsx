import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const HOLD_MS = 7000;
const HIDDEN_PREFIXES = ["/auth", "/chat", "/messages"];

/**
 * Hold anywhere on the reading app for 7 seconds to open the private
 * messaging entrance. Any real drag/scroll cancels the gesture.
 */
export function SecretGesture() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);
  const tick = useRef<number | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  const disabled = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (disabled) return;

    function clear() {
      if (timer.current) window.clearTimeout(timer.current);
      if (tick.current) window.clearInterval(tick.current);
      timer.current = null;
      tick.current = null;
      start.current = null;
      setProgress(0);
    }

    function onDown(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      clear();
      start.current = { x: e.clientX, y: e.clientY };
      const began = Date.now();
      tick.current = window.setInterval(() => {
        setProgress(Math.min(1, (Date.now() - began) / HOLD_MS));
      }, 100);
      timer.current = window.setTimeout(() => {
        clear();
        navigate({ to: "/auth" });
      }, HOLD_MS);
    }

    function onMove(e: PointerEvent) {
      if (!start.current) return;
      if (Math.abs(e.clientX - start.current.x) > 14 || Math.abs(e.clientY - start.current.y) > 14)
        clear();
    }

    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", clear, true);
    window.addEventListener("pointercancel", clear, true);
    window.addEventListener("scroll", clear, true);
    return () => {
      clear();
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", clear, true);
      window.removeEventListener("pointercancel", clear, true);
      window.removeEventListener("scroll", clear, true);
    };
  }, [disabled, navigate]);

  if (disabled || progress < 0.45) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-primary/70 transition-[width] duration-100"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}
