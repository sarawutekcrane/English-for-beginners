import { Frame, INK } from "./shared";

function Bowl({ fill = "#fff3da" }) {
  return (
    <g>
      <path d="M 50 120 Q 50 150 100 152 Q 150 150 150 120 Z" fill={fill} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="100" cy="120" rx="50" ry="14" fill="#fff8ea" stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Cup({ fill = "#ffffff" }) {
  return (
    <g>
      <path d="M 64 100 Q 62 140 100 144 Q 138 140 136 100 Z" fill={fill} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 138 108 Q 158 108 156 124 Q 154 138 136 134" fill="none" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Steam({ x = 100, y = 80 }) {
  return (
    <path
      d={`M ${x - 8} ${y + 20} Q ${x - 14} ${y + 4} ${x - 4} ${y - 10}`}
      stroke="#c7b6bd"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      opacity="0.55"
    />
  );
}

export const foodIcons = {
  "food-apple": (id) => (
    <Frame id={id}>
      <path
        d="M 100 92 C 70 88 62 130 90 148 Q 100 154 110 148 C 138 130 130 88 100 92 Z"
        fill="#f45c5c"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="97" y="76" width="6" height="18" rx="3" fill="#8a6a4a" />
      <path d="M 103 82 Q 118 78 122 90" stroke="#5fbf77" strokeWidth="6" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "food-bread": (id) => (
    <Frame id={id}>
      <path d="M 60 130 Q 55 80 100 78 Q 145 80 140 130 Z" fill="#f3c988" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 75 95 Q 80 85 90 95" stroke="#c98f4a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 100 92 Q 105 82 115 92" stroke="#c98f4a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "food-water": (id) => (
    <Frame id={id}>
      <path d="M 76 76 L 124 76 L 116 148 Q 100 156 84 148 Z" fill="#dff1ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 82 96 L 118 96" stroke="#8fcfff" strokeWidth="4" opacity="0.6" />
    </Frame>
  ),
  "food-rice": (id) => (
    <Frame id={id}>
      <Bowl fill="#fff3da" />
      <ellipse cx="100" cy="112" rx="34" ry="16" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <line x1="120" y1="70" x2="132" y2="110" stroke="#e0b978" strokeWidth="5" strokeLinecap="round" />
      <line x1="130" y1="68" x2="140" y2="108" stroke="#e0b978" strokeWidth="5" strokeLinecap="round" />
    </Frame>
  ),
  "food-chicken": (id) => (
    <Frame id={id}>
      <path
        d="M 90 70 Q 130 78 128 110 Q 126 130 104 136 Q 88 140 78 128 Q 66 112 78 88 Q 82 76 90 70 Z"
        fill="#e0a15c"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M 92 132 L 82 152 Q 78 158 86 160 L 96 144 Z" fill="#ffe9d6" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "food-coffee": (id) => (
    <Frame id={id}>
      <Cup fill="#c8926a" />
      <Steam x={90} y={78} />
      <Steam x={112} y={74} />
    </Frame>
  ),
};
