const FACE = {
  happy: { eye: "happy", mouth: "M -14 8 Q 0 20 14 8" },
  excited: { eye: "star", mouth: "M -16 6 Q 0 24 16 6" },
  sad: { eye: "sad", mouth: "M -12 14 Q 0 4 12 14" },
  neutral: { eye: "dot", mouth: "M -10 10 Q 0 14 10 10" },
  wink: { eye: "wink", mouth: "M -14 8 Q 0 20 14 8" },
};

function Eyes({ type }) {
  if (type === "happy" || type === "wink") {
    return (
      <>
        <path d="M -22 -4 Q -14 -14 -6 -4" stroke="#5a4a52" strokeWidth="4" fill="none" strokeLinecap="round" />
        {type === "wink" ? (
          <path d="M 6 -2 Q 14 -8 22 -2" stroke="#5a4a52" strokeWidth="4" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 6 -4 Q 14 -14 22 -4" stroke="#5a4a52" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
      </>
    );
  }
  if (type === "sad") {
    return (
      <>
        <circle cx="-14" cy="-6" r="4.5" fill="#5a4a52" />
        <circle cx="14" cy="-6" r="4.5" fill="#5a4a52" />
        <path d="M -20 -14 Q -14 -18 -8 -15" stroke="#5a4a52" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 8 -15 Q 14 -18 20 -14" stroke="#5a4a52" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (type === "star") {
    return (
      <>
        <circle cx="-14" cy="-6" r="5" fill="#5a4a52" />
        <circle cx="14" cy="-6" r="5" fill="#5a4a52" />
        <circle cx="-16" cy="-8" r="1.6" fill="#fff" />
        <circle cx="12" cy="-8" r="1.6" fill="#fff" />
      </>
    );
  }
  return (
    <>
      <circle cx="-14" cy="-6" r="4.5" fill="#5a4a52" />
      <circle cx="14" cy="-6" r="4.5" fill="#5a4a52" />
    </>
  );
}

/**
 * Cute cat mascot, reused across the app to react to user answers.
 * mood: "happy" | "excited" | "sad" | "neutral" | "wink"
 */
export default function Mascot({ mood = "happy", size = 120, className = "" }) {
  const f = FACE[mood] || FACE.happy;
  return (
    <svg
      viewBox="-60 -70 120 140"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`มาสคอตแมว อารมณ์ ${mood}`}
    >
      {/* ears */}
      <path d="M -38 -38 L -46 -68 L -14 -46 Z" fill="#ffc9de" stroke="#5a4a52" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M 38 -38 L 46 -68 L 14 -46 Z" fill="#ffc9de" stroke="#5a4a52" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M -35 -42 L -40 -58 L -22 -46 Z" fill="#fff0f6" />
      <path d="M 35 -42 L 40 -58 L 22 -46 Z" fill="#fff0f6" />

      {/* head */}
      <circle cx="0" cy="-10" r="46" fill="#fff8ee" stroke="#5a4a52" strokeWidth="4" />

      {/* cheeks */}
      <ellipse cx="-30" cy="4" rx="9" ry="6" fill="#ffb6cf" opacity="0.8" />
      <ellipse cx="30" cy="4" rx="9" ry="6" fill="#ffb6cf" opacity="0.8" />

      {/* face */}
      <g transform="translate(0,-14)">
        <Eyes type={f.eye} />
      </g>
      <path d={f.mouth} transform="translate(0,4)" stroke="#5a4a52" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* nose */}
      <path d="M -4 -4 L 4 -4 L 0 1 Z" fill="#ff9ec7" />

      {/* whiskers */}
      <line x1="-46" y1="-6" x2="-70" y2="-10" stroke="#5a4a52" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="-46" y1="2" x2="-70" y2="4" stroke="#5a4a52" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="-6" x2="70" y2="-10" stroke="#5a4a52" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="2" x2="70" y2="4" stroke="#5a4a52" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
