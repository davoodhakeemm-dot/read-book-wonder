import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ImagePlus,
  Mic,
  Search,
  Send,
  Settings,
  Smile,
  Square,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  type MediaKind,
  conversationFor,
  formatRelative,
  formatTime,
  handleOf,
  initialsOf,
  isOnline,
  lastMessageFor,
  markSeen,
  presenceLabel,
  sendMessage,
  touchPresence,
  unreadCount,
  useChat,
} from "@/lib/chat-store";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Private chats — Reading Corner" },
      {
        name: "description",
        content:
          "Chat live with every account: online status, typing and seen signals, photos, videos and voice notes.",
      },
      { property: "og:title", content: "Private chats — Reading Corner" },
      {
        property: "og:description",
        content: "Live private chats with photos, videos and voice notes.",
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
  name,
  dp,
  online,
  size = "md",
}: {
  name: string;
  dp?: string | undefined;
  online?: boolean | undefined;
  size?: "md" | "lg";
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "grid place-items-center overflow-hidden rounded-full bg-brand font-display font-bold text-primary-foreground",
          size === "lg" ? "size-12 text-base" : "size-11 text-sm",
        )}
      >
        {dp ? (
          <img src={dp} alt={`${name} profile photo`} className="size-full object-cover" />
        ) : (
          initialsOf(name)
        )}
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
  const { ready, session, me, accounts, messages } = useChat();
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<{ data: string; kind: MediaKind } | null>(null);
  const [emoji, setEmoji] = useState(false);
  const [directory, setDirectory] = useState(false);
  const [, setTick] = useState(0);
  const [recording, setRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (ready && !session) navigate({ to: "/auth", replace: true });
  }, [ready, session, navigate]);

  // Keep my presence fresh and refresh everyone's online/offline signal.
  useEffect(() => {
    if (!session) return;
    touchPresence();
    const id = window.setInterval(() => {
      touchPresence();
      setTick((t) => t + 1);
    }, 30_000);
    return () => window.clearInterval(id);
  }, [session]);

  const directoryList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts
      .filter((a) => !q || a.username.toLowerCase().includes(q) || handleOf(a).includes(q))
      .sort((a, b) => {
        const oa = Number(isOnline(a, session)) - Number(isOnline(b, session));
        return oa !== 0 ? -oa : a.username.localeCompare(b.username);
      });
  }, [accounts, query, session]);


  const peers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = accounts.filter(
      (a) => a.id !== session && (!q || a.username.toLowerCase().includes(q)),
    );
    return [...list].sort((a, b) => {
      const la = session ? lastMessageFor(messages, session, a.id)?.at ?? "" : "";
      const lb = session ? lastMessageFor(messages, session, b.id)?.at ?? "" : "";
      return lb.localeCompare(la);
    });
  }, [accounts, query, messages, session]);

  const peer = peers.find((p) => p.id === selected) ?? null;
  const thread = session && selected ? conversationFor(messages, session, selected) : [];

  useEffect(() => {
    if (selected) markSeen(selected);
  }, [selected, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!peer) return;
    const text = draft.trim();
    if (!text && !attachment) return;
    const label =
      text ||
      (attachment?.kind === "video"
        ? "Sent a video"
        : attachment?.kind === "audio"
          ? "Voice note"
          : "Sent a photo");
    sendMessage(peer.id, label, attachment ?? undefined);
    setDraft("");
    setAttachment(null);
    setEmoji(false);
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const kind: MediaKind = file.type.startsWith("video")
      ? "video"
      : file.type.startsWith("audio")
        ? "audio"
        : "image";
    const reader = new FileReader();
    reader.onload = () => setAttachment({ data: String(reader.result), kind });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (ev) => chunks.push(ev.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const reader = new FileReader();
        reader.onload = () => setAttachment({ data: String(reader.result), kind: "audio" });
        reader.readAsDataURL(new Blob(chunks, { type: "audio/webm" }));
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      toast("Microphone unavailable", { description: "Allow mic access to record a voice note." });
    }
  }

  if (!me || !session) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl md:gap-4 md:px-4 md:py-4">
        <aside
          className={cn(
            "flex w-full flex-col md:w-80 md:shrink-0 md:rounded-3xl md:bg-card md:shadow-soft",
            peer && "hidden md:flex",
          )}
        >
          <div className="sticky top-0 z-10 rounded-b-3xl bg-night px-4 py-4 text-primary-foreground md:rounded-3xl">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/messages" })}
                aria-label="Back"
                className="press grid size-9 place-items-center rounded-full bg-primary-foreground/15"
              >
                <ArrowLeft className="size-4" />
              </button>
              <Avatar name={me.username} dp={me.dp} online size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-bold">{me.username}</p>
                <p className="text-xs text-primary-foreground/70">Online</p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/chat-settings" })}
                aria-label="Chat settings"
                className="press grid size-9 place-items-center rounded-full bg-primary-foreground/15"
              >
                <Settings className="size-4" />
              </button>
            </div>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary-foreground/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search accounts"
                className="w-full rounded-full bg-primary-foreground/15 py-2.5 pl-10 pr-3.5 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/60"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
            {peers.map((p) => {
              const last = lastMessageFor(messages, session, p.id);
              const count = unreadCount(messages, session, p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    selected === p.id ? "bg-secondary" : "hover:bg-secondary/60",
                  )}
                >
                  <Avatar name={p.username} dp={p.dp} online={p.online} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold">{p.username}</span>
                      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                        {last ? formatRelative(last.at) : ""}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {last
                          ? `${last.from === session ? "You: " : ""}${last.text}`
                          : p.lastActive ?? p.bio ?? "Say hello"}
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
            {!peers.length && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No accounts match “{query}”.
              </p>
            )}
          </div>
        </aside>

        <section
          className={cn(
            "flex min-w-0 flex-1 flex-col md:rounded-3xl md:bg-card md:shadow-soft",
            !peer && "hidden md:flex",
          )}
        >
          {peer ? (
            <>
              <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/70 bg-background/90 px-3 py-3 backdrop-blur-md md:rounded-t-3xl md:bg-card/90">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Back to accounts"
                  className="press grid size-9 place-items-center rounded-full bg-secondary md:hidden"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <Avatar name={peer.username} dp={peer.dp} online={peer.online} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{peer.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {peer.online ? "Online" : (peer.lastActive ?? "Offline")}
                  </p>
                </div>
              </header>

              <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
                {thread.map((m) => {
                  const mine = m.from === session;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[78%] rounded-3xl px-4 py-2.5 text-sm shadow-soft",
                          mine
                            ? "rounded-br-lg bg-primary text-primary-foreground"
                            : "rounded-bl-lg bg-secondary text-secondary-foreground",
                        )}
                      >
                        {m.media && m.mediaKind === "image" && (
                          <img
                            src={m.media}
                            alt="Shared photo"
                            className="mb-2 max-h-56 w-full rounded-2xl object-cover"
                          />
                        )}
                        {m.media && m.mediaKind === "video" && (
                          <video
                            src={m.media}
                            controls
                            className="mb-2 max-h-56 w-full rounded-2xl object-cover"
                          />
                        )}
                        {m.media && m.mediaKind === "audio" && (
                          <audio src={m.media} controls className="mb-2 w-52" />
                        )}
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                        <p
                          className={cn(
                            "mt-1 flex items-center justify-end gap-1 text-[10px]",
                            mine ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {formatTime(m.at)}
                          {mine &&
                            (m.seen ? (
                              <CheckCheck className="size-3" />
                            ) : (
                              <Check className="size-3" />
                            ))}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
                  {attachment.kind === "image" ? (
                    <img
                      src={attachment.data}
                      alt="Attachment preview"
                      className="size-12 rounded-xl object-cover"
                    />
                  ) : attachment.kind === "video" ? (
                    <video src={attachment.data} className="size-12 rounded-xl object-cover" />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-xl bg-secondary">
                      <Mic className="size-5" />
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {attachment.kind === "audio"
                      ? "Voice note ready to send"
                      : attachment.kind === "video"
                        ? "Video ready to send"
                        : "Photo ready to send"}
                  </p>
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
                  aria-label="Attach photo or video"
                  className="press grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
                >
                  <ImagePlus className="size-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={toggleRecording}
                  aria-label={recording ? "Stop recording" : "Record a voice note"}
                  className={cn(
                    "press grid size-10 shrink-0 place-items-center rounded-full",
                    recording
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {recording ? <Square className="size-4" /> : <Mic className="size-[18px]" />}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
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
                  placeholder={`Message ${peer.username}…`}
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
              <p className="font-display text-lg font-bold">Pick an account to start chatting</p>
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
