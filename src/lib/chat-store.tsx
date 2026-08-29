/**
 * Local-only messaging store for Reading Corner's private chat area.
 * Accounts, friends and messages live in localStorage — no server involved.
 * Passwords are stored as a salted digest so plaintext never hits storage,
 * but this is a demo-grade flow, not production authentication.
 */
import { useSyncExternalStore } from "react";

export type Account = { username: string; digest: string; createdAt: string };

export type Message = {
  id: string;
  friendId: string;
  from: "me" | "them";
  text: string;
  image?: string;
  at: string;
};

export type Friend = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  online: boolean;
  lastActive: string;
};

type ChatState = {
  ready: boolean;
  accounts: Account[];
  session: string | null;
  messages: Message[];
  unread: Record<string, number>;
};

const KEY = "reading-corner.chat.v1";

export const FRIENDS: Friend[] = [
  {
    id: "amelia",
    name: "Amelia Rose",
    handle: "@amelia",
    avatar: "AR",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "noah",
    name: "Noah Feldman",
    handle: "@noahf",
    avatar: "NF",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "meera",
    name: "Meera Nair",
    handle: "@meera",
    avatar: "MN",
    online: false,
    lastActive: "Active 12m ago",
  },
  {
    id: "kabir",
    name: "Kabir Shah",
    handle: "@kabir",
    avatar: "KS",
    online: false,
    lastActive: "Active 2h ago",
  },
  {
    id: "lina",
    name: "Lina Haddad",
    handle: "@lina",
    avatar: "LH",
    online: true,
    lastActive: "Active now",
  },
  {
    id: "arjun",
    name: "Arjun Menon",
    handle: "@arjun",
    avatar: "AM",
    online: false,
    lastActive: "Active yesterday",
  },
];

function seedMessages(): Message[] {
  const now = Date.now();
  const m = (
    friendId: string,
    from: "me" | "them",
    text: string,
    minutesAgo: number,
  ): Message => ({
    id: `${friendId}-${minutesAgo}-${from}`,
    friendId,
    from,
    text,
    at: new Date(now - minutesAgo * 60_000).toISOString(),
  });
  return [
    m("amelia", "them", "Did you finish Jane Eyre yet? 👀", 240),
    m("amelia", "me", "Two chapters left. It's so good.", 236),
    m("amelia", "them", "Tell me the moment you're done!", 8),
    m("noah", "me", "Sending you the Gatsby quote I loved.", 180),
    m("noah", "them", "Please do — I'm starting it tonight.", 42),
    m("meera", "them", "Thirukkural readalong this weekend?", 700),
    m("kabir", "me", "Added Animal Farm to my library.", 1500),
    m("lina", "them", "Gitanjali hits differently at night 🌙", 90),
  ];
}

const EMPTY: ChatState = {
  ready: false,
  accounts: [],
  session: null,
  messages: [],
  unread: {},
};

let state: ChatState = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        accounts: state.accounts,
        session: state.session,
        messages: state.messages,
        unread: state.unread,
      }),
    );
  } catch {
    /* storage blocked */
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
  let next: ChatState = { ...EMPTY, ready: true, messages: seedMessages() };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ChatState>;
      next = {
        ready: true,
        accounts: parsed.accounts ?? [],
        session: parsed.session ?? null,
        messages: parsed.messages?.length ? parsed.messages : seedMessages(),
        unread: parsed.unread ?? {},
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
  state = next;
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

export function createAccount(username: string, password: string) {
  const name = username.trim();
  if (state.accounts.some((a) => a.username.toLowerCase() === name.toLowerCase())) {
    return { ok: false as const, error: "That username is already taken." };
  }
  const account: Account = {
    username: name,
    digest: digestPassword(name, password),
    createdAt: new Date().toISOString(),
  };
  set({ accounts: [...state.accounts, account], session: name });
  return { ok: true as const };
}

export function signIn(username: string, password: string) {
  const name = username.trim();
  const account = state.accounts.find((a) => a.username.toLowerCase() === name.toLowerCase());
  if (!account) return { ok: false as const, error: "No account found with that username." };
  if (account.digest !== digestPassword(account.username, password)) {
    return { ok: false as const, error: "Incorrect password. Please try again." };
  }
  set({ session: account.username });
  return { ok: true as const };
}

export function signOut() {
  set({ session: null });
}

export function resetPassword(username: string, password: string) {
  const name = username.trim();
  const account = state.accounts.find((a) => a.username.toLowerCase() === name.toLowerCase());
  if (!account) return { ok: false as const, error: "No account found with that username." };
  set({
    accounts: state.accounts.map((a) =>
      a.username === account.username
        ? { ...a, digest: digestPassword(account.username, password) }
        : a,
    ),
  });
  return { ok: true as const };
}

export function sendMessage(friendId: string, text: string, image?: string) {
  const msg: Message = {
    id: `${friendId}-${Date.now()}-me`,
    friendId,
    from: "me",
    text,
    at: new Date().toISOString(),
    ...(image ? { image } : {}),
  };
  set({ messages: [...state.messages, msg] });
  return msg;
}

export function receiveMessage(friendId: string, text: string, markUnread: boolean) {
  const msg: Message = {
    id: `${friendId}-${Date.now()}-them`,
    friendId,
    from: "them",
    text,
    at: new Date().toISOString(),
  };
  set({
    messages: [...state.messages, msg],
    unread: markUnread
      ? { ...state.unread, [friendId]: (state.unread[friendId] ?? 0) + 1 }
      : state.unread,
  });
  return msg;
}

export function clearUnread(friendId: string) {
  if (!state.unread[friendId]) return;
  const next = { ...state.unread };
  delete next[friendId];
  set({ unread: next });
}

export function useChat() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
}

export function conversationFor(messages: Message[], friendId: string) {
  return messages
    .filter((m) => m.friendId === friendId)
    .sort((a, b) => a.at.localeCompare(b.at));
}

export function lastMessageFor(messages: Message[], friendId: string) {
  const list = conversationFor(messages, friendId);
  return list[list.length - 1];
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

export const AUTO_REPLIES = [
  "That's such a good pick 📚",
  "Ooh, adding that to my list right now.",
  "Same! I couldn't put it down.",
  "Let's do a readalong this week?",
  "Send me your favourite line from it ✨",
  "Haha, absolutely agree.",
];
