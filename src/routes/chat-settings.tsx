import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, Check, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { TripleTapExit } from "@/components/TripleTapExit";
import { initialsOf, signOut, updateProfile, useChat } from "@/lib/chat-store";

export const Route = createFileRoute("/chat-settings")({
  head: () => ({
    meta: [
      { title: "Chat settings — Reading Corner Messages" },
      {
        name: "description",
        content: "Update your profile photo, username and bio for Reading Corner Messages.",
      },
      { property: "og:title", content: "Chat settings — Reading Corner Messages" },
      { property: "og:description", content: "Update your photo, username and bio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatSettingsPage,
});

function ChatSettingsPage() {
  const navigate = useNavigate();
  const { ready, session, me } = useChat();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dp, setDp] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (ready && !session) navigate({ to: "/auth", replace: true });
  }, [ready, session, navigate]);

  useEffect(() => {
    if (me && !loaded.current) {
      loaded.current = true;
      setUsername(me.username);
      setBio(me.bio ?? "");
      setDp(me.dp ?? null);
    }
  }, [me]);

  function pickDp(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDp(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    const name = username.trim();
    if (name.length < 3) {
      setError("Use at least 3 characters for your username.");
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
      setError("Letters, numbers, dot, dash and underscore only.");
      return;
    }
    const result = updateProfile({ username: name, bio, dp: dp ?? "" });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setSaved(true);
  }

  if (!me) return null;

  return (
    <div className="min-h-screen bg-background px-5 py-8">
      <TripleTapExit />
      <div className="mx-auto w-full max-w-sm">
        <button
          type="button"
          onClick={() => navigate({ to: "/messages" })}
          className="press inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </button>

        <h1 className="mt-6 font-display text-2xl font-extrabold">Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Your photo and username are what other readers see in chat.
        </p>

        <form onSubmit={save} noValidate className="mt-6 space-y-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Change profile photo"
              className="press relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary font-display text-lg font-bold text-secondary-foreground"
            >
              {dp ? (
                <img src={dp} alt="Your profile photo" className="size-full object-cover" />
              ) : (
                initialsOf(username || me.username)
              )}
              <span className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-brand text-primary-foreground">
                <Camera className="size-3.5" />
              </span>
            </button>
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Profile photo</p>
              <p className="mt-0.5">Pick a new image from your gallery.</p>
              {dp && (
                <button
                  type="button"
                  onClick={() => setDp(null)}
                  className="mt-1 font-semibold text-primary"
                >
                  Remove photo
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={pickDp} className="hidden" />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Username
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Bio
            </span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="What are you reading right now?"
              className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          {error && (
            <p className="rounded-2xl bg-destructive/10 px-3.5 py-2.5 text-xs font-semibold text-destructive">
              {error}
            </p>
          )}
          {saved && (
            <p className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3.5 py-2.5 text-xs font-semibold text-primary">
              <Check className="size-4" /> Saved.
            </p>
          )}

          <button
            type="submit"
            className="press w-full rounded-full bg-brand py-3.5 text-sm font-bold text-primary-foreground shadow-lift"
          >
            Save changes
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            signOut();
            navigate({ to: "/auth", replace: true });
          }}
          className="press mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3.5 text-sm font-bold text-secondary-foreground"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </div>
  );
}
