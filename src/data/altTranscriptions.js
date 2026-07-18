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
  // Phase 9: "CPR" spoken as "C" "P" "R" already matches directly (spaces
  // strip out the same as the target's own no-space form), but browsers
  // sometimes phonetically spell out the individual letters as words instead.
  CPR: ["see pee are", "seepeeare"],
  // Phase 9: "X-ray" said as "x ray" already matches directly (the hyphen
  // and the space both strip to nothing), but "X" is sometimes transcribed
  // as the word "ex" instead of the letter.
  "X-ray": ["exray", "ecks ray"],
};
