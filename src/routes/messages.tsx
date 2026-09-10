import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Settings, Sparkles } from "lucide-react";
import { useEffect } from "react";

import { TripleTapExit } from "@/components/TripleTapExit";
import { initialsOf, useChat } from "@/lib/chat-store";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Your space — Reading Corner Messages" },
      {
        name: "description",
        content: "Open your private chats or update your profile photo and username.",
      },
      { property: "og:title", content: "Your space — Reading Corner Messages" },
      {
        property: "og:description",
        content: "Open your private chats or update your profile.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MessagesHub,
});

function MessagesHub() {
  const navigate = useNavigate();
  const { ready, session, me } = useChat();

  useEffect(() => {
    if (ready && !session) navigate({ to: "/auth", replace: true });
  }, [ready, session, navigate]);

  if (!me) return null;

  return (
    <div className="min-h-screen bg-night px-5 py-10 text-primary-foreground">
      <TripleTapExit />
      <div className="mx-auto w-full max-w-sm">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="press inline-flex items-center gap-2 text-xs font-semibold text-primary-foreground/70"
        >
          <ArrowLeft className="size-4" /> Back to Reading Corner
        </button>

        <div className="mt-8 flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-brand font-display text-xl font-bold text-primary-foreground">
            {me.dp ? (
              <img src={me.dp} alt={`${me.username} profile photo`} className="size-full object-cover" />
            ) : (
              initialsOf(me.username)
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-extrabold">{me.username}</p>
            <p className="text-xs text-primary-foreground/70">You're online</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            to="/chat"
            className="press flex w-full items-center gap-4 rounded-3xl bg-card p-5 text-left text-foreground shadow-lift"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-primary-foreground">
              <MessageCircle className="size-5" />
            </span>
            <span>
              <span className="block font-display text-base font-bold">Private chats</span>
              <span className="block text-xs text-muted-foreground">
                All accounts, live messages, photos, videos and voice notes.
              </span>
            </span>
          </Link>
          <Link
            to="/chat-settings"
            className="press flex w-full items-center gap-4 rounded-3xl bg-card p-5 text-left text-foreground shadow-lift"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
              <Settings className="size-5" />
            </span>
            <span>
              <span className="block font-display text-base font-bold">Settings</span>
              <span className="block text-xs text-muted-foreground">
                Change your profile photo, username and bio.
              </span>
            </span>
          </Link>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-primary-foreground/60">
          <Sparkles className="size-3" /> Tap the screen 3 times to jump back to reading.
        </p>
      </div>
    </div>
  );
}
