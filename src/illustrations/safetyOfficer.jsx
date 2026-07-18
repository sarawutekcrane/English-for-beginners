import { Frame, INK } from "./shared";

/**
 * Phase 9: 75 safety_officer vocabulary terms share these 13 icons, grouped
 * semantically (see gen_safety_officer.py / Phase 9 commit message for the
 * full word->icon mapping) rather than hand-drawing all 75 individually.
 */
export const safetyOfficerIcons = {
  "sf-hazard": (id) => (
    <Frame id={id}>
      <path d="M 100 46 L 156 148 L 44 148 Z" fill="#ffd166" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="96" y="88" width="8" height="32" rx="3" fill={INK} />
      <circle cx="100" cy="132" r="4.5" fill={INK} />
    </Frame>
  ),
  "sf-injury": (id) => (
    <Frame id={id}>
      <path d="M 60 130 Q 60 90 100 90 Q 140 90 140 130" fill="none" stroke="#ffb6a3" strokeWidth="22" strokeLinecap="round" />
      <rect x="82" y="96" width="36" height="24" rx="6" fill="#fff8ee" stroke={INK} strokeWidth="2.5" />
      <path d="M 96 100 L 96 116 M 88 108 L 104 108" stroke="#e85d7a" strokeWidth="3" strokeLinecap="round" />
    </Frame>
  ),
  "sf-critical": (id) => (
    <Frame id={id}>
      <path
        d="M 30 104 L 66 104 L 78 76 L 96 132 L 110 104 L 170 104"
        fill="none"
        stroke="#e85d7a"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  ),
  "sf-emergency": (id) => (
    <Frame id={id}>
      <rect x="76" y="100" width="48" height="36" rx="6" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <path d="M 76 100 Q 100 66 124 100 Z" fill="#e85d7a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="100" cy="60" r="6" fill="#ffd166" />
      <line x1="70" y1="76" x2="60" y2="66" stroke="#ffd166" strokeWidth="3" strokeLinecap="round" />
      <line x1="130" y1="76" x2="140" y2="66" stroke="#ffd166" strokeWidth="3" strokeLinecap="round" />
    </Frame>
  ),
  "sf-firstaid": (id) => (
    <Frame id={id}>
      <rect x="54" y="84" width="92" height="64" rx="10" fill="#ffffff" stroke={INK} strokeWidth="3.5" />
      <rect x="82" y="70" width="36" height="24" rx="6" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <path d="M 92 104 L 108 104 M 100 96 L 100 112" stroke="#4fae78" strokeWidth="6" strokeLinecap="round" />
    </Frame>
  ),
  "sf-medicine": (id) => (
    <Frame id={id}>
      <rect x="78" y="86" width="44" height="56" rx="8" fill="#8fcfff" stroke={INK} strokeWidth="3" />
      <rect x="84" y="70" width="32" height="18" rx="4" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <rect x="78" y="112" width="44" height="14" fill="#ffffff" opacity="0.85" />
    </Frame>
  ),
  "sf-checkup": (id) => (
    <Frame id={id}>
      <path d="M 66 60 L 66 100 Q 66 130 100 130 Q 134 130 134 100 L 134 80" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="66" cy="54" r="8" fill="#8fcfff" stroke={INK} strokeWidth="2.5" />
      <circle cx="134" cy="74" r="8" fill="#8fcfff" stroke={INK} strokeWidth="2.5" />
      <circle cx="100" cy="140" r="12" fill="#ffffff" stroke={INK} strokeWidth="3" />
    </Frame>
  ),
  "sf-symptom": (id) => (
    <Frame id={id}>
      <rect x="92" y="50" width="16" height="70" rx="8" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <circle cx="100" cy="132" r="18" fill="#e85d7a" stroke={INK} strokeWidth="3" />
      <rect x="96" y="70" width="8" height="50" fill="#e85d7a" />
    </Frame>
  ),
  "sf-recovery": (id) => (
    <Frame id={id}>
      <line x1="76" y1="52" x2="76" y2="150" stroke="#c98f4a" strokeWidth="7" strokeLinecap="round" />
      <line x1="124" y1="52" x2="124" y2="150" stroke="#c98f4a" strokeWidth="7" strokeLinecap="round" />
      <line x1="60" y1="70" x2="92" y2="70" stroke="#c98f4a" strokeWidth="7" strokeLinecap="round" />
      <line x1="108" y1="70" x2="140" y2="70" stroke="#c98f4a" strokeWidth="7" strokeLinecap="round" />
      <line x1="66" y1="106" x2="86" y2="106" stroke="#a2704c" strokeWidth="6" strokeLinecap="round" />
      <line x1="114" y1="106" x2="134" y2="106" stroke="#a2704c" strokeWidth="6" strokeLinecap="round" />
    </Frame>
  ),
  "sf-hygiene": (id) => (
    <Frame id={id}>
      <path
        d="M 100 52 Q 130 96 130 118 A 30 30 0 1 1 70 118 Q 70 96 100 52 Z"
        fill="#8fcfff"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <ellipse cx="88" cy="112" rx="8" ry="12" fill="#ffffff" opacity="0.6" />
    </Frame>
  ),
  "sf-allergy": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="104" r="34" fill="#ffe9d6" stroke={INK} strokeWidth="3.5" />
      <circle cx="88" cy="98" r="3.5" fill={INK} />
      <circle cx="112" cy="98" r="3.5" fill={INK} />
      <path d="M 88 116 Q 100 108 112 116" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="110" rx="6" ry="4" fill="#ff9ec7" opacity="0.8" />
      <ellipse cx="130" cy="110" rx="6" ry="4" fill="#ff9ec7" opacity="0.8" />
    </Frame>
  ),
  "sf-ppe": (id) => (
    <Frame id={id}>
      <path d="M 54 128 Q 54 78 100 78 Q 146 78 146 128 Z" fill="#ffd166" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="50" y="124" width="100" height="14" rx="7" fill="#f6c344" stroke={INK} strokeWidth="3" />
      <line x1="100" y1="78" x2="100" y2="128" stroke={INK} strokeWidth="2.5" opacity="0.4" />
    </Frame>
  ),
  "sf-wellbeing": (id) => (
    <Frame id={id}>
      <path
        d="M 100 50 L 144 66 L 144 104 Q 144 138 100 154 Q 56 138 56 104 L 56 66 Z"
        fill="#7bcf9e"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="92" y="80" width="16" height="48" rx="4" fill="#ffffff" />
      <rect x="76" y="96" width="48" height="16" rx="4" fill="#ffffff" />
    </Frame>
  ),
};
