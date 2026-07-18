const BG_COLORS = ["#ffe3ef", "#dff1ff", "#fff3da", "#e6f7ea"];

export function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/** Shared rounded backdrop + outer frame so every illustration reads as one family. */
export function Frame({ id = "", children }) {
  const bg = BG_COLORS[hashStr(id) % BG_COLORS.length];
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" role="img" aria-hidden="true">
      <circle cx="100" cy="104" r="86" fill={bg} />
      <circle cx="100" cy="104" r="86" fill="none" stroke="#5a4a52" strokeWidth="3" strokeDasharray="2 10" opacity="0.25" />
      {children}
    </svg>
  );
}

export const INK = "#5a4a52";

export function Sparkle({ x, y, s = 1 }) {
  return (
    <path
      transform={`translate(${x},${y}) scale(${s})`}
      d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z"
      fill="#ffd166"
    />
  );
}

export function Sun({ cx, cy, r, color = "#ffcf6b" }) {
  const rays = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const x1 = cx + Math.cos(a) * (r + 6);
    const y1 = cy + Math.sin(a) * (r + 6);
    const x2 = cx + Math.cos(a) * (r + 16);
    const y2 = cy + Math.sin(a) * (r + 16);
    rays.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" />);
  }
  return (
    <g>
      {rays}
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={INK} strokeWidth="3" />
    </g>
  );
}

export function House({ x = 100, y = 120, roof = "#ff9ec7", wall = "#fff3da", door = "#8fcfff" }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-38" y="-6" width="76" height="46" rx="6" fill={wall} stroke={INK} strokeWidth="3" />
      <path d="M -46 -6 L 0 -44 L 46 -6 Z" fill={roof} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="-10" y="12" width="20" height="28" rx="3" fill={door} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** Cute round-headed chibi person used as the base for greeting illustrations. */
export function Chibi({ shirt = "#8fcfff", armPose = "down", face = "smile", flip = false }) {
  return (
    <g transform={flip ? "translate(200,0) scale(-1,1)" : undefined}>
      {/* body */}
      <path d="M 72 150 Q 70 110 100 108 Q 130 110 128 150 Z" fill={shirt} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      {/* arms */}
      <Arm pose={armPose} shirt={shirt} />
      {/* head */}
      <circle cx="100" cy="80" r="34" fill="#ffe9d6" stroke={INK} strokeWidth="3.5" />
      {/* hair */}
      <path d="M 68 68 Q 72 40 100 40 Q 128 40 132 68 Q 118 58 100 58 Q 82 58 68 68 Z" fill="#6b4a57" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* cheeks */}
      <ellipse cx="80" cy="88" rx="6" ry="4" fill="#ffb6cf" opacity="0.9" />
      <ellipse cx="120" cy="88" rx="6" ry="4" fill="#ffb6cf" opacity="0.9" />
      <Face type={face} />
    </g>
  );
}

function Arm({ pose, shirt }) {
  if (pose === "wave") {
    return <path d="M 128 118 Q 150 100 152 72" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" />;
  }
  if (pose === "up") {
    return (
      <>
        <path d="M 128 120 Q 146 96 140 70" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" />
        <path d="M 72 120 Q 54 96 60 70" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" />
      </>
    );
  }
  if (pose === "praying") {
    return <path d="M 88 128 Q 100 110 112 128" fill="none" stroke={shirt} strokeWidth="16" strokeLinecap="round" />;
  }
  if (pose === "bow") {
    return (
      <>
        <path d="M 128 122 Q 118 108 100 116" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" />
        <path d="M 72 122 Q 82 108 100 116" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <path d="M 128 118 Q 138 132 132 148" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" />
      <path d="M 72 118 Q 62 132 68 148" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" />
    </>
  );
}

function Face({ type }) {
  if (type === "smile") {
    return (
      <>
        <circle cx="88" cy="78" r="3.6" fill={INK} />
        <circle cx="112" cy="78" r="3.6" fill={INK} />
        <path d="M 88 92 Q 100 100 112 92" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (type === "happy") {
    return (
      <>
        <path d="M 82 76 Q 88 70 94 76" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 106 76 Q 112 70 118 76" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 86 90 Q 100 102 114 90" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (type === "wink") {
    return (
      <>
        <path d="M 84 78 L 94 78" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <circle cx="112" cy="78" r="3.6" fill={INK} />
        <path d="M 88 92 Q 100 100 112 92" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (type === "sad") {
    return (
      <>
        <circle cx="88" cy="80" r="3.6" fill={INK} />
        <circle cx="112" cy="80" r="3.6" fill={INK} />
        <path d="M 88 98 Q 100 90 112 98" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (type === "surprised") {
    return (
      <>
        <circle cx="88" cy="78" r="4" fill={INK} />
        <circle cx="112" cy="78" r="4" fill={INK} />
        <circle cx="100" cy="94" r="5" fill={INK} opacity="0.85" />
      </>
    );
  }
  return (
    <>
      <circle cx="88" cy="78" r="3.6" fill={INK} />
      <circle cx="112" cy="78" r="3.6" fill={INK} />
      <path d="M 90 94 L 110 94" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  );
}
