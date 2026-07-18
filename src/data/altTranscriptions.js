/**
 * Known alternate transcriptions the Web Speech API commonly returns for
 * specific placeholder-vocabulary words (homophones/near-homophones),
 * keyed by the exact target word text (card.answerText). Consulted by
 * matchesEnglish() only when the direct normalize-and-contains match
 * against the target itself fails. Small and seeded by hand for now --
 * expected to grow during the content-authoring phase as real usage
 * surfaces more recognizer confusions.
 */
export const ALT_TRANSCRIPTIONS = {
  Hello: ["halo"],
  Goodbye: ["good buy"],
  Please: ["pleas"],
  Father: ["farther"],
  Bread: ["bred"],
  Rice: ["rise"],
};
