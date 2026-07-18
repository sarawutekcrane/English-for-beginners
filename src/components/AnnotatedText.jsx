// Phase 8: the ruby/rt alternate-script annotation below was ported from
// the source app's Kanji/Furigana toggle and never had a meaningful English
// equivalent -- English's single Latin script doesn't need a second
// "reading" script the way Japanese needs kana readings for kanji. The
// Settings panel no longer exposes a toggle for it (removed in Phase 8;
// Thai-script phonetic transliteration, shown via each module's own "คำอ่าน"
// toggle, is what actually answers "how do I say this" for a Thai learner
// now). The rendering logic and the `segments`/`altScript` data are kept
// intact rather than deleted -- only hard-disabled here -- in case a future
// phase finds a genuine use for per-segment annotation.
const SHOW_ALTERNATE_SCRIPT = false;
const SHOW_ANNOTATION = false;

/**
 * Renders plain text, or (if ever re-enabled) a segmented alternate-script
 * form with optional per-segment annotation. `segments` is an array of
 * { text, reading? } — segments with a reading would render as ruby/rt when
 * enabled, plain text (segment text, no reading shown) otherwise. Absent
 * `segments` always falls back to `plain`. Stays a dumb renderer: no
 * language-specific logic lives here, only props + the fixed constants above.
 */
export default function AnnotatedText({ plain, segments, className, as: Tag = "span" }) {
  if (!SHOW_ALTERNATE_SCRIPT || !segments) {
    return <Tag className={className}>{plain}</Tag>;
  }

  return (
    <Tag className={className}>
      {segments.map((seg, i) =>
        seg.reading && SHOW_ANNOTATION ? (
          <ruby key={i}>
            {seg.text}
            <rt>{seg.reading}</rt>
          </ruby>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </Tag>
  );
}
