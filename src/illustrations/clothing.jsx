import { Frame, INK } from "./shared";

function ShirtShape({ fill }) {
  return (
    <path
      d="M 80 62 L 100 78 L 120 62 L 148 78 L 136 100 L 128 94 L 128 150 L 72 150 L 72 94 L 64 100 L 52 78 Z"
      fill={fill}
      stroke={INK}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  );
}

export const clothingIcons = {
  "clothing-shirt": (id) => (
    <Frame id={id}>
      <ShirtShape fill="#8fcfff" />
      <line x1="100" y1="78" x2="100" y2="150" stroke={INK} strokeWidth="1.5" opacity="0.4" />
    </Frame>
  ),
  "clothing-tshirt": (id) => (
    <Frame id={id}>
      <ShirtShape fill="#ff9ec7" />
    </Frame>
  ),
  "clothing-pants": (id) => (
    <Frame id={id}>
      <path d="M 72 60 L 128 60 L 130 150 L 108 150 L 100 96 L 92 150 L 70 150 Z" fill="#4c6b9e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "clothing-dress": (id) => (
    <Frame id={id}>
      <path d="M 84 58 L 116 58 L 130 90 L 150 150 L 50 150 L 70 90 Z" fill="#ff9ec7" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="100" cy="70" r="10" fill="#ffe9d6" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "clothing-skirt": (id) => (
    <Frame id={id}>
      <path d="M 76 80 L 124 80 L 148 148 L 52 148 Z" fill="#c9a0f5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="76" y="68" width="48" height="14" rx="4" fill="#c9a0f5" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "clothing-jacket": (id) => (
    <Frame id={id}>
      <ShirtShape fill="#5fbf77" />
      <line x1="100" y1="78" x2="92" y2="150" stroke={INK} strokeWidth="2" opacity="0.5" />
      <circle cx="94" cy="100" r="2.5" fill={INK} />
      <circle cx="94" cy="120" r="2.5" fill={INK} />
    </Frame>
  ),
  "clothing-coat": (id) => (
    <Frame id={id}>
      <path d="M 74 60 L 100 76 L 126 60 L 150 84 L 138 104 L 130 98 L 130 156 L 70 156 L 70 98 L 62 104 L 50 84 Z" fill="#a2704c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "clothing-shoes": (id) => (
    <Frame id={id}>
      <path d="M 54 132 L 90 132 L 90 112 L 108 112 L 140 128 Q 150 132 148 142 L 54 142 Z" fill="#3a3a3a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="70" y1="118" x2="82" y2="118" stroke="#ffffff" strokeWidth="2.5" />
    </Frame>
  ),
  "clothing-socks": (id) => (
    <Frame id={id}>
      <path d="M 84 56 L 116 56 L 116 110 Q 140 110 140 134 Q 140 148 122 148 L 84 148 Z" fill="#ffd6e8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="84" y1="76" x2="116" y2="76" stroke="#ff9ec7" strokeWidth="4" opacity="0.7" />
    </Frame>
  ),
  "clothing-hat": (id) => (
    <Frame id={id}>
      <ellipse cx="100" cy="120" rx="50" ry="12" fill="#f6d34c" stroke={INK} strokeWidth="3" />
      <path d="M 70 120 Q 70 76 100 76 Q 130 76 130 120" fill="#ffd166" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "clothing-jeans": (id) => (
    <Frame id={id}>
      <path d="M 72 60 L 128 60 L 130 150 L 108 150 L 100 96 L 92 150 L 70 150 Z" fill="#4c8df0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="80" y1="70" x2="80" y2="140" stroke="#2f5fb0" strokeWidth="2" opacity="0.6" />
      <line x1="120" y1="70" x2="120" y2="140" stroke="#2f5fb0" strokeWidth="2" opacity="0.6" />
    </Frame>
  ),
  "clothing-shorts": (id) => (
    <Frame id={id}>
      <path d="M 74 70 L 126 70 L 128 118 L 108 118 L 100 96 L 92 118 L 72 118 Z" fill="#7bcf9e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "clothing-gloves": (id) => (
    <Frame id={id}>
      <path d="M 70 110 L 70 80 Q 70 72 78 72 Q 86 72 86 80 L 86 96 L 90 96 L 90 74 Q 90 66 98 66 Q 106 66 106 74 L 106 96 L 110 96 L 110 78 Q 110 70 118 70 Q 126 70 126 78 L 126 96 L 130 96 L 130 88 Q 130 80 138 80 Q 146 80 146 88 L 146 116 Q 146 148 108 148 Q 70 148 70 116 Z" fill="#ff9ec7" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "clothing-scarf": (id) => (
    <Frame id={id}>
      <path d="M 50 80 Q 100 100 150 80 L 150 92 Q 100 112 50 92 Z" fill="#c9a0f5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="86" y="108" width="18" height="44" rx="4" fill="#c9a0f5" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "clothing-belt": (id) => (
    <Frame id={id}>
      <rect x="50" y="94" width="100" height="20" rx="4" fill="#a2704c" stroke={INK} strokeWidth="3" />
      <rect x="88" y="90" width="24" height="28" rx="4" fill="#f6d34c" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "clothing-sweater": (id) => (
    <Frame id={id}>
      <ShirtShape fill="#e0876b" />
      <line x1="72" y1="110" x2="128" y2="110" stroke="#a2704c" strokeWidth="2" opacity="0.5" />
      <line x1="72" y1="130" x2="128" y2="130" stroke="#a2704c" strokeWidth="2" opacity="0.5" />
    </Frame>
  ),
  "clothing-underwear": (id) => (
    <Frame id={id}>
      <path d="M 70 82 L 130 82 L 126 108 L 108 108 L 100 96 L 92 108 L 74 108 Z" fill="#ffd6e8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "clothing-boots": (id) => (
    <Frame id={id}>
      <path d="M 62 148 L 62 92 Q 62 84 70 84 L 92 84 L 92 118 L 110 118 Q 138 122 138 140 L 138 148 Z" fill="#5a4a52" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="66" y1="98" x2="88" y2="98" stroke="#8a7a82" strokeWidth="3" />
    </Frame>
  ),
  "clothing-sunglasses": (id) => (
    <Frame id={id}>
      <circle cx="76" cy="104" r="22" fill="#3a3a3a" stroke={INK} strokeWidth="3" />
      <circle cx="124" cy="104" r="22" fill="#3a3a3a" stroke={INK} strokeWidth="3" />
      <line x1="98" y1="100" x2="102" y2="100" stroke={INK} strokeWidth="3" />
      <line x1="54" y1="98" x2="42" y2="90" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <line x1="146" y1="98" x2="158" y2="90" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </Frame>
  ),
  "clothing-pajamas": (id) => (
    <Frame id={id}>
      <ShirtShape fill="#8fcfff" />
      <circle cx="88" cy="112" r="3" fill="#ffffff" />
      <circle cx="112" cy="112" r="3" fill="#ffffff" />
      <circle cx="100" cy="130" r="3" fill="#ffffff" />
    </Frame>
  ),
};
