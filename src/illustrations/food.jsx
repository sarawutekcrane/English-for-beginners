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
  "food-milk": (id) => (
    <Frame id={id}>
      <path
        d="M 76 80 L 124 80 L 124 140 Q 124 148 116 148 L 84 148 Q 76 148 76 140 Z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M 76 80 L 100 64 L 124 80 Z" fill="#8fcfff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="76" y="104" width="48" height="14" fill="#8fcfff" opacity="0.5" />
    </Frame>
  ),
  "food-egg": (id) => (
    <Frame id={id}>
      <ellipse cx="100" cy="112" rx="44" ry="30" fill="#fff8ea" stroke={INK} strokeWidth="3" />
      <circle cx="100" cy="112" r="16" fill="#ffcf6b" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "food-fish": (id) => (
    <Frame id={id}>
      <path d="M 60 110 Q 90 84 140 100 Q 150 110 140 120 Q 90 136 60 110 Z" fill="#8fcfff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 60 110 L 40 96 L 44 110 L 40 124 Z" fill="#8fcfff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="128" cy="104" r="3.5" fill={INK} />
    </Frame>
  ),
  "food-beef": (id) => (
    <Frame id={id}>
      <path
        d="M 80 70 Q 130 70 132 105 Q 134 130 108 140 Q 90 146 78 130 Q 66 112 80 70 Z"
        fill="#e0876b"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M 96 138 L 84 158 Q 80 164 88 166 L 100 150 Z" fill="#ffe9d6" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "food-vegetable": (id) => (
    <Frame id={id}>
      <path d="M 100 80 Q 118 100 108 140 Q 100 150 92 140 Q 82 100 100 80 Z" fill="#f5924a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 100 80 Q 90 62 78 66" stroke="#5fbf77" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M 100 80 Q 110 60 124 64" stroke="#5fbf77" strokeWidth="8" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "food-fruit": (id) => (
    <Frame id={id}>
      <circle cx="82" cy="118" r="24" fill="#ff9ec7" stroke={INK} strokeWidth="3" />
      <circle cx="122" cy="112" r="20" fill="#f6d34c" stroke={INK} strokeWidth="3" />
      <path d="M 82 94 Q 90 84 98 92" stroke="#5fbf77" strokeWidth="5" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "food-tea": (id) => (
    <Frame id={id}>
      <Cup fill="#c8e6c9" />
      <Steam x={100} y={78} />
    </Frame>
  ),
  "food-juice": (id) => (
    <Frame id={id}>
      <path d="M 78 84 L 122 84 L 114 146 Q 100 152 86 146 Z" fill="#ffcf8a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="112" y1="60" x2="102" y2="94" stroke="#ff9ec7" strokeWidth="6" strokeLinecap="round" />
    </Frame>
  ),
  "food-soup": (id) => (
    <Frame id={id}>
      <Bowl fill="#ffdca0" />
      <circle cx="86" cy="112" r="7" fill="#f5924a" stroke={INK} strokeWidth="2" />
      <circle cx="112" cy="118" r="6" fill="#7bcf9e" stroke={INK} strokeWidth="2" />
      <Steam x={80} y={78} />
      <Steam x={118} y={74} />
    </Frame>
  ),
  "food-salad": (id) => (
    <Frame id={id}>
      <Bowl fill="#ffffff" />
      <path
        d="M 66 104 Q 80 92 92 104 Q 78 108 66 104 Z M 100 100 Q 114 88 128 100 Q 114 106 100 100 Z"
        fill="#7bcf9e"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="90" cy="112" r="7" fill="#f45c5c" stroke={INK} strokeWidth="2" />
      <circle cx="118" cy="114" r="6" fill="#f45c5c" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "food-noodles": (id) => (
    <Frame id={id}>
      <Bowl fill="#dff1ff" />
      <path
        d="M 64 108 Q 74 98 84 108 Q 94 118 104 108 Q 114 98 124 108 Q 134 118 144 108"
        fill="none"
        stroke="#fff8ea"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <Steam x={80} y={72} />
      <Steam x={118} y={70} />
    </Frame>
  ),
  "food-cheese": (id) => (
    <Frame id={id}>
      <path d="M 60 130 L 110 60 L 150 130 Z" fill="#ffd166" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="105" cy="100" r="6" fill="#ffe9a6" stroke={INK} strokeWidth="1.5" />
      <circle cx="90" cy="118" r="5" fill="#ffe9a6" stroke={INK} strokeWidth="1.5" />
      <circle cx="122" cy="115" r="4" fill="#ffe9a6" stroke={INK} strokeWidth="1.5" />
    </Frame>
  ),
  "food-butter": (id) => (
    <Frame id={id}>
      <rect x="56" y="96" width="88" height="24" rx="4" fill="#fff8ea" stroke={INK} strokeWidth="2.5" />
      <rect x="64" y="70" width="40" height="30" rx="6" fill="#ffe9a6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "food-sugar": (id) => (
    <Frame id={id}>
      <Bowl fill="#ffffff" />
      <rect x="80" y="96" width="16" height="16" rx="2" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <rect x="100" y="88" width="16" height="16" rx="2" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <rect x="90" y="80" width="16" height="16" rx="2" fill="#ffffff" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
};
