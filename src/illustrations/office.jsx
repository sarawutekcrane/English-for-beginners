import { Frame, INK } from "./shared";

/**
 * Office Communication category: 30 vocabulary entries, 8 grouped icons
 * (same icon-grouping approach as safety_officer in Phase 9 -- concepts
 * cluster into a handful of shared visuals rather than one icon per word).
 */
export const officeIcons = {
  "office-meeting": (id) => (
    <Frame id={id}>
      <rect x="54" y="104" width="92" height="20" rx="8" fill="#cdeaff" stroke={INK} strokeWidth="3" />
      <circle cx="72" cy="82" r="16" fill="#ffe9d6" stroke={INK} strokeWidth="2.5" />
      <circle cx="128" cy="82" r="16" fill="#ffe9d6" stroke={INK} strokeWidth="2.5" />
      <path d="M 60 104 Q 62 90 72 88 Q 82 90 84 104 Z" fill="#ff9ec7" stroke={INK} strokeWidth="2.5" />
      <path d="M 116 104 Q 118 90 128 88 Q 138 90 140 104 Z" fill="#8fcfff" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "office-calendar": (id) => (
    <Frame id={id}>
      <rect x="56" y="66" width="88" height="80" rx="8" fill="#fff8ea" stroke={INK} strokeWidth="3" />
      <rect x="56" y="66" width="88" height="24" rx="8" fill="#ff9ec7" stroke={INK} strokeWidth="3" />
      <rect x="76" y="56" width="8" height="20" rx="3" fill={INK} />
      <rect x="116" y="56" width="8" height="20" rx="3" fill={INK} />
      <rect x="70" y="104" width="16" height="16" rx="3" fill="#ffd166" stroke={INK} strokeWidth="2" />
      <rect x="92" y="104" width="16" height="16" rx="3" fill="#cdeaff" stroke={INK} strokeWidth="2" />
      <rect x="114" y="104" width="16" height="16" rx="3" fill="#cdeaff" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "office-deadline": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="106" r="46" fill="#fff8ea" stroke={INK} strokeWidth="3.5" />
      <path d="M 100 106 L 100 76" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M 100 106 L 122 116" stroke="#e85d7a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="106" r="4.5" fill={INK} />
      <rect x="86" y="50" width="28" height="10" rx="4" fill="#e85d7a" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "office-email": (id) => (
    <Frame id={id}>
      <rect x="48" y="72" width="104" height="72" rx="8" fill="#cdeaff" stroke={INK} strokeWidth="3" />
      <path d="M 48 78 L 100 118 L 152 78" fill="none" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    </Frame>
  ),
  "office-feedback": (id) => (
    <Frame id={id}>
      <path d="M 52 68 Q 52 56 64 56 L 136 56 Q 148 56 148 68 L 148 106 Q 148 118 136 118 L 92 118 L 72 138 L 76 118 L 64 118 Q 52 118 52 106 Z" fill="#fff8ea" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 78 90 L 92 102 L 122 74" fill="none" stroke="#4fae78" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),
  "office-handshake": (id) => (
    <Frame id={id}>
      <path d="M 50 100 L 78 100 L 96 110 L 78 116 L 50 112 Z" fill="#ffd6e8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 150 100 L 122 100 L 104 110 L 122 116 L 150 112 Z" fill="#cdeaff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="90" y="100" width="20" height="16" rx="6" fill="#ffe9d6" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "office-document": (id) => (
    <Frame id={id}>
      <rect x="62" y="52" width="76" height="100" rx="6" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <path d="M 62 52 L 108 52 L 138 82 L 138 152 L 62 152 Z" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 108 52 L 108 82 L 138 82" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="76" y1="98" x2="124" y2="98" stroke="#8fcfff" strokeWidth="5" strokeLinecap="round" />
      <line x1="76" y1="114" x2="124" y2="114" stroke="#8fcfff" strokeWidth="5" strokeLinecap="round" />
      <line x1="76" y1="130" x2="108" y2="130" stroke="#8fcfff" strokeWidth="5" strokeLinecap="round" />
    </Frame>
  ),
  "office-phone": (id) => (
    <Frame id={id}>
      <rect x="70" y="50" width="60" height="104" rx="12" fill="#5a4a52" stroke={INK} strokeWidth="3" />
      <rect x="78" y="62" width="44" height="70" rx="4" fill="#cdeaff" />
      <circle cx="100" cy="144" r="5" fill="#fff8ea" />
    </Frame>
  ),
};
