function commonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/**
 * Renders dict -> conjugated with the changed part of the word highlighted,
 * e.g. play|s -> play|ed. Falls back gracefully to showing the whole word
 * as "new" when there's no shared prefix at all (irregular forms like
 * go -> went, or multi-word forms like eat -> don't eat).
 */
export default function ConjugatedWord({ dict, conjugated }) {
  const i = commonPrefixLength(dict, conjugated);
  const stem = dict.slice(0, i);
  const dictEnd = dict.slice(i) || dict;
  const conjEnd = conjugated.slice(i) || conjugated;

  return (
    <span className="conj-word en-text">
      <span>{stem}</span>
      <span className="conj-ending conj-old">{dictEnd}</span>
      <span className="conj-arrow"> → </span>
      <span>{stem}</span>
      <span className="conj-ending conj-new">{conjEnd}</span>
    </span>
  );
}
