import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  Check,
  ImagePlus,
  LogOut,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  AUTO_REPLIES,
  FRIENDS,
  clearUnread,
  conversationFor,
  formatRelative,
  formatTime,
  lastMessageFor,
  receiveMessage,
  sendMessage,
  signOut,
  useChat,
} from "@/lib/chat-store";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Messages — Reading Corner" },
      {
        name: "description",
        content:
          "Chat live with your reading friends: online status, typing indicators, photos and instant message bubbles.",
      },
      { property: "og:title", content: "Messages — Reading Corner" },
      {
        property: "og:description",
        content: "Live chat with your reading friends inside Reading Corner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatPage,
});

const EMOJIS = ["😀", "😂", "🥰", "😍", "🤔", "👍", "🙌", "🔥", "✨", "📚", "☕", "🌙", "❤️", "🎉", "😭", "👀"];

function Avatar({
  initials,
  online,
  size = "md",
}: {
  initials: string;
  online?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "grid place-items-center rounded-full bg-brand font-display font-bold text-primary-foreground",
          size === "lg" ? "size-12 text-base" : "size-11 text-sm",
        )}
      >
        {initials}
      </span>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 size-3 rounded-full border-2 border-card",
            online ? "bg-emerald-500" : "bg-muted-foreground/50",
          )}
        />
      )}
    </span>
  );
}

function ChatPage() {
  const navigate = useNavigate();
  const { session, ready, messages, unread } = useChat();
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [emoji, setEmoji] = useState(false);
  const [typing, setTyping] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && !session) navigate({ to: "/auth", replace: true });
  }, [ready, session, navigate]);

  const friends = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? FRIENDS.filter(
          (f) => f.name.toLowerCase().includes(q) || f.handle.toLowerCase().includes(q),
        )
      : FRIENDS;
    return [...list].sort((a, b) => {
      const la = lastMessageFor(messages, a.id)?.at ?? "";
      const lb = lastMessageFor(messages, b.id)?.at ?? "";
      return lb.localeCompare(la);
    });
  }, [query, messages]);

  const friend = FRIENDS.find((f) => f.id === selected) ?? null;
  const thread = selected ? conversationFor(messages, selected) : [];

  useEffect(() => {
    if (selected) clearUnread(selected);
  }, [selected, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread.length, typing]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!friend) return;
    const text = draft.trim();
    if (!text && !attachment) return;
    sendMessage(friend.id, text || "Sent a photo", attachment ?? undefined);
    setDraft("");
    setAttachment(null);
    setEmoji(false);

    const target = friend;
    setTyping(target.id);
    window.setTimeout(() => {
      setTyping(null);
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]!;
      receiveMessage(target.id, reply, false);
      toast(`${target.name}`, { description: reply, icon: <Bell className="size-4" /> });
    }, 1800);
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAttachment(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl md:gap-4 md:px-4 md:py-4">
        {/* Friends list */}
        <aside
          className={cn(
            "flex w-full flex-col md:w-80 md:shrink-0 md:rounded-3xl md:bg-card md:shadow-soft",
            friend && "hidden md:flex",
          )}
        >
          <div className="sticky top-0 z-10 rounded-b-3xl bg-night px-4 py-4 text-primary-foreground md:rounded-3xl">
            <div className="flex items-center gap-3">
              <Avatar initials={session.slice(0, 2).toUpperCase()} online size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-bold">{session}</p>
                <p className="text-xs text-primary-foreground/70">Online</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  navigate({ to: "/auth", replace: true });
                }}
                aria-label="Sign out"
                className="press grid size-9 place-items-center rounded-full bg-primary-foreground/15"
              >
                <LogOut className="size-4" />
              </button>
            </div>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary-foreground/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search friends"
                className="w-full rounded-full bg-primary-foreground/15 py-2.5 pl-10 pr-3.5 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/60"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
            {friends.map((f) => {
              const last = lastMessageFor(messages, f.id);
              const count = unread[f.id] ?? 0;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelected(f.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    selected === f.id ? "bg-secondary" : "hover:bg-secondary/60",
                  )}
                >
                  <Avatar initials={f.avatar} online={f.online} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold">{f.name}</span>
                      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                        {last ? formatRelative(last.at) : ""}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {last ? `${last.from === "me" ? "You: " : ""}${last.text}` : f.lastActive}
                      </span>
                      {count > 0 && (
                        <span className="ml-auto grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">
                          {count}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
            {!friends.length && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No friends match “{query}”.
              </p>
            )}
          </div>
        </aside>

        {/* Conversation */}
        <section
          className={cn(
            "flex min-w-0 flex-1 flex-col md:rounded-3xl md:bg-card md:shadow-soft",
            !friend && "hidden md:flex",
          )}
        >
          {friend ? (
            <>
              <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/70 bg-background/90 px-3 py-3 backdrop-blur-md md:rounded-t-3xl md:bg-card/90">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Back to friends"
                  className="press grid size-9 place-items-center rounded-full bg-secondary md:hidden"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <Avatar initials={friend.avatar} online={friend.online} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {typing === friend.id
                      ? "typing…"
                      : friend.online
                        ? "Online"
                        : friend.lastActive}
                  </p>
                </div>
              </header>

              <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
                {thread.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[78%] rounded-3xl px-4 py-2.5 text-sm shadow-soft",
                        m.from === "me"
                          ? "rounded-br-lg bg-primary text-primary-foreground"
                          : "rounded-bl-lg bg-secondary text-secondary-foreground",
                      )}
                    >
                      {m.image && (
                        <img
                          src={m.image}
                          alt="Shared attachment"
                          className="mb-2 max-h-56 w-full rounded-2xl object-cover"
                        />
                      )}
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <p
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-[10px]",
                          m.from === "me"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {formatTime(m.at)}
                        {m.from === "me" && <Check className="size-3" />}
                      </p>
                    </div>
                  </div>
                ))}
                {typing === friend.id && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-3xl rounded-bl-lg bg-secondary px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {emoji && (
                <div className="grid grid-cols-8 gap-1 border-t border-border/70 px-3 py-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setDraft((d) => d + e)}
                      className="press rounded-xl py-1.5 text-lg"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              {attachment && (
                <div className="flex items-center gap-3 border-t border-border/70 px-4 py-2">
                  <img
                    src={attachment}
                    alt="Attachment preview"
                    className="size-12 rounded-xl object-cover"
                  />
                  <p className="text-xs text-muted-foreground">Photo ready to send</p>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    aria-label="Remove attachment"
                    className="press ml-auto grid size-8 place-items-center rounded-full bg-secondary"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              <form
                onSubmit={handleSend}
                className="sticky bottom-0 flex items-end gap-2 border-t border-border/70 bg-background/95 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:rounded-b-3xl md:bg-card/95"
              >
                <button
                  type="button"
                  onClick={() => setEmoji((s) => !s)}
                  aria-label="Insert emoji"
                  className="press grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
                >
                  <Smile className="size-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Attach image or file"
                  className="press grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
                >
                  <ImagePlus className="size-[18px]" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={pickFile}
                  className="hidden"
                />
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  rows={1}
                  placeholder={`Message ${friend.name.split(" ")[0]}…`}
                  className="max-h-28 min-h-10 flex-1 resize-none rounded-3xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="press grid size-10 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground shadow-soft"
                >
                  <Send className="size-[18px]" />
                </button>
              </form>
            </>
          ) : (
            <div className="hidden flex-1 flex-col items-center justify-center gap-2 p-10 text-center md:flex">
              <p className="font-display text-lg font-bold">Pick a friend to start chatting</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Your conversations stay on this device.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
