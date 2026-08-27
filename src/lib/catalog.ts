export type LanguageCode =
  | "en"
  | "ml"
  | "kn"
  | "hi"
  | "ta"
  | "te"
  | "ar"
  | "other";

export type Language = {
  code: LanguageCode;
  name: string;
  native: string;
  flag: string;
};

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🕌" },
  { code: "other", name: "Other Languages", native: "World", flag: "🌍" },
];

export type CategorySlug =
  | "fiction"
  | "mystery"
  | "romance"
  | "adventure"
  | "psychology"
  | "science"
  | "history"
  | "biography"
  | "education"
  | "technology"
  | "cybersecurity"
  | "religion"
  | "children"
  | "self-development"
  | "business"
  | "literature";

export type Category = {
  slug: CategorySlug;
  name: string;
  icon: string;
  tint: string;
};

export const CATEGORIES: Category[] = [
  { slug: "fiction", name: "Fiction", icon: "📖", tint: "from-violet-200 to-violet-100" },
  { slug: "mystery", name: "Mystery", icon: "🔎", tint: "from-slate-200 to-slate-100" },
  { slug: "romance", name: "Romance", icon: "❤️", tint: "from-rose-200 to-rose-100" },
  { slug: "adventure", name: "Adventure", icon: "🚀", tint: "from-sky-200 to-sky-100" },
  { slug: "psychology", name: "Psychology", icon: "🧠", tint: "from-fuchsia-200 to-fuchsia-100" },
  { slug: "science", name: "Science", icon: "🔬", tint: "from-teal-200 to-teal-100" },
  { slug: "history", name: "History", icon: "📜", tint: "from-amber-200 to-amber-100" },
  { slug: "biography", name: "Biography", icon: "👤", tint: "from-indigo-200 to-indigo-100" },
  { slug: "education", name: "Education", icon: "🎓", tint: "from-blue-200 to-blue-100" },
  { slug: "technology", name: "Technology", icon: "💻", tint: "from-cyan-200 to-cyan-100" },
  { slug: "cybersecurity", name: "Cybersecurity", icon: "🔐", tint: "from-emerald-200 to-emerald-100" },
  { slug: "religion", name: "Religion", icon: "🕌", tint: "from-lime-200 to-lime-100" },
  { slug: "children", name: "Children's Books", icon: "🧒", tint: "from-orange-200 to-orange-100" },
  { slug: "self-development", name: "Self Development", icon: "🌱", tint: "from-green-200 to-green-100" },
  { slug: "business", name: "Business", icon: "💰", tint: "from-yellow-200 to-yellow-100" },
  { slug: "literature", name: "Literature", icon: "📚", tint: "from-purple-200 to-purple-100" },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const languageByCode = (code: string) => LANGUAGES.find((l) => l.code === code);
