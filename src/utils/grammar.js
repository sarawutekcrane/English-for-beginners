import verbs from "../data/verbs.json";
import patterns from "../data/sentencePatterns.json";
import { buildConjugationQuestion } from "./conjugation";

export const VERB_FORM_FIELDS = ["present", "past", "presentParticiple", "negative"];
const ALL_VERB_FIELDS = ["dict", ...VERB_FORM_FIELDS];

const REGULARITY_LABEL_TH = {
  regular: "กริยา regular (เติม -ed)",
  irregular: "กริยา irregular (ผันไม่ตามกฎ)",
};

export function regularityLabel(regularity) {
  return REGULARITY_LABEL_TH[regularity] || "";
}

const FORM_LABEL_TH = {
  dict: "รูปพื้นฐาน (base form)",
  present: "Present Simple (he/she/it)",
  past: "Past Simple",
  presentParticiple: "Present Continuous (-ing)",
  negative: "ปฏิเสธ (don't/doesn't)",
};

export function formLabel(field) {
  return FORM_LABEL_TH[field] || field;
}

// Rule-based explanations keyed by (field, regularity) -- not per-verb
// hardcoded prose. The rule for -ing and negative is the same for both
// regularity groups (only the past tense, and to a lesser extent the
// present-tense spelling, actually differ by regularity), but every field
// is still grouped the same way in the lesson UI for a consistent shape.
const RULE_TH = {
  present: {
    regular:
      "กริยา regular: เติม -s (หรือ -es หลังเสียง s/sh/ch/x/o, เปลี่ยน y เป็น ies) เมื่อประธานเป็น he/she/it",
    irregular: "กริยา irregular บางคำเปลี่ยนรูปทั้งคำในรูป he/she/it เช่น have → has, do → does, go → goes",
  },
  past: {
    regular: "กริยา regular: เติม -ed ท้ายคำ เช่น play → played",
    irregular: "กริยา irregular ต้องจำรูปอดีตแยกไว้เป็นพิเศษ ไม่ได้เติม -ed เช่น go → went, eat → ate",
  },
  presentParticiple: {
    regular: "เติม -ing ท้ายคำ (บางคำเบิ้ลพยัญชนะตัวสุดท้ายหรือตัด e ออกก่อน) เช่น study → studying",
    irregular: "กฎการเติม -ing เหมือนกันทุกกริยา ไม่ว่าจะ regular หรือ irregular",
  },
  negative: {
    regular: "ใช้ don't/doesn't + กริยารูปพื้นฐาน เหมือนกันทุกกริยา ไม่ว่าจะ regular หรือ irregular",
    irregular: "ใช้ don't/doesn't + กริยารูปพื้นฐาน เหมือนกันทุกกริยา ไม่ว่าจะ regular หรือ irregular",
  },
};

/** Thai explanation of the conjugation rule that applies to a verb+field. */
export function explanationFor(verb, field) {
  const rule = RULE_TH[field];
  if (!rule) return "";
  return rule[verb.regularity] || "";
}

function verbFieldValue(verb, field) {
  return field === "dict" ? verb.dict : verb.forms[field];
}
function verbFieldPhonetic(verb, field) {
  return field === "dict" ? verb.phonetic.dict : verb.phonetic[field];
}

const VERB_SPEC_BASE = {
  idPrefix: "verb",
  allFields: ALL_VERB_FIELDS,
  maxDistractors: 3,
  getValue: verbFieldValue,
  getPhonetic: verbFieldPhonetic,
  getExplanation: explanationFor,
  getDictPhonetic: (verb) => verb.phonetic.dict,
};

/** Builds one multiple-choice conjugation question for a verb targeting one field. */
export function buildVerbQuestion(verb, field, label) {
  return buildConjugationQuestion(verb, { ...VERB_SPEC_BASE, field, label: label || formLabel(field) });
}

/** One question per verb for a given sentence pattern's target form (used in lessons). */
export function getConjugationQuestions(pattern) {
  if (!pattern.conjugationField) return [];
  return verbs.map((v) => buildVerbQuestion(v, pattern.conjugationField, pattern.formLabel));
}

/** Combined pool: every verb x every one of its major conjugated forms (used by the practice drill). */
export function getAllVerbConjugationQuestions() {
  return verbs.flatMap((v) => VERB_FORM_FIELDS.map((field) => buildVerbQuestion(v, field)));
}

/** One representative worked example per regularity group for a given conjugation field. */
export function getGroupExamples(field) {
  return ["regular", "irregular"]
    .map((regularity) => verbs.find((v) => v.regularity === regularity))
    .filter(Boolean)
    .map((verb) => ({
      regularity: verb.regularity,
      verb,
      conjugated: verbFieldValue(verb, field),
      explanation: explanationFor(verb, field),
    }));
}

/** Several worked examples per regularity group for a given conjugation field (used by the conjugation lesson topics). */
export function getGroupExamplesList(field, count = 4) {
  return ["regular", "irregular"].map((regularity) => ({
    regularity,
    items: verbs
      .filter((v) => v.regularity === regularity)
      .slice(0, count)
      .map((v) => ({ verb: v, conjugated: verbFieldValue(v, field), explanation: explanationFor(v, field) })),
  }));
}

export { verbs, patterns, verbFieldValue, verbFieldPhonetic };
