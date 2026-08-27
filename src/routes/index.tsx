import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import heroBooks from "@/assets/hero-books.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reading Corner — Read • Explore • Imagine" },
      {
        name: "description",
        content:
          "Discover stories, knowledge and new worlds. A beautiful mobile-first reading platform with books in English, Malayalam, Kannada, Hindi, Tamil, Telugu and Arabic.",
      },
      { property: "og:title", content: "Reading Corner — Read • Explore • Imagine" },
      {
        property: "og:description",
        content: "Discover stories, knowledge and new worlds across languages and categories.",
      },
    ],
  }),
  component: Welcome,
});

function Splash() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-night px-8 text-center">
      <div className="fade-in-soft">
        <Logo className="mx-auto size-20 drop-shadow-lg" />
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-primary-foreground">
          Reading
          <br />
          Corner
        </h1>
        <p className="mt-3 text-sm font-medium tracking-[0.2em] text-primary-foreground/70">
          READ • EXPLORE • IMAGINE
        </p>
        <div className="mx-auto mt-10 h-1 w-40 overflow-hidden rounded-full bg-primary-foreground/20">
          <div className="h-full w-1/3 animate-[loading_1.6s_ease-in-out_infinite] rounded-full bg-primary-foreground/80" />
        </div>
        <p className="mt-3 text-xs text-primary-foreground/60">Loading your library…</p>
      </div>
      <style>{`@keyframes loading{0%{transform:translateX(-120%)}100%{transform:translateX(340%)}}`}</style>
    </div>
  );
}

function Welcome() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1900);
    return () => clearTimeout(t);
  }, []);

  if (splash) return <Splash />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero">
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center px-6 py-10 text-center lg:max-w-3xl lg:justify-center">
        <div className="rise flex items-center gap-2">
          <Logo className="size-8" />
          <span className="font-display text-sm font-bold uppercase tracking-[0.18em]">
            Reading Corner
          </span>
        </div>

        <img
          src={heroBooks}
          alt="A stack of colourful books beside an open book and a warm cup of coffee"
          width={1280}
          height={800}
          className="rise mt-6 w-full max-w-md rounded-3xl shadow-lift lg:max-w-lg"
        />

        <h1 className="rise mt-8 text-3xl font-extrabold leading-tight sm:text-4xl">
          Welcome to Reading Corner
        </h1>
        <p className="rise mt-3 max-w-sm text-sm text-muted-foreground sm:text-base">
          Discover stories, knowledge and new worlds.
        </p>

        <div className="rise mt-8 w-full max-w-xs space-y-3">
          <Link
            to="/onboarding/language"
            className="press block w-full rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lift"
          >
            Start Reading
          </Link>
          <Link
            to="/explore"
            className="press block w-full rounded-full border border-primary/30 bg-card px-6 py-3.5 text-sm font-bold text-primary"
          >
            Explore Books
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Already reading with us?{" "}
          <Link to="/home" className="font-semibold text-primary">
            Continue
          </Link>
        </p>
      </div>
    </div>
  );
}
