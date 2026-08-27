import type { CategorySlug, LanguageCode } from "./catalog";

export type Book = {
  id: string;
  title: string;
  author: string;
  language: LanguageCode;
  category: CategorySlug;
  rating: number;
  reviews: number;
  pageCount: number;
  year: number;
  publisher: string;
  added: string;
  tags: ("popular" | "trending" | "new" | "recommended" | "featured")[];
  description: string;
  cover: { from: string; to: string; ink: string };
  content: string[];
};

const p = (...paras: string[]) => paras;

export const BOOKS: Book[] = [
  {
    id: "sherlock-scandal",
    title: "A Scandal in Bohemia",
    author: "Arthur Conan Doyle",
    language: "en",
    category: "mystery",
    rating: 4.8,
    reviews: 3120,
    pageCount: 288,
    year: 1891,
    publisher: "The Strand Magazine",
    added: "2026-08-02",
    tags: ["popular", "featured", "recommended"],
    description:
      "Sherlock Holmes is outwitted by the one woman he could never dismiss. A perfectly constructed puzzle of disguise, photographs and pride, and the story that made Baker Street immortal.",
    cover: { from: "#1f2a44", to: "#3f5378", ink: "#f6e7c4" },
    content: p(
      "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.",
      "He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer — excellent for drawing the veil from men's motives and actions.",
      "I had seen little of Holmes lately. My marriage had drifted us away from each other. My own complete happiness, and the home-centred interests which rise up around the man who first finds himself master of his own establishment, were sufficient to absorb all my attention, while Holmes, who loathed every form of society with his whole Bohemian soul, remained in our lodgings in Baker Street, buried among his old books.",
      "One night — it was on the twentieth of March, 1888 — I was returning from a journey to a patient, when my way led me through Baker Street. As I passed the well-remembered door, I saw his tall, spare figure pass twice in a dark silhouette against the blind. He was pacing the room swiftly, eagerly, with his head sunk upon his chest and his hands clasped behind him.",
    ),
  },
  {
    id: "pride-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    language: "en",
    category: "romance",
    rating: 4.7,
    reviews: 5410,
    pageCount: 432,
    year: 1813,
    publisher: "T. Egerton",
    added: "2026-07-21",
    tags: ["popular", "recommended"],
    description:
      "Elizabeth Bennet, five sisters, a fortune-hunting mother and a man too proud for his own good. Wit sharpened to a point, and still the most quoted opening line in English fiction.",
    cover: { from: "#7b2d52", to: "#c46a86", ink: "#ffeef3" },
    content: p(
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.",
      "\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\" Mr. Bennet replied that he had not. \"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\" Mr. Bennet made no answer.",
      "\"Do you not want to know who has taken it?\" cried his wife impatiently. \"You want to tell me, and I have no objection to hearing it.\" This was invitation enough. \"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England.\"",
      "Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. Her mind was less difficult to develop. She was a woman of mean understanding, little information, and uncertain temper.",
    ),
  },
  {
    id: "moby-dick",
    title: "Moby-Dick",
    author: "Herman Melville",
    language: "en",
    category: "adventure",
    rating: 4.4,
    reviews: 2210,
    pageCount: 624,
    year: 1851,
    publisher: "Harper & Brothers",
    added: "2026-06-14",
    tags: ["popular", "recommended"],
    description:
      "One ship, one whale, one obsession. Melville's sea epic is part adventure, part encyclopedia, part sermon on the things that hunt us back.",
    cover: { from: "#0f3b4c", to: "#1d6f86", ink: "#e6f7ff" },
    content: p(
      "Call me Ishmael. Some years ago — never mind how long precisely — having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.",
      "Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet — then, I account it high time to get to sea as soon as I can.",
      "There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs — commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes.",
      "Circumambulate the city of a dreamy Sabbath afternoon. What do you see? Posted like silent sentinels all around the town, stand thousands upon thousands of mortal men fixed in ocean reveries. Some leaning against the spiles; some seated upon the pier-heads; some looking over the bulwarks of ships from China.",
    ),
  },
  {
    id: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    language: "en",
    category: "science",
    rating: 4.6,
    reviews: 4020,
    pageCount: 312,
    year: 1818,
    publisher: "Lackington & Co.",
    added: "2026-08-11",
    tags: ["trending", "new", "recommended"],
    description:
      "The first science fiction novel, written by a teenager on a rainy Swiss summer. A story about creation, abandonment, and the price of curiosity without care.",
    cover: { from: "#243b2f", to: "#4d7a5c", ink: "#eafce9" },
    content: p(
      "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
      "I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.",
      "There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour. I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight.",
      "These visions faded when I perused, for the first time, those poets whose effusions entranced my soul and lifted it to heaven. I also became a poet and for one year lived in a paradise of my own creation; I imagined that I also might obtain a niche in the temple.",
    ),
  },
  {
    id: "art-of-war",
    title: "The Art of War",
    author: "Sun Tzu",
    language: "en",
    category: "business",
    rating: 4.5,
    reviews: 6100,
    pageCount: 168,
    year: -500,
    publisher: "Classic Texts",
    added: "2026-05-30",
    tags: ["popular", "recommended"],
    description:
      "Thirteen chapters on strategy, deception and restraint that have outlived every empire that used them. Still the shortest business book worth reading twice.",
    cover: { from: "#5b1f1f", to: "#a8452f", ink: "#ffe9d6" },
    content: p(
      "Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.",
      "The art of war, then, is governed by five constant factors, to be taken into account in one's deliberations, when seeking to determine the conditions obtaining in the field. These are: the Moral Law; Heaven; Earth; the Commander; Method and discipline.",
      "All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.",
      "Now the general who wins a battle makes many calculations in his temple ere the battle is fought. The general who loses a battle makes but few calculations beforehand. Thus do many calculations lead to victory, and few calculations to defeat.",
    ),
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    language: "en",
    category: "self-development",
    rating: 4.9,
    reviews: 7300,
    pageCount: 254,
    year: 180,
    publisher: "Classic Texts",
    added: "2026-08-18",
    tags: ["trending", "popular", "featured"],
    description:
      "A Roman emperor's private notebook, never written for us. Short entries on temper, mortality and doing the next right thing without applause.",
    cover: { from: "#2c2a4a", to: "#6c63a5", ink: "#f2efff" },
    content: p(
      "Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil.",
      "But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me — I can neither be injured by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman.",
      "Do not act as if thou wert going to live ten thousand years. Death hangs over thee. While thou livest, while it is in thy power, be good. Waste no more time arguing about what a good man should be. Be one.",
      "Every moment think steadily as a Roman and a man to do what thou hast in hand with perfect and simple dignity, and feeling of affection, and freedom, and justice; and to give thyself relief from all other thoughts.",
    ),
  },
  {
    id: "alice",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    language: "en",
    category: "children",
    rating: 4.6,
    reviews: 3900,
    pageCount: 200,
    year: 1865,
    publisher: "Macmillan",
    added: "2026-08-20",
    tags: ["new", "popular", "recommended"],
    description:
      "A bored girl, a waistcoated rabbit, and a rabbit hole with no bottom. Nonsense written with mathematical precision.",
    cover: { from: "#0f5d5d", to: "#3fb0a0", ink: "#eafff9" },
    content: p(
      "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, \"and what is the use of a book,\" thought Alice, \"without pictures or conversations?\"",
      "So she was considering in her own mind whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
      "There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, \"Oh dear! Oh dear! I shall be late!\" But when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet.",
      "In another moment down went Alice after it, never once considering how in the world she was to get out again. The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself.",
    ),
  },
  {
    id: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    language: "en",
    category: "fiction",
    rating: 4.5,
    reviews: 2870,
    pageCount: 418,
    year: 1897,
    publisher: "Archibald Constable",
    added: "2026-07-02",
    tags: ["popular", "trending"],
    description:
      "Told entirely in letters, diaries and telegrams — a story that still feels like evidence someone left behind for you to find.",
    cover: { from: "#3a0d16", to: "#7d1f2e", ink: "#ffe4e6" },
    content: p(
      "3 May. Bistritz. — Left Munich at 8:35 P.M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train.",
      "I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but thirsty. I got my supper, or rather I got a note of it, and asked the waiter, and he said it was called \"paprika hendl,\" and that, as it was a national dish, I should be able to get it anywhere along the Carpathians.",
      "I found my smattering of German very useful here; indeed, I don't know how I should be able to get on without it. Having had some time at my disposal when in London, I had visited the British Museum, and made search among the books and maps in the library regarding Transylvania.",
      "It had struck me that some foreknowledge of the country could hardly fail to have some importance in dealing with a nobleman of that country. I find that the district he named is in the extreme east of the country, just on the borders of three states.",
    ),
  },
  {
    id: "origin-species",
    title: "On the Origin of Species",
    author: "Charles Darwin",
    language: "en",
    category: "science",
    rating: 4.5,
    reviews: 1980,
    pageCount: 502,
    year: 1859,
    publisher: "John Murray",
    added: "2026-06-05",
    tags: ["recommended"],
    description:
      "The patient, careful book that rearranged biology. Darwin argues slowly and answers his own objections before you can raise them.",
    cover: { from: "#3d4a1f", to: "#7f9a3c", ink: "#f6ffe0" },
    content: p(
      "When on board H.M.S. Beagle, as naturalist, I was much struck with certain facts in the distribution of the inhabitants of South America, and in the geological relations of the present to the past inhabitants of that continent.",
      "These facts seemed to me to throw some light on the origin of species — that mystery of mysteries, as it has been called by one of our greatest philosophers. On my return home, it occurred to me, in 1837, that something might perhaps be made out on this question by patiently accumulating and reflecting on all sorts of facts.",
      "After five years' work I allowed myself to speculate on the subject, and drew up some short notes; these I enlarged in 1844 into a sketch of the conclusions which then seemed to me probable. From that period to the present day I have steadily pursued the same object.",
      "No one ought to feel surprise at much remaining as yet unexplained in regard to the origin of species and varieties, if he make due allowance for our profound ignorance in regard to the mutual relations of the many beings which live around us.",
    ),
  },
  {
    id: "autobiography-franklin",
    title: "The Autobiography of Benjamin Franklin",
    author: "Benjamin Franklin",
    language: "en",
    category: "biography",
    rating: 4.4,
    reviews: 1450,
    pageCount: 276,
    year: 1791,
    publisher: "Buisson",
    added: "2026-08-09",
    tags: ["new", "recommended"],
    description:
      "A printer's apprentice becomes a founding father, and writes it all down as practical advice to his son. The original self-improvement journal.",
    cover: { from: "#5a4020", to: "#a97e3f", ink: "#fff4dd" },
    content: p(
      "Dear Son: I have ever had pleasure in obtaining any little anecdotes of my ancestors. You may remember the inquiries I made among the remains of my relations when you were with me in England, and the journey I undertook for that purpose.",
      "Having emerged from the poverty and obscurity in which I was born and bred, to a state of affluence and some degree of reputation in the world, and having gone so far through life with a considerable share of felicity, the conducing means I made use of may be fit to be known.",
      "It was about this time I conceived the bold and arduous project of arriving at moral perfection. I wished to live without committing any fault at any time; I would conquer all that either natural inclination, custom, or company might lead me into.",
      "I made a little book, in which I allotted a page for each of the virtues. I ruled each page with red ink, so as to have seven columns, one for each day of the week, marking each column with a letter for the day.",
    ),
  },
  {
    id: "thirukkural",
    title: "திருக்குறள் — Thirukkural",
    author: "Thiruvalluvar",
    language: "ta",
    category: "literature",
    rating: 4.9,
    reviews: 4600,
    pageCount: 360,
    year: 100,
    publisher: "Classic Tamil Texts",
    added: "2026-08-15",
    tags: ["featured", "popular", "recommended"],
    description:
      "1,330 couplets on virtue, wealth and love — each one two lines long, each one a complete argument. The cornerstone of Tamil literature.",
    cover: { from: "#7a2f10", to: "#d08a3c", ink: "#fff3e0" },
    content: p(
      "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு.\n\nAs the letter A is the first of all letters, so the eternal God is first in the world.",
      "கற்றதனால் ஆய பயனென்கொல் வாலறிவன்\nநற்றாள் தொழாஅர் எனின்.\n\nWhat profit have those derived from learning, who worship not the good feet of Him who is pure knowledge itself?",
      "இருள்சேர் இருவினையும் சேரா இறைவன்\nபொருள்சேர் புகழ்புரிந்தார் மாட்டு.\n\nThe two-fold deeds that spring from dark illusion shall not adhere to those who delight in the true praise of God.",
      "ஒழுக்கம் விழுப்பம் தரலான் ஒழுக்கம்\nஉயிரினும் ஓம்பப் படும்.\n\nSince right conduct bestows exalted greatness, it is to be guarded as more precious than life itself.",
    ),
  },
  {
    id: "gitanjali",
    title: "गीतांजलि — Gitanjali",
    author: "Rabindranath Tagore",
    language: "hi",
    category: "literature",
    rating: 4.7,
    reviews: 2100,
    pageCount: 190,
    year: 1910,
    publisher: "India Society",
    added: "2026-08-04",
    tags: ["popular", "recommended"],
    description:
      "Song offerings that won the Nobel Prize in 1913. Devotional, plain-spoken and quietly overwhelming.",
    cover: { from: "#1f3f5c", to: "#4f86b5", ink: "#eaf5ff" },
    content: p(
      "तू ने मुझे अनंत बनाया है, यही तेरी लीला है। इस नाज़ुक पात्र को तू बार-बार खाली करता है और बार-बार नए जीवन से भर देता है।\n\nThou hast made me endless, such is thy pleasure. This frail vessel thou emptiest again and again, and fillest it ever with fresh life.",
      "यह छोटी-सी बाँसुरी तू पहाड़ों और घाटियों में लिए फिरा है, और इसमें सदा नए सुर फूँके हैं।\n\nThis little flute of a reed thou hast carried over hills and dales, and hast breathed through it melodies eternally new.",
      "जब तू आदेश देता है, तब मेरा हृदय आनंद से भर जाता है और वह अपनी सीमा भूल जाता है।\n\nAt the immortal touch of thy hands my little heart loses its limits in joy and gives birth to utterance ineffable.",
      "तेरे अनंत उपहार मुझ तक केवल इन्हीं छोटे हाथों से आते हैं। युग बीत जाते हैं, और तू अब भी भरता रहता है, और अब भी जगह बची रहती है।\n\nThy infinite gifts come to me only on these very small hands of mine. Ages pass, and still thou pourest, and still there is room to fill.",
    ),
  },
  {
    id: "arabian-nights",
    title: "ألف ليلة وليلة — One Thousand and One Nights",
    author: "Anonymous",
    language: "ar",
    category: "fiction",
    rating: 4.8,
    reviews: 5200,
    pageCount: 640,
    year: 900,
    publisher: "Classic Arabic Texts",
    added: "2026-07-27",
    tags: ["featured", "popular", "trending"],
    description:
      "Scheherazade tells a story every night to stay alive, and never finishes one before dawn. The frame tale that invented the cliffhanger.",
    cover: { from: "#33206b", to: "#8b5cc7", ink: "#f6efff" },
    content: p(
      "في قديم الزمان وسالف العصر والأوان، كان هناك ملكٌ عظيم الشأن.\n\nIn the name of God, the Compassionate, the Merciful. It is related — but God alone is all-knowing — that there lived once, in the islands of India and China, a king of great renown.",
      "وكان له ولدان: الأكبر شهريار والأصغر شاه زمان.\n\nHe left behind two sons: the elder, Shahriyar, and the younger, Shah Zaman. Each ruled a kingdom justly, and for twenty years the people prospered under them.",
      "قالت شهرزاد: بلغني أيها الملك السعيد...\n\nThen said Scheherazade: It has reached me, O auspicious King, that there was once a merchant among the merchants, who had much wealth and business in the lands.",
      "وأدرك شهرزاد الصباح فسكتت عن الكلام المباح.\n\nAnd Scheherazade perceived the dawn of day and ceased to say her permitted say. Then said her sister: How sweet is thy story! She replied: What is this compared with what I shall tell thee the next night?",
    ),
  },
  {
    id: "malayalam-folk",
    title: "കഥകളുടെ തീരം — Shore of Stories",
    author: "Traditional Malayalam Folk Tales",
    language: "ml",
    category: "children",
    rating: 4.5,
    reviews: 860,
    pageCount: 156,
    year: 1920,
    publisher: "Kerala Folk Archive",
    added: "2026-08-22",
    tags: ["new", "recommended"],
    description:
      "Backwater folk tales carried by grandmothers across Kerala — kings, crows, coconut groves and clever children.",
    cover: { from: "#134e34", to: "#3fa06a", ink: "#eafff2" },
    content: p(
      "പണ്ട് പണ്ട്, ഒരു ഗ്രാമത്തിൽ ഒരു കൊച്ചു പെൺകുട്ടി ഉണ്ടായിരുന്നു.\n\nLong ago, in a village where the backwaters met the coconut groves, there lived a small girl who asked too many questions.",
      "അവളുടെ അമ്മൂമ്മ എന്നും രാത്രി ഒരു കഥ പറഞ്ഞു കൊടുത്തു.\n\nEvery night her grandmother told her one story, and never two, because a story told too quickly is a story wasted.",
      "ഒരു ദിവസം കാക്ക പറഞ്ഞു: \"ബുദ്ധി ഉള്ളവൻ കിണറ്റിൽ വീഴില്ല.\"\n\nOne day the crow said: the clever one does not fall into the well; the clever one first asks how deep it is.",
      "കഥ കേട്ട് കുട്ടി ഉറങ്ങി. പക്ഷേ കഥ ഉറങ്ങിയില്ല.\n\nThe child fell asleep listening. The story, however, did not sleep — it went out and found another child, in another village, the very next night.",
    ),
  },
  {
    id: "kannada-vachana",
    title: "ವಚನಗಳು — Vachanas",
    author: "Basavanna",
    language: "kn",
    category: "religion",
    rating: 4.8,
    reviews: 1320,
    pageCount: 210,
    year: 1160,
    publisher: "Classic Kannada Texts",
    added: "2026-07-12",
    tags: ["popular", "recommended"],
    description:
      "Twelfth-century free verse that dismantled ritual and caste in plain Kannada. Short, blunt, unforgettable.",
    cover: { from: "#6b2f1a", to: "#c07a3a", ink: "#fff2e2" },
    content: p(
      "ಉಳ್ಳವರು ಶಿವಾಲಯ ಮಾಡುವರು, ನಾನೇನ ಮಾಡಲಿ ಬಡವನಯ್ಯಾ.\n\nThe rich build temples for Shiva. What shall I, a poor man, do?",
      "ಎನ್ನ ಕಾಲೇ ಕಂಬ, ದೇಹವೇ ದೇಗುಲ, ಶಿರವೇ ಹೊನ್ನ ಕಳಸವಯ್ಯಾ.\n\nMy legs are pillars, my body the shrine, my head a cupola of gold.",
      "ಸ್ಥಾವರಕ್ಕಳಿವುಂಟು, ಜಂಗಮಕ್ಕಳಿವಿಲ್ಲ.\n\nThings standing shall fall; but the moving ever shall stay.",
      "ದಯವಿಲ್ಲದ ಧರ್ಮವದೇವುದಯ್ಯಾ? ದಯವೇ ಬೇಕು ಸಕಲ ಪ್ರಾಣಿಗಳಲ್ಲಿ.\n\nWhat sort of religion can it be without compassion? Compassion is needed toward all living beings.",
    ),
  },
  {
    id: "telugu-vemana",
    title: "వేమన శతకము — Vemana Satakam",
    author: "Vemana",
    language: "te",
    category: "self-development",
    rating: 4.6,
    reviews: 940,
    pageCount: 180,
    year: 1650,
    publisher: "Classic Telugu Texts",
    added: "2026-08-06",
    tags: ["new", "recommended"],
    description:
      "Four-line verses of everyday wisdom that every Telugu child learns, and every Telugu adult eventually understands.",
    cover: { from: "#20455e", to: "#4f93b8", ink: "#eaf7ff" },
    content: p(
      "అల్పుడెపుడు పలుకు ఆడంబరము గాను,\nసజ్జనుండు పలుకు చల్లగాను.\n\nThe small man always speaks with noise and show; the good man speaks softly.",
      "ఉప్పు కప్పురంబు ఒక్క పోలికనుండు,\nచూడ చూడ రుచుల జాడ వేరు.\n\nSalt and camphor look alike to the eye; but taste them, and their ways are entirely different.",
      "అనువు గాని చోట అధికుల మనరాదు,\nకొంచెముండుటెల్ల కొదువ కాదు.\n\nIn a place unsuited to you, do not claim greatness. To remain small there is no disgrace.",
      "విశ్వదాభిరామ వినుర వేమ.\n\nListen, Vemana — delight of the world: what is true needs no ornament to be true.",
    ),
  },
  {
    id: "war-peace-history",
    title: "The History of the Peloponnesian War",
    author: "Thucydides",
    language: "en",
    category: "history",
    rating: 4.3,
    reviews: 780,
    pageCount: 560,
    year: -400,
    publisher: "Classic Texts",
    added: "2026-06-22",
    tags: ["recommended"],
    description:
      "The first history written like journalism: causes, speeches, plague and power politics, recorded by a general who lost.",
    cover: { from: "#3b3b52", to: "#7d7da0", ink: "#f3f3ff" },
    content: p(
      "Thucydides, an Athenian, wrote the history of the war between the Peloponnesians and the Athenians, beginning at the moment that it broke out, and believing that it would be a great war and more worthy of relation than any that had preceded it.",
      "The Greek world before this war had known nothing of the kind, and the preparations of both combatants were in every department in the last state of perfection. My work is not a piece of writing designed to meet the taste of an immediate public, but was done to last for ever.",
      "The real cause I consider to be the one which was formally most kept out of sight. The growth of the power of Athens, and the alarm which this inspired in Lacedaemon, made war inevitable.",
      "It is a habit of mankind to entrust to careless hope what they long for, and to use sovereign reason to thrust aside what they do not fancy.",
    ),
  },
  {
    id: "walden",
    title: "Walden",
    author: "Henry David Thoreau",
    language: "en",
    category: "psychology",
    rating: 4.4,
    reviews: 1690,
    pageCount: 352,
    year: 1854,
    publisher: "Ticknor and Fields",
    added: "2026-08-24",
    tags: ["new", "trending"],
    description:
      "Two years, two months and two days in a cabin by a pond — an argument for owning less and noticing more.",
    cover: { from: "#1f4437", to: "#5c9877", ink: "#effff6" },
    content: p(
      "When I wrote the following pages, or rather the bulk of them, I lived alone, in the woods, a mile from any neighbor, in a house which I had built myself, on the shore of Walden Pond, in Concord, Massachusetts, and earned my living by the labor of my hands only.",
      "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.",
      "Our life is frittered away by detail. Simplify, simplify. Instead of three meals a day, if it be necessary eat but one; instead of a hundred dishes, five; and reduce other things in proportion.",
      "The mass of men lead lives of quiet desperation. What is called resignation is confirmed desperation. A stereotyped but unconscious despair is concealed even under what are called the games and amusements of mankind.",
    ),
  },
  {
    id: "ada-lovelace-notes",
    title: "Notes on the Analytical Engine",
    author: "Ada Lovelace",
    language: "en",
    category: "technology",
    rating: 4.5,
    reviews: 620,
    pageCount: 140,
    year: 1843,
    publisher: "Scientific Memoirs",
    added: "2026-08-25",
    tags: ["new", "recommended", "trending"],
    description:
      "The notes that contain the first published computer program — and the first serious thought about what machines can and cannot originate.",
    cover: { from: "#182a56", to: "#4a6bd0", ink: "#eaf0ff" },
    content: p(
      "The Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform. It can follow analysis; but it has no power of anticipating any analytical relations or truths.",
      "The distinctive characteristic of the Analytical Engine is the introduction into it of the principle which Jacquard devised for regulating, by means of punched cards, the most complicated patterns in the fabrication of brocaded stuffs.",
      "We may say most aptly that the Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves. Here, it seems to us, resides much more of originality than the Difference Engine can be fairly entitled to claim.",
      "Supposing, for instance, that the fundamental relations of pitched sounds in the science of harmony were susceptible of such expression and adaptations, the engine might compose elaborate and scientific pieces of music of any degree of complexity.",
    ),
  },
  {
    id: "cipher-manual",
    title: "Manual of Cryptography",
    author: "Parker Hitt",
    language: "en",
    category: "cybersecurity",
    rating: 4.2,
    reviews: 410,
    pageCount: 224,
    year: 1916,
    publisher: "Army Service Schools Press",
    added: "2026-08-26",
    tags: ["new"],
    description:
      "A field officer's practical guide to making and breaking ciphers — the grandparent of every modern security handbook.",
    cover: { from: "#10322c", to: "#2f7d6b", ink: "#e6fff8" },
    content: p(
      "It is the mission of this manual to set forth, in as simple a manner as possible, the principles which underlie the making and the solution of secret messages, and to indicate the practical limits of secrecy in the field.",
      "Success in dealing with unknown ciphers is measured by these four things in the order named: perseverance, careful methods of analysis, intuition, and luck. The ability at least to read the language of the original text is very desirable but not essential.",
      "No cipher is indecipherable. The most that can be claimed for any system is that the labour of solution shall exceed the value of the message at the time the solution is obtained.",
      "The cipher which is not simple enough to be used correctly and rapidly under the conditions of service is worse than useless, for it gives a false sense of security while producing errors that betray the key.",
    ),
  },
  {
    id: "aesop",
    title: "Aesop's Fables",
    author: "Aesop",
    language: "other",
    category: "education",
    rating: 4.7,
    reviews: 2400,
    pageCount: 210,
    year: -560,
    publisher: "Classic Texts",
    added: "2026-07-18",
    tags: ["popular", "recommended"],
    description:
      "Hundreds of tiny stories with animals doing what people do. Each one ends before you can argue with it.",
    cover: { from: "#6b4a12", to: "#c9a13a", ink: "#fff8e0" },
    content: p(
      "A Fox, seeing some sour grapes hanging within an inch of his nose, and being unwilling to admit that there was anything he could not reach, declared them to be sour. It is easy to despise what you cannot get.",
      "A Hare one day ridiculed the short feet and slow pace of the Tortoise, who replied, laughing: \"Though you be swift as the wind, I will beat you in a race.\" The Hare, believing her assertion to be impossible, agreed.",
      "The Tortoise never for a moment stopped, but went on with a slow but steady pace straight to the end of the course. The Hare, lying down by the wayside, fell fast asleep. Slow and steady wins the race.",
      "A Crow, half-dead with thirst, came upon a pitcher which had once been full of water. She dropped in pebbles one by one until the water rose within reach of her beak. Little by little does the trick.",
    ),
  },
  {
    id: "great-expectations",
    title: "Great Expectations",
    author: "Charles Dickens",
    language: "en",
    category: "literature",
    rating: 4.6,
    reviews: 3080,
    pageCount: 544,
    year: 1861,
    publisher: "Chapman & Hall",
    added: "2026-06-28",
    tags: ["popular", "featured"],
    description:
      "An orphan, a convict, a stopped clock and a fortune from nowhere. Dickens at his most personal and most merciless.",
    cover: { from: "#402d1c", to: "#8a6a45", ink: "#fff3e3" },
    content: p(
      "My father's family name being Pirrip, and my Christian name Philip, my infant tongue could make of both names nothing longer or more explicit than Pip. So, I called myself Pip, and came to be called Pip.",
      "Ours was the marsh country, down by the river, within, as the river wound, twenty miles of the sea. My first most vivid and broad impression of the identity of things seems to me to have been gained on a memorable raw afternoon towards evening.",
      "\"Hold your noise!\" cried a terrible voice, as a man started up from among the graves at the side of the church porch. \"Keep still, you little devil, or I'll cut your throat!\"",
      "A fearful man, all in coarse grey, with a great iron on his leg. A man with no hat, and with broken shoes, and with an old rag tied round his head. A man who had been soaked in water, and smothered in mud.",
    ),
  },
  {
    id: "time-machine",
    title: "The Time Machine",
    author: "H. G. Wells",
    language: "en",
    category: "fiction",
    rating: 4.4,
    reviews: 2650,
    pageCount: 188,
    year: 1895,
    publisher: "William Heinemann",
    added: "2026-08-19",
    tags: ["trending", "new", "popular"],
    description:
      "A dinner party, an impossible claim, and a journey to the year 802,701. Science fiction's first proper time traveller.",
    cover: { from: "#232c4b", to: "#5f6dbf", ink: "#eef1ff" },
    content: p(
      "The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated.",
      "\"You must follow me carefully. I shall have to controvert one or two ideas that are almost universally accepted. The geometry, for instance, they taught you at school is founded on a misconception.\"",
      "\"Clearly, any real body must have extension in four directions: it must have Length, Breadth, Thickness, and Duration. There is no difference between Time and any of the three dimensions of Space except that our consciousness moves along it.\"",
      "\"I've had a most amazing time,\" said the Time Traveller later, and his eye fell with a strange look upon the withered flowers on the little table. \"Where had my machine been? Where was I?\"",
    ),
  },
  {
    id: "kama-business",
    title: "Arthashastra",
    author: "Kautilya",
    language: "other",
    category: "business",
    rating: 4.3,
    reviews: 720,
    pageCount: 480,
    year: -300,
    publisher: "Classic Texts",
    added: "2026-07-08",
    tags: ["recommended"],
    description:
      "An ancient Indian treatise on economics, statecraft and administration — startlingly modern on taxation, audit and incentives.",
    cover: { from: "#54331f", to: "#b3763c", ink: "#fff1de" },
    content: p(
      "This Arthashastra is made as a compendium of almost all the Arthashastras which, in view of acquisition and maintenance of the earth, have been composed by ancient teachers.",
      "The root of wealth is economic activity, and lack of it brings material distress. In the absence of fruitful economic activity, both current prosperity and future growth will be destroyed.",
      "Just as it is impossible not to taste honey or poison placed on the surface of the tongue, so it is impossible for one dealing with government funds not to taste, at least a little bit, of the king's wealth.",
      "The king shall provide the orphan, the aged, the infirm, the afflicted, and the helpless with maintenance. He shall also provide subsistence to helpless women when they are carrying and also to the children they give birth to.",
    ),
  },
];

export const bookById = (id: string) => BOOKS.find((b) => b.id === id);

export const readingMinutes = (b: Book) => Math.max(3, Math.round(b.pageCount / 2.2));

export function searchBooks(
  query: string,
  opts: {
    languages?: string[];
    categories?: string[];
    minRating?: number;
    sort?: "popular" | "newest" | "az" | "rating";
  } = {},
) {
  const q = query.trim().toLowerCase();
  let out = BOOKS.filter((b) => {
    if (q) {
      const hay = `${b.title} ${b.author} ${b.category} ${b.language} ${b.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (opts.languages?.length && !opts.languages.includes(b.language)) return false;
    if (opts.categories?.length && !opts.categories.includes(b.category)) return false;
    if (opts.minRating && b.rating < opts.minRating) return false;
    return true;
  });

  switch (opts.sort) {
    case "newest":
      out = out.sort((a, b) => b.added.localeCompare(a.added));
      break;
    case "az":
      out = out.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "rating":
      out = out.sort((a, b) => b.rating - a.rating);
      break;
    default:
      out = out.sort((a, b) => b.reviews - a.reviews);
  }
  return out;
}

export const byTag = (tag: Book["tags"][number]) => BOOKS.filter((b) => b.tags.includes(tag));
