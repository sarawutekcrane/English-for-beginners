import { Frame, INK } from "./shared";

function Wheel({ cx, cy }) {
  return <circle cx={cx} cy={cy} r="12" fill="#3a3a3a" stroke={INK} strokeWidth="2.5" />;
}

export const transportationIcons = {
  "transport-car": (id) => (
    <Frame id={id}>
      <path d="M 50 128 L 56 102 Q 60 92 72 92 L 128 92 Q 140 92 144 102 L 150 128 Z" fill="#f45c5c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 76 92 L 86 70 L 114 70 L 124 92 Z" fill="#dff1ff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <Wheel cx={74} cy={130} />
      <Wheel cx={126} cy={130} />
    </Frame>
  ),
  "transport-bus": (id) => (
    <Frame id={id}>
      <rect x="48" y="70" width="104" height="58" rx="8" fill="#ffd166" stroke={INK} strokeWidth="3" />
      <rect x="58" y="80" width="26" height="18" fill="#dff1ff" stroke={INK} strokeWidth="2" />
      <rect x="92" y="80" width="26" height="18" fill="#dff1ff" stroke={INK} strokeWidth="2" />
      <rect x="126" y="80" width="18" height="18" fill="#dff1ff" stroke={INK} strokeWidth="2" />
      <Wheel cx={70} cy={130} />
      <Wheel cx={130} cy={130} />
    </Frame>
  ),
  "transport-train": (id) => (
    <Frame id={id}>
      <path d="M 56 96 Q 56 76 76 76 L 130 76 Q 150 76 150 96 L 150 126 L 56 126 Z" fill="#8fcfff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="90" cy="98" r="12" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <circle cx="126" cy="98" r="12" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <Wheel cx={76} cy={134} />
      <Wheel cx={130} cy={134} />
    </Frame>
  ),
  "transport-airplane": (id) => (
    <Frame id={id}>
      <path d="M 60 108 L 140 100 L 154 106 L 140 114 L 60 116 Z" fill="#dff1ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 92 108 L 76 78 L 90 80 L 108 106 Z" fill="#8fcfff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 92 114 L 76 142 L 90 140 L 108 116 Z" fill="#8fcfff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "transport-bicycle": (id) => (
    <Frame id={id}>
      <circle cx="72" cy="128" r="24" fill="none" stroke="#3a3a3a" strokeWidth="4" />
      <circle cx="130" cy="128" r="24" fill="none" stroke="#3a3a3a" strokeWidth="4" />
      <path d="M 72 128 L 100 88 L 130 128 M 100 88 L 84 88 M 100 96 L 118 96" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),
  "transport-motorcycle": (id) => (
    <Frame id={id}>
      <circle cx="66" cy="128" r="18" fill="none" stroke="#3a3a3a" strokeWidth="4" />
      <circle cx="134" cy="128" r="18" fill="none" stroke="#3a3a3a" strokeWidth="4" />
      <path d="M 66 128 L 108 110 L 134 128 M 92 110 L 100 90 L 116 90" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="98" y="98" width="26" height="10" rx="4" fill="#f45c5c" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "transport-taxi": (id) => (
    <Frame id={id}>
      <path d="M 50 128 L 56 102 Q 60 92 72 92 L 128 92 Q 140 92 144 102 L 150 128 Z" fill="#f6d34c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="80" y="80" width="40" height="10" fill="#3a3a3a" />
      <Wheel cx={74} cy={130} />
      <Wheel cx={126} cy={130} />
    </Frame>
  ),
  "transport-boat": (id) => (
    <Frame id={id}>
      <path d="M 50 128 Q 100 148 150 128 L 138 150 L 62 150 Z" fill="#4c8df0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="100" y1="128" x2="100" y2="66" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M 100 70 L 132 100 L 100 100 Z" fill="#ffffff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "transport-subway": (id) => (
    <Frame id={id}>
      <path d="M 50 130 Q 100 76 150 130 Z" fill="none" stroke={INK} strokeWidth="3" opacity="0.4" />
      <rect x="66" y="94" width="68" height="44" rx="8" fill="#7bcf9e" stroke={INK} strokeWidth="3" />
      <circle cx="86" cy="106" r="7" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <circle cx="114" cy="106" r="7" fill="#ffffff" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "transport-ship": (id) => (
    <Frame id={id}>
      <path d="M 46 126 Q 100 150 154 126 L 140 152 L 60 152 Z" fill="#4c6b9e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="82" y="86" width="36" height="40" rx="4" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <rect x="94" y="64" width="12" height="24" fill="#f45c5c" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "transport-traffic": (id) => (
    <Frame id={id}>
      <path d="M 44 132 L 50 108 Q 54 100 64 100 L 100 100 Q 110 100 114 108 L 120 132 Z" fill="#8fcfff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 90 148 L 96 128 Q 100 120 108 120 L 140 120 Q 148 120 152 128 L 158 148 Z" fill="#f6d34c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "transport-road": (id) => (
    <Frame id={id}>
      <path d="M 76 60 L 66 150 L 84 150 L 92 60 Z" fill="#5a4a52" stroke={INK} strokeWidth="2" />
      <path d="M 124 60 L 134 150 L 116 150 L 108 60 Z" fill="#5a4a52" stroke={INK} strokeWidth="2" />
      <line x1="100" y1="60" x2="100" y2="150" stroke="#ffd166" strokeWidth="5" strokeDasharray="12 10" />
    </Frame>
  ),
  "transport-ticket": (id) => (
    <Frame id={id}>
      <path d="M 50 90 L 150 90 L 150 130 Q 140 130 140 140 Q 140 150 150 150 L 50 150 Q 50 140 60 140 Q 60 130 50 130 Z" fill="#ffd6e8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="100" y1="90" x2="100" y2="150" stroke={INK} strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
    </Frame>
  ),
  "transport-station": (id) => (
    <Frame id={id}>
      <rect x="54" y="90" width="92" height="60" fill="#dff1ff" stroke={INK} strokeWidth="3" />
      <path d="M 46 90 L 100 62 L 154 90 Z" fill="#4c8df0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="100" cy="118" r="14" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "transport-airport": (id) => (
    <Frame id={id}>
      <path d="M 54 118 L 134 110 L 148 116 L 134 124 L 54 126 Z" fill="#dff1ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="50" y1="140" x2="150" y2="140" stroke="#a9a9a9" strokeWidth="5" strokeDasharray="10 8" />
    </Frame>
  ),
  "transport-passenger": (id) => (
    <Frame id={id}>
      <rect x="70" y="106" width="60" height="40" rx="6" fill="#c9a0f5" stroke={INK} strokeWidth="3" />
      <circle cx="100" cy="88" r="18" fill="#ffe9d6" stroke={INK} strokeWidth="3" />
    </Frame>
  ),
  "transport-trafficlight": (id) => (
    <Frame id={id}>
      <rect x="84" y="56" width="32" height="86" rx="10" fill="#3a3a3a" stroke={INK} strokeWidth="3" />
      <circle cx="100" cy="76" r="9" fill="#f45c5c" stroke={INK} strokeWidth="2" />
      <circle cx="100" cy="100" r="9" fill="#f6d34c" stroke={INK} strokeWidth="2" />
      <circle cx="100" cy="124" r="9" fill="#7bcf9e" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "transport-parking": (id) => (
    <Frame id={id}>
      <rect x="58" y="58" width="84" height="92" rx="8" fill="#4c8df0" stroke={INK} strokeWidth="3" />
      <text x="100" y="120" fontSize="56" fontWeight="800" textAnchor="middle" fill="#ffffff" fontFamily="'Baloo 2', sans-serif">P</text>
    </Frame>
  ),
  "transport-highway": (id) => (
    <Frame id={id}>
      <path d="M 40 150 L 90 58 L 110 58 L 60 150 Z" fill="#5a4a52" stroke={INK} strokeWidth="2" />
      <path d="M 130 58 L 160 150 L 140 150 L 110 58 Z" fill="#5a4a52" stroke={INK} strokeWidth="2" />
      <line x1="85" y1="150" x2="100" y2="58" stroke="#ffd166" strokeWidth="4" strokeDasharray="10 8" />
    </Frame>
  ),
  "transport-seatbelt": (id) => (
    <Frame id={id}>
      <ellipse cx="100" cy="110" rx="34" ry="44" fill="#ffe9d6" stroke={INK} strokeWidth="3" />
      <path d="M 68 76 L 132 148" stroke="#f45c5c" strokeWidth="10" strokeLinecap="round" />
      <rect x="92" y="118" width="16" height="16" rx="3" fill="#a9a9a9" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
};
