import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ReaderPrefs = {
  theme: "light" | "sepia" | "dark";
  fontSize: number; // px
  font: "serif" | "sans";
  lineSpacing: "small" | "medium" | "large";
  width: "compact" | "normal" | "wide";
  speechRate: number;
};

export type AppState = {
  onboarded: boolean;
  languages: string[];
  categories: string[];
  appTheme: "light" | "dark" | "system";
  reader: ReaderPrefs;
  notifications: { reminders: boolean; newBooks: boolean };
  profile: { name: string; email: string };
  progress: Record<string, { page: number; pages: number; updatedAt: string }>;
  favorites: string[];
  bookmarks: { bookId: string; page: number; at: string }[];
  completed: string[];
  history: { bookId: string; at: string }[];
  streak: number;
};

const DEFAULT_STATE: AppState = {
  onboarded: false,
  languages: [],
  categories: [],
  appTheme: "system",
  reader: {
    theme: "light",
    fontSize: 19,
    font: "serif",
    lineSpacing: "medium",
    width: "normal",
    speechRate: 1,
  },
  notifications: { reminders: true, newBooks: true },
  profile: { name: "Reader", email: "reader@readingcorner.app" },
  progress: {},
  favorites: [],
  bookmarks: [],
  completed: [],
  history: [],
  streak: 1,
};

const KEY = "reading-corner.v1";

type Ctx = {
  state: AppState;
  ready: boolean;
  update: (patch: Partial<AppState>) => void;
  setReader: (patch: Partial<ReaderPrefs>) => void;
  toggleFavorite: (bookId: string) => void;
  toggleBookmark: (bookId: string, page: number) => void;
  isBookmarked: (bookId: string, page: number) => boolean;
  saveProgress: (bookId: string, page: number, pages: number) => void;
  markCompleted: (bookId: string) => void;
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        setState((s) => ({
          ...s,
          ...parsed,
          reader: { ...s.reader, ...(parsed.reader ?? {}) },
          notifications: { ...s.notifications, ...(parsed.notifications ?? {}) },
          profile: { ...s.profile, ...(parsed.profile ?? {}) },
        }));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked */
    }
  }, [state, ready]);

  // App appearance
  useEffect(() => {
    if (!ready || typeof document === "undefined") return;
    const root = document.documentElement;
    const apply = () => {
      const dark =
        state.appTheme === "dark" ||
        (state.appTheme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [state.appTheme, ready]);

  const update = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const setReader = useCallback((patch: Partial<ReaderPrefs>) => {
    setState((s) => ({ ...s, reader: { ...s.reader, ...patch } }));
  }, []);

  const toggleFavorite = useCallback((bookId: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(bookId)
        ? s.favorites.filter((f) => f !== bookId)
        : [bookId, ...s.favorites],
    }));
  }, []);

  const toggleBookmark = useCallback((bookId: string, page: number) => {
    setState((s) => {
      const exists = s.bookmarks.some((b) => b.bookId === bookId && b.page === page);
      return {
        ...s,
        bookmarks: exists
          ? s.bookmarks.filter((b) => !(b.bookId === bookId && b.page === page))
          : [{ bookId, page, at: new Date().toISOString() }, ...s.bookmarks],
      };
    });
  }, []);

  const isBookmarked = useCallback(
    (bookId: string, page: number) =>
      state.bookmarks.some((b) => b.bookId === bookId && b.page === page),
    [state.bookmarks],
  );

  const saveProgress = useCallback((bookId: string, page: number, pages: number) => {
    setState((s) => {
      const at = new Date().toISOString();
      const history = [{ bookId, at }, ...s.history.filter((h) => h.bookId !== bookId)].slice(0, 40);
      const completed =
        page >= pages - 1 && !s.completed.includes(bookId) ? [bookId, ...s.completed] : s.completed;
      return {
        ...s,
        progress: { ...s.progress, [bookId]: { page, pages, updatedAt: at } },
        history,
        completed,
      };
    });
  }, []);

  const markCompleted = useCallback((bookId: string) => {
    setState((s) => ({
      ...s,
      completed: s.completed.includes(bookId) ? s.completed : [bookId, ...s.completed],
    }));
  }, []);

  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  const value = useMemo(
    () => ({
      state,
      ready,
      update,
      setReader,
      toggleFavorite,
      toggleBookmark,
      isBookmarked,
      saveProgress,
      markCompleted,
      reset,
    }),
    [
      state,
      ready,
      update,
      setReader,
      toggleFavorite,
      toggleBookmark,
      isBookmarked,
      saveProgress,
      markCompleted,
      reset,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}

export function progressPercent(page: number, pages: number) {
  if (pages <= 1) return 0;
  return Math.min(100, Math.round(((page + 1) / pages) * 100));
}
