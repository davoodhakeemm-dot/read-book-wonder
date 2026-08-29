import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { createAccount, resetPassword, signIn, useChat } from "@/lib/chat-store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Reading Corner Messages" },
      {
        name: "description",
        content:
          "Create an account or sign in to Reading Corner Messages to chat with reading friends in real time.",
      },
      { property: "og:title", content: "Sign in — Reading Corner Messages" },
      {
        property: "og:description",
        content: "Create an account or sign in to chat with your reading friends.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage;
});

type Mode = "login" | "create" | "forgot";

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
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && !show ? "password" : "text";

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full rounded-2xl border bg-card py-3 pl-10 text-sm outline-none transition-colors focus:border-primary",
            isPassword ? "pr-11" : "pr-3.5",
            error ? "border-destructive" : "border-border",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </span>
      {error && <span className="mt-1.5 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { session, ready } = useChat();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (ready && session) navigate({ to: "/chat", replace: true });
  }, [ready, session, navigate]);

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setNotice("");
    setPassword("");
    setConfirm("");
  }

  function validate(): Errors {
    const next: Errors = {};
    const name = username.trim();
    if (!name) next.username = "Username is required.";
    else if (name.length < 3) next.username = "Use at least 3 characters.";
    else if (!/^[a-zA-Z0-9._-]+$/.test(name))
      next.username = "Letters, numbers, dot, dash and underscore only.";

    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Use at least 6 characters.";

    if (mode !== "login") {
      if (!confirm) next.confirm = "Please confirm your password.";
      else if (confirm !== password) next.confirm = "Passwords do not match.";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice("");
    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setErrors({});

    const result =
      mode === "create"
        ? createAccount(username, password)
        : mode === "login"
          ? signIn(username, password)
          : resetPassword(username, password);

    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    if (mode === "forgot") {
      setNotice("Password updated. You can sign in now.");
      switchMode("login");
      setNotice("Password updated. You can sign in now.");
      return;
    }
    navigate({ to: "/chat", replace: true });
  }

  const title =
    mode === "create" ? "Create your account" : mode === "login" ? "Welcome back" : "Reset password";

  return (
    <div className="relative min-h-screen bg-night px-5 py-10 text-primary-foreground">
      <div className="mx-auto w-full max-w-sm">
        <Link
          to="/profile"
          className="press inline-flex items-center gap-2 text-xs font-semibold text-primary-foreground/70"
        >
          <ArrowLeft className="size-4" /> Back to Reading Corner
        </Link>

        <div className="mt-8 text-center">
          <Logo className="mx-auto size-12" />
          <h1 className="mt-4 font-display text-2xl font-extrabold">Reading Corner Messages</h1>
          <p className="mt-1 text-xs text-primary-foreground/70">
            Private conversations with your reading friends.
          </p>
        </div>

        <div className="mt-7 rounded-3xl bg-card p-5 text-foreground shadow-lift">
          {mode !== "forgot" && (
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
              {(["login", "create"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={cn(
                    "rounded-full py-2 text-xs font-bold transition-colors",
                    mode === m
                      ? "bg-brand text-primary-foreground shadow-soft"
                      : "text-muted-foreground",
                  )}
                >
                  {m === "login" ? "Login" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          <h2 className="font-display text-lg font-bold">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "create"
              ? "Pick a username and a password you'll remember."
              : mode === "login"
                ? "Sign in to open your chats."
                : "Enter your username and choose a new password."}
          </p>

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
              label={mode === "forgot" ? "New password" : "Password"}
              icon={Lock}
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••••"
              {...(errors.password ? { error: errors.password } : {})}
            />
            {mode !== "login" && (
              <Field
                label="Confirm password"
                icon={ShieldCheck}
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
            {notice && (
              <p className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3.5 py-2.5 text-xs font-semibold text-primary">
                <Check className="size-4" /> {notice}
              </p>
            )}

            <button
              type="submit"
              className="press w-full rounded-full bg-brand py-3.5 text-sm font-bold text-primary-foreground shadow-lift"
            >
              {mode === "create"
                ? "Create Account"
                : mode === "login"
                  ? "Login"
                  : "Update password"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            {mode === "login" ? (
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="font-semibold text-primary"
              >
                Forgot password?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-primary"
              >
                Back to login
              </button>
            )}
            {mode !== "create" && (
              <button
                type="button"
                onClick={() => switchMode("create")}
                className="font-semibold text-muted-foreground"
              >
                New here? Create account
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-primary-foreground/60">
          <Lock className="size-3" /> Accounts stay on this device only.
        </p>
      </div>
    </div>
  );
}
