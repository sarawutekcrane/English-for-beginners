import { shuffle } from "./content";

/**
 * Shared conjugation-question-builder core, used by both verbs and
 * adjectives (grammar.js, adjectives.js). Takes one lexical item plus a
 * target-form spec describing how to read that item's forms, and returns a
 * multiple-choice question whose distractors are the item's OWN other
 * forms -- never unrelated words -- so the question tests "did you pick
 * the right form," not "do you recognize the word."
 *
 * spec shape: {
 *   idPrefix, field, label, allFields, maxDistractors,
 *   getValue(item, field), getPhonetic(item, field),
 *   getExplanation?(item, field), getDictPhonetic?(item),
 * }
 */
export function buildConjugationQuestion(item, spec) {
  const correct = spec.getValue(item, spec.field);
  const correctPhonetic = spec.getPhonetic(item, spec.field);
  const otherFields = shuffle(spec.allFields.filter((f) => f !== spec.field)).slice(0, spec.maxDistractors);
  const optionPairs = shuffle([
    { text: correct, phonetic: correctPhonetic },
    ...otherFields.map((f) => ({ text: spec.getValue(item, f), phonetic: spec.getPhonetic(item, f) })),
  ]);
  const options = optionPairs.map((p) => p.text);
  const optionPhonetic = Object.fromEntries(optionPairs.map((p) => [p.text, p.phonetic]));
  return {
    id: `${spec.idPrefix}-${item.id}-${spec.field}`,
    item,
    correct,
    correctPhonetic,
    options,
    optionPhonetic,
    explanation: spec.getExplanation ? spec.getExplanation(item, spec.field) : "",
    formLabel: spec.label,
    dictPhonetic: spec.getDictPhonetic ? spec.getDictPhonetic(item) : "",
  };
}
