import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, Lock, LogIn, User, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/Logo";
import { TripleTapExit } from "@/components/TripleTapExit";
import { cn } from "@/lib/utils";
import { createAccount, initialsOf, signIn, useChat } from "@/lib/chat-store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Reading Corner Messages" },
      {
        name: "description",
        content:
          "Create an account or sign in to Reading Corner Messages to chat with other readers in real time.",
      },
      { property: "og:title", content: "Sign in — Reading Corner Messages" },
      {
        property: "og:description",
        content: "Create an account or sign in to chat with other readers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "choose" | "create" | "login";

type Errors = Partial<Record<"username" | "password" | "confirm" | "form", string>>;

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
  error,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "password";
  icon: typeof User;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full rounded-2xl border bg-card py-3 pl-10 pr-3.5 text-sm outline-none transition-colors focus:border-primary",
            error ? "border-destructive" : "border-border",
          )}
        />
      </span>
      {error && <span className="mt-1.5 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { session, ready } = useChat();
  const [mode, setMode] = useState<Mode>("choose");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dp, setDp] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready && session) navigate({ to: "/messages", replace: true });
  }, [ready, session, navigate]);

  function reset(next: Mode) {
    setMode(next);
    setErrors({});
    setPassword("");
    setConfirm("");
  }

  function pickDp(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDp(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    const name = username.trim();
    if (!name) next.username = "Username is required.";
    else if (name.length < 3) next.username = "Use at least 3 characters.";
    else if (!/^[a-zA-Z0-9._-]+$/.test(name))
      next.username = "Letters, numbers, dot, dash and underscore only.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Use at least 6 characters.";
    if (mode === "create") {
      if (!confirm) next.confirm = "Please confirm your password.";
      else if (confirm !== password) next.confirm = "Passwords do not match.";
    }
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});

    const result =
      mode === "create"
        ? createAccount(name, password, dp ?? undefined)
        : signIn(name, password);
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    navigate({ to: "/messages", replace: true });
  }

  return (
    <div className="relative min-h-screen bg-night px-5 py-10 text-primary-foreground">
      <TripleTapExit />
      <div className="mx-auto w-full max-w-sm">
        <button
          type="button"
          onClick={() => (mode === "choose" ? navigate({ to: "/home" }) : reset("choose"))}
          className="press inline-flex items-center gap-2 text-xs font-semibold text-primary-foreground/70"
        >
          <ArrowLeft className="size-4" />
          {mode === "choose" ? "Back to Reading Corner" : "Back to options"}
        </button>

        <div className="mt-8 text-center">
          <Logo className="mx-auto size-12" />
          <h1 className="mt-4 font-display text-2xl font-extrabold">Reading Corner Messages</h1>
          <p className="mt-1 text-xs text-primary-foreground/70">
            Private conversations with other readers.
          </p>
        </div>

        {mode === "choose" ? (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => reset("create")}
              className="press flex w-full items-center gap-4 rounded-3xl bg-card p-5 text-left text-foreground shadow-lift"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-primary-foreground">
                <UserPlus className="size-5" />
              </span>
              <span>
                <span className="block font-display text-base font-bold">Create new account</span>
                <span className="block text-xs text-muted-foreground">
                  Pick a username, a password and a profile photo.
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => reset("login")}
              className="press flex w-full items-center gap-4 rounded-3xl bg-card p-5 text-left text-foreground shadow-lift"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                <LogIn className="size-5" />
              </span>
              <span>
                <span className="block font-display text-base font-bold">
                  Login into existing account
                </span>
                <span className="block text-xs text-muted-foreground">
                  Use the username and password you already made.
                </span>
              </span>
            </button>
          </div>
        ) : (
          <div className="mt-7 rounded-3xl bg-card p-5 text-foreground shadow-lift">
            <h2 className="font-display text-lg font-bold">
              {mode === "create" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "create"
                ? "Add a photo from your gallery, then choose your login details."
                : "Enter your username and password to open your chats."}
            </p>

            {mode === "create" && (
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="press relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary font-display text-lg font-bold text-secondary-foreground"
                  aria-label="Choose a profile photo"
                >
                  {dp ? (
                    <img src={dp} alt="Your profile photo" className="size-full object-cover" />
                  ) : username.trim() ? (
                    initialsOf(username)
                  ) : (
                    <Camera className="size-6" />
                  )}
                  <span className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-brand text-primary-foreground">
                    <Camera className="size-3.5" />
                  </span>
                </button>
                <div className="text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Profile photo</p>
                  <p className="mt-0.5">Tap the circle to pick an image from your gallery.</p>
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
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={pickDp}
                  className="hidden"
                />
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
              <Field
                label="Username"
                icon={User}
                value={username}
                onChange={setUsername}
                autoComplete="username"
                placeholder="yourname"
                {...(errors.username ? { error: errors.username } : {})}
              />
              <Field
                label="Password"
                icon={Lock}
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                {...(errors.password ? { error: errors.password } : {})}
              />
              {mode === "create" && (
                <Field
                  label="Confirm password"
                  icon={Lock}
                  type="password"
                  value={confirm}
                  onChange={setConfirm}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...(errors.confirm ? { error: errors.confirm } : {})}
                />
              )}

              {errors.form && (
                <p className="rounded-2xl bg-destructive/10 px-3.5 py-2.5 text-xs font-semibold text-destructive">
                  {errors.form}
                </p>
              )}

              <button
                type="submit"
                className="press w-full rounded-full bg-brand py-3.5 text-sm font-bold text-primary-foreground shadow-lift"
              >
                {mode === "create" ? "Create account" : "Login"}
              </button>
            </form>
          </div>
        )}

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-primary-foreground/60">
          <Lock className="size-3" /> Accounts stay on this device only.
        </p>
      </div>
    </div>
  );
}
