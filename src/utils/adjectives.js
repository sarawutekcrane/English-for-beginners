import adjectives from "../data/adjectives.json";
import { buildConjugationQuestion } from "./conjugation";

export { adjectives };

// Three forms only (base/comparative/superlative) -- English's comparative
// system doesn't have a natural 4th single-word inflection the way the
// source's 4-form Japanese adjective table did. See the module README note
// in AdjectivePractice for why a 4th synthetic form wasn't added: this
// means the drill's options list tops out at 3 (correct + 2 distractors)
// rather than verbs' 4.
export const ADJ_FORM_FIELDS = ["base", "comparative", "superlative"];

const RULE_GROUP_LABEL_TH = {
  "er-est": "คำคุณศัพท์สั้น (-er / -est)",
  "more-most": "คำคุณศัพท์ยาว (more / most)",
  irregular: "คำยกเว้นพิเศษ (irregular)",
};

export function ruleGroupLabel(group) {
  return RULE_GROUP_LABEL_TH[group] || "";
}

const FORM_LABEL_TH = {
  base: "รูปพื้นฐาน (positive)",
  comparative: "ขั้นกว่า (comparative)",
  superlative: "ขั้นสุด (superlative)",
};

export function adjFormLabel(field) {
  return FORM_LABEL_TH[field] || field;
}

function adjFieldValue(adj, field) {
  return adj.forms[field].text;
}
function adjFieldPhonetic(adj, field) {
  return adj.forms[field].phonetic;
}

const ADJ_SPEC_BASE = {
  idPrefix: "adj",
  allFields: ADJ_FORM_FIELDS,
  maxDistractors: 2,
  getValue: adjFieldValue,
  getPhonetic: adjFieldPhonetic,
  getDictPhonetic: (adj) => adj.forms.base.phonetic,
};

/** Builds one multiple-choice conjugation question for an adjective targeting one of its 3 forms. */
export function buildAdjectiveQuestion(adj, field) {
  return buildConjugationQuestion(adj, { ...ADJ_SPEC_BASE, field, label: adjFormLabel(field) });
}

/** Combined pool: every adjective x every one of its 3 forms. */
export function getAllAdjectiveQuestions() {
  return adjectives.flatMap((adj) => ADJ_FORM_FIELDS.map((field) => buildAdjectiveQuestion(adj, field)));
}

export { adjFieldValue, adjFieldPhonetic };
