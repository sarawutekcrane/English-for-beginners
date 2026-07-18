import vocabulary from "../data/vocabulary.json";

export const VOCAB_CATEGORIES = [
  { id: "greetings", label: "คำทักทาย", emoji: "👋" },
  { id: "family", label: "ครอบครัว", emoji: "👪" },
  { id: "food", label: "อาหารและเครื่องดื่ม", emoji: "🍽️" },
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
    segments: entry.altScript,
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
