import vocabulary from "../data/vocabulary.json";

// Theme groups sit above VOCAB_CATEGORIES in the picker flow (module entry
// -> group picker -> category picker scoped to the group). Shared by all
// vocab-driven modules the same way VOCAB_CATEGORIES already is, mirroring
// the CONVERSATION_GROUPS pattern built for Conversation Practice.
export const VOCAB_GROUPS = [
  {
    id: "people_feelings",
    label: "ผู้คนและความรู้สึก",
    emoji: "👪",
    subtitle: "คำทักทาย ครอบครัว ความรู้สึก",
  },
  {
    id: "daily_life",
    label: "ชีวิตประจำวันและการเดินทาง",
    emoji: "🏠",
    subtitle: "อาหาร บ้าน เสื้อผ้า สุขภาพ ช้อปปิ้ง การเดินทาง",
  },
  {
    id: "time_numbers",
    label: "เวลาและตัวเลข",
    emoji: "🕐",
    subtitle: "ตัวเลข สี วันเวลา สภาพอากาศ",
  },
  {
    id: "work_professions",
    label: "งานและอาชีพ",
    emoji: "💼",
    subtitle: "งานทั่วไป Safety Officer สื่อสารในออฟฟิศ",
  },
  {
    id: "hobbies",
    label: "งานอดิเรกและเวลาว่าง",
    emoji: "⚽",
    subtitle: "กีฬา ดนตรี งานอดิเรกต่างๆ",
  },
];

export const VOCAB_CATEGORIES = [
  { id: "greetings", label: "คำทักทาย", emoji: "👋", group: "people_feelings" },
  { id: "family", label: "ครอบครัว", emoji: "👪", group: "people_feelings" },
  { id: "feelings", label: "ความรู้สึก", emoji: "😊", group: "people_feelings" },
  { id: "food", label: "อาหารและเครื่องดื่ม", emoji: "🍽️", group: "daily_life" },
  { id: "house", label: "บ้านและเฟอร์นิเจอร์", emoji: "🛋️", group: "daily_life" },
  { id: "clothing", label: "เสื้อผ้า", emoji: "👕", group: "daily_life" },
  { id: "bodyHealth", label: "ร่างกายและสุขภาพ", emoji: "🩺", group: "daily_life" },
  { id: "shopping", label: "การช้อปปิ้ง", emoji: "🛒", group: "daily_life" },
  { id: "transportation", label: "การเดินทาง", emoji: "🚗", group: "daily_life" },
  { id: "numbers", label: "ตัวเลข", emoji: "🔢", group: "time_numbers" },
  { id: "colors", label: "สีสัน", emoji: "🎨", group: "time_numbers" },
  { id: "daysTime", label: "วันและเวลา", emoji: "🕐", group: "time_numbers" },
  { id: "weather", label: "สภาพอากาศ", emoji: "☀️", group: "time_numbers" },
  { id: "jobs", label: "อาชีพและการทำงาน", emoji: "💼", group: "work_professions" },
  { id: "safety_officer", label: "งานความปลอดภัย (Safety Officer)", emoji: "🦺", group: "work_professions" },
  { id: "office_communication", label: "การสื่อสารในที่ทำงาน", emoji: "💼", group: "work_professions" },
  { id: "hobbies", label: "งานอดิเรก", emoji: "⚽", group: "hobbies" },
];

export function getVocab(category) {
  return vocabulary[category] || [];
}

export function getAllVocab() {
  return Object.values(vocabulary).flat();
}

/** Normalizes a vocabulary entry into a common shape for quiz/flashcard use. */
export function toCard(entry) {
  return {
    id: entry.id,
    kind: "vocab",
    display: entry.word,
    audioText: entry.word,
    answerText: entry.word,
    reading: entry.phonetic,
    romanization: entry.romanization,
    thai: entry.thai,
    icon: entry.icon,
    level: entry.level,
    partOfSpeech: entry.partOfSpeech,
    segments: entry.altScript,
    value: entry.value,
    hex: entry.hex,
  };
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}
