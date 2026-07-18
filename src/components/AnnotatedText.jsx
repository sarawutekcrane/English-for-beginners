import { useSettings } from "../context/SettingsContext";

/**
 * Renders plain text, or a segmented alternate-script form with optional
 * per-segment annotation, based on the global settings toggles. `segments`
 * is an array of { text, reading? } — segments with a reading render as
 * ruby/rt when the annotation toggle is on, plain text (segment text, no
 * reading shown) when it's off. Absent `segments` always falls back to
 * `plain`, regardless of toggle state. Stays a dumb renderer: no
 * language-specific logic lives here, only props + Context.
 */
export default function AnnotatedText({ plain, segments, className, as: Tag = "span" }) {
  const { showAlternateScript, showAnnotation } = useSettings();

  if (!showAlternateScript || !segments) {
    return <Tag className={className}>{plain}</Tag>;
  }

  return (
    <Tag className={className}>
      {segments.map((seg, i) =>
        seg.reading && showAnnotation ? (
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
