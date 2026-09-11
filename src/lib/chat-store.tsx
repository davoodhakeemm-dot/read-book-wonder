/**
 * Local-only messaging store for Reading Corner's private chat area.
 * Accounts, profile photos and messages live in localStorage — no server involved.
 * Passwords are stored as a salted digest so plaintext never hits storage,
 * but this is a demo-grade flow, not production authentication.
 */
import { useSyncExternalStore } from "react";

export type Account = {
  id: string;
  username: string;
  digest: string;
  dp?: string;
  bio?: string;
  createdAt: string;
  online?: boolean;
  lastActive?: string;
};

export type MediaKind = "image" | "video" | "audio";

export type Message = {
  id: string;
  thread: string;
  from: string; // account id
  to: string; // account id
  text: string;
  media?: string;
  mediaKind?: MediaKind;
  at: string;
  seen: boolean;
};

type ChatState = {
  ready: boolean;
  accounts: Account[];
  session: string | null; // account id
  messages: Message[];
};

const KEY = "reading-corner.chat.v2";

const EMPTY: ChatState = { ready: false, accounts: [], session: null, messages: [] };

let state: ChatState = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function threadKey(a: string, b: string) {
  return [a, b].sort().join("::");
}

function persist() {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        accounts: state.accounts,
        session: state.session,
        messages: state.messages.slice(-400),
      }),
    );
  } catch {
    /* storage blocked or full */
  }
}

function set(patch: Partial<ChatState>) {
  state = { ...state, ...patch };
  if (state.ready) persist();
  emit();
}

let hydrated = false;
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  let stored: Partial<ChatState> = {};
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) stored = JSON.parse(raw) as Partial<ChatState>;
  } catch {
    /* ignore corrupt storage */
  }
  const mine = stored.accounts ?? [];
  state = {
    ready: true,
    accounts: mine,
    session: stored.session ?? null,
    messages: stored.messages ?? [],
  };
  emit();
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Salted, non-reversible-enough digest for a local demo credential store. */
export function digestPassword(username: string, password: string) {
  const input = `rc::${username.toLowerCase()}::${password}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  for (let i = 0; i < input.length; i += 1) {
    const c = input.charCodeAt(i);
    h1 = (h1 ^ c) * 0x01000193;
    h2 = (h2 + c * (i + 7)) * 0x85ebca6b;
    h1 >>>= 0;
    h2 >>>= 0;
  }
  return `${h1.toString(36)}${h2.toString(36)}`;
}

export function createAccount(username: string, password: string, dp?: string) {
  const name = username.trim();
  if (state.accounts.some((a) => a.username.toLowerCase() === name.toLowerCase())) {
    return { ok: false as const, error: "That username is already taken." };
  }
  const account: Account = {
    id: `u-${Date.now().toString(36)}`,
    username: name,
    digest: digestPassword(name, password),
    createdAt: new Date().toISOString(),
    online: true,
    ...(dp ? { dp } : {}),
  };
  set({ accounts: [...state.accounts, account], session: account.id });
  return { ok: true as const };
}

export function signIn(username: string, password: string) {
  const name = username.trim().toLowerCase();
  const account = state.accounts.find((a) => a.username.toLowerCase() === name);
  if (!account) return { ok: false as const, error: "No account found with that username." };
  if (account.digest !== digestPassword(account.username, password)) {
    return { ok: false as const, error: "Incorrect password. Please try again." };
  }
  set({ session: account.id });
  return { ok: true as const };
}

export function signOut() {
  set({ session: null });
}

export function updateProfile(patch: { username?: string; dp?: string; bio?: string }) {
  const id = state.session;
  if (!id) return { ok: false as const, error: "You are not signed in." };
  if (patch.username) {
    const name = patch.username.trim();
    if (
      state.accounts.some(
        (a) => a.id !== id && a.username.toLowerCase() === name.toLowerCase(),
      )
    ) {
      return { ok: false as const, error: "That username is already taken." };
    }
  }
  set({
    accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
  });
  return { ok: true as const };
}

export function sendMessage(
  peerId: string,
  text: string,
  media?: { data: string; kind: MediaKind },
) {
  const me = state.session;
  if (!me) return null;
  const msg: Message = {
    id: `${peerId}-${Date.now()}-me`,
    thread: threadKey(me, peerId),
    from: me,
    to: peerId,
    text,
    at: new Date().toISOString(),
    seen: false,
    ...(media ? { media: media.data, mediaKind: media.kind } : {}),
  };
  set({ messages: [...state.messages, msg] });
  return msg;
}

export function receiveMessage(peerId: string, text: string) {
  const me = state.session;
  if (!me) return null;
  const msg: Message = {
    id: `${peerId}-${Date.now()}-them`,
    thread: threadKey(me, peerId),
    from: peerId,
    to: me,
    text,
    at: new Date().toISOString(),
    seen: true,
  };
  set({ messages: [...state.messages, msg] });
  return msg;
}

/** Mark my outgoing messages in a thread as seen by the other person. */
export function markSeen(peerId: string) {
  const me = state.session;
  if (!me) return;
  const key = threadKey(me, peerId);
  if (!state.messages.some((m) => m.thread === key && m.from === me && !m.seen)) return;
  set({
    messages: state.messages.map((m) =>
      m.thread === key && m.from === me ? { ...m, seen: true } : m,
    ),
  });
}

export function useChat() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
  const me = snapshot.accounts.find((a) => a.id === snapshot.session) ?? null;
  return { ...snapshot, me };
}

export function conversationFor(messages: Message[], meId: string, peerId: string) {
  const key = threadKey(meId, peerId);
  return messages.filter((m) => m.thread === key).sort((a, b) => a.at.localeCompare(b.at));
}

export function lastMessageFor(messages: Message[], meId: string, peerId: string) {
  const list = conversationFor(messages, meId, peerId);
  return list[list.length - 1];
}

export function unreadCount(messages: Message[], meId: string, peerId: string) {
  const key = threadKey(meId, peerId);
  return messages.filter((m) => m.thread === key && m.to === meId && !m.seen).length;
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

export function initialsOf(username: string) {
  const parts = username.replace(/[._-]+/g, " ").trim().split(/\s+/);
  return (parts[0]?.[0] ?? "?").concat(parts[1]?.[0] ?? "").toUpperCase();
}
