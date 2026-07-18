import { Frame, INK } from "./shared";

/** Generic illustration for the colors category, parameterized by hex value -- no per-entry hand art needed. */
export default function ColorIllustration({ hex, id }) {
  const isLight = hex === "#FDFDFD" || hex === "#F6D34C";
  return (
    <Frame id={id || hex}>
      <path
        d="M100 34 C 132 34 156 62 152 96 C 149 124 132 132 122 148 C 112 164 116 176 100 176 C 84 176 88 164 78 148 C 68 132 51 124 48 96 C 44 62 68 34 100 34 Z"
        fill={hex}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx="82" cy="66" rx="12" ry="8" fill="#ffffff" opacity={isLight ? 0.5 : 0.55} />
      <circle cx="66" cy="94" r="4" fill="#ffffff" opacity="0.7" />
    </Frame>
  );
}
