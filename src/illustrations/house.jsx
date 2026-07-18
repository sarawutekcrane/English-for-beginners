import { Frame, INK, House } from "./shared";

export const houseIcons = {
  "house-house": (id) => (
    <Frame id={id}>
      <House x={100} y={140} />
    </Frame>
  ),
  "house-room": (id) => (
    <Frame id={id}>
      <rect x="50" y="70" width="100" height="90" fill="#fff3da" stroke={INK} strokeWidth="3" />
      <rect x="130" y="90" width="14" height="26" rx="3" fill="#8fcfff" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "house-kitchen": (id) => (
    <Frame id={id}>
      <rect x="64" y="110" width="72" height="40" rx="6" fill="#dfe6f0" stroke={INK} strokeWidth="3" />
      <circle cx="82" cy="100" r="9" fill="#ff9ec7" stroke={INK} strokeWidth="2.5" />
      <circle cx="118" cy="100" r="9" fill="#ff9ec7" stroke={INK} strokeWidth="2.5" />
      <rect x="70" y="90" width="60" height="10" rx="3" fill="#c7c7c7" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "house-bedroom": (id) => (
    <Frame id={id}>
      <rect x="54" y="118" width="92" height="30" rx="6" fill="#8fcfff" stroke={INK} strokeWidth="3" />
      <rect x="54" y="100" width="26" height="24" rx="6" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <rect x="54" y="118" width="92" height="12" fill="#ffd6e8" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "house-bathroom": (id) => (
    <Frame id={id}>
      <path d="M 60 110 Q 60 150 100 150 Q 140 150 140 110 Z" fill="#dff1ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="100" cy="110" rx="40" ry="10" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <path d="M 70 90 Q 70 70 100 70" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "house-livingroom": (id) => (
    <Frame id={id}>
      <path d="M 50 120 Q 48 100 70 100 L 130 100 Q 152 100 150 120 L 150 148 L 50 148 Z" fill="#c9a0f5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="86" y="70" width="28" height="20" rx="3" fill="#3a3a3a" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "house-door": (id) => (
    <Frame id={id}>
      <rect x="72" y="58" width="56" height="100" rx="6" fill="#e0a15c" stroke={INK} strokeWidth="3" />
      <circle cx="112" cy="110" r="4" fill={INK} />
    </Frame>
  ),
  "house-window": (id) => (
    <Frame id={id}>
      <rect x="58" y="64" width="84" height="80" rx="6" fill="#dff1ff" stroke={INK} strokeWidth="3.5" />
      <line x1="100" y1="64" x2="100" y2="144" stroke={INK} strokeWidth="3" />
      <line x1="58" y1="104" x2="142" y2="104" stroke={INK} strokeWidth="3" />
    </Frame>
  ),
  "house-table": (id) => (
    <Frame id={id}>
      <rect x="50" y="90" width="100" height="14" rx="4" fill="#e0a15c" stroke={INK} strokeWidth="3" />
      <line x1="62" y1="104" x2="62" y2="150" stroke="#a2704c" strokeWidth="6" strokeLinecap="round" />
      <line x1="138" y1="104" x2="138" y2="150" stroke="#a2704c" strokeWidth="6" strokeLinecap="round" />
    </Frame>
  ),
  "house-chair": (id) => (
    <Frame id={id}>
      <rect x="70" y="60" width="10" height="60" rx="3" fill="#f6d34c" stroke={INK} strokeWidth="2.5" />
      <rect x="70" y="100" width="60" height="12" rx="3" fill="#f6d34c" stroke={INK} strokeWidth="2.5" />
      <line x1="76" y1="112" x2="76" y2="150" stroke="#c98f4a" strokeWidth="6" strokeLinecap="round" />
      <line x1="124" y1="112" x2="124" y2="150" stroke="#c98f4a" strokeWidth="6" strokeLinecap="round" />
    </Frame>
  ),
  "house-bed": (id) => (
    <Frame id={id}>
      <rect x="52" y="112" width="96" height="30" rx="6" fill="#8fcfff" stroke={INK} strokeWidth="3" />
      <rect x="52" y="96" width="28" height="24" rx="6" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <line x1="52" y1="142" x2="52" y2="154" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1="148" y1="142" x2="148" y2="154" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </Frame>
  ),
  "house-sofa": (id) => (
    <Frame id={id}>
      <rect x="54" y="104" width="92" height="34" rx="10" fill="#ff9ec7" stroke={INK} strokeWidth="3" />
      <rect x="46" y="92" width="16" height="46" rx="7" fill="#ff9ec7" stroke={INK} strokeWidth="3" />
      <rect x="138" y="92" width="16" height="46" rx="7" fill="#ff9ec7" stroke={INK} strokeWidth="3" />
    </Frame>
  ),
  "house-tv": (id) => (
    <Frame id={id}>
      <rect x="52" y="70" width="96" height="60" rx="6" fill="#3a3a3a" stroke={INK} strokeWidth="3" />
      <rect x="60" y="78" width="80" height="44" rx="3" fill="#8fcfff" />
      <line x1="100" y1="130" x2="100" y2="146" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="146" x2="120" y2="146" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </Frame>
  ),
  "house-lamp": (id) => (
    <Frame id={id}>
      <path d="M 76 76 L 124 76 L 112 116 L 88 116 Z" fill="#ffd6e8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="100" y1="116" x2="100" y2="156" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="100" cy="160" rx="20" ry="5" fill="#c7c7c7" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "house-mirror": (id) => (
    <Frame id={id}>
      <ellipse cx="100" cy="100" rx="34" ry="46" fill="#dff1ff" stroke="#c7c7c7" strokeWidth="8" />
      <ellipse cx="88" cy="80" rx="8" ry="14" fill="#ffffff" opacity="0.6" />
    </Frame>
  ),
  "house-garden": (id) => (
    <Frame id={id}>
      <path d="M 100 150 L 100 108" stroke="#5fbf77" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="98" r="16" fill="#ffd6e8" stroke={INK} strokeWidth="2.5" />
      <circle cx="70" cy="130" r="10" fill="#ffd166" stroke={INK} strokeWidth="2" />
      <circle cx="130" cy="130" r="10" fill="#ff9ec7" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "house-key": (id) => (
    <Frame id={id}>
      <circle cx="76" cy="90" r="18" fill="none" stroke="#f6d34c" strokeWidth="8" />
      <line x1="90" y1="104" x2="140" y2="150" stroke="#f6d34c" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="130" x2="132" y2="118" stroke="#f6d34c" strokeWidth="6" strokeLinecap="round" />
      <line x1="132" y1="142" x2="144" y2="130" stroke="#f6d34c" strokeWidth="6" strokeLinecap="round" />
    </Frame>
  ),
  "house-fridge": (id) => (
    <Frame id={id}>
      <rect x="66" y="52" width="68" height="112" rx="8" fill="#eef2f8" stroke={INK} strokeWidth="3.5" />
      <line x1="66" y1="94" x2="134" y2="94" stroke={INK} strokeWidth="2.5" />
      <line x1="118" y1="62" x2="118" y2="78" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1="118" y1="104" x2="118" y2="120" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </Frame>
  ),
  "house-shelf": (id) => (
    <Frame id={id}>
      <rect x="50" y="80" width="100" height="8" fill="#c98f4a" stroke={INK} strokeWidth="2.5" />
      <rect x="50" y="122" width="100" height="8" fill="#c98f4a" stroke={INK} strokeWidth="2.5" />
      <rect x="64" y="90" width="14" height="30" fill="#ff9ec7" stroke={INK} strokeWidth="2" />
      <rect x="84" y="94" width="14" height="26" fill="#8fcfff" stroke={INK} strokeWidth="2" />
      <rect x="108" y="88" width="14" height="32" fill="#7bcf9e" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "house-roof": (id) => (
    <Frame id={id}>
      <path d="M 50 130 L 100 66 L 150 130 Z" fill="#ff9ec7" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="66" y="130" width="68" height="16" fill="#fff3da" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
};
