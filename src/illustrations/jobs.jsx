import { Frame, INK, Chibi } from "./shared";

export const jobsIcons = {
  "job-teacher": (id) => (
    <Frame id={id}>
      <Chibi shirt="#c9a0f5" armPose="up" face="smile" />
      <rect x="140" y="70" width="24" height="18" rx="2" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <line x1="144" y1="76" x2="160" y2="76" stroke={INK} strokeWidth="1.5" />
      <line x1="144" y1="82" x2="160" y2="82" stroke={INK} strokeWidth="1.5" />
    </Frame>
  ),
  "job-nurse": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffffff" armPose="down" face="happy" />
      <rect x="92" y="94" width="16" height="16" fill="#f45c5c" />
      <rect x="86" y="100" width="28" height="4" fill="#f45c5c" />
      <rect x="98" y="88" width="4" height="28" fill="#f45c5c" />
    </Frame>
  ),
  "job-police": (id) => (
    <Frame id={id}>
      <Chibi shirt="#1f3b73" armPose="down" face="smile" />
      <circle cx="100" cy="52" r="14" fill="#f6d34c" stroke={INK} strokeWidth="2.5" />
      <path d="M 86 52 Q 100 44 114 52" stroke={INK} strokeWidth="2" fill="none" />
    </Frame>
  ),
  "job-chef": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffffff" armPose="up" face="happy" />
      <path d="M 76 48 Q 76 30 100 30 Q 124 30 124 48 Q 124 40 100 40 Q 76 40 76 48 Z" fill="#ffffff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="80" y="46" width="40" height="10" fill="#ffffff" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "job-farmer": (id) => (
    <Frame id={id}>
      <Chibi shirt="#a2704c" armPose="down" face="smile" />
      <ellipse cx="100" cy="48" rx="30" ry="8" fill="#f3c988" stroke={INK} strokeWidth="2.5" />
      <path d="M 84 48 Q 100 32 116 48 Z" fill="#f3c988" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "job-driver": (id) => (
    <Frame id={id}>
      <Chibi shirt="#4c8df0" armPose="down" face="smile" />
      <circle cx="100" cy="128" r="18" fill="none" stroke="#3a3a3a" strokeWidth="5" />
      <line x1="100" y1="110" x2="100" y2="146" stroke="#3a3a3a" strokeWidth="3" />
    </Frame>
  ),
  "job-artist": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ff9ec7" armPose="wave" face="happy" />
      <ellipse cx="150" cy="120" rx="16" ry="11" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <circle cx="144" cy="116" r="2.5" fill="#f45c5c" />
      <circle cx="150" cy="118" r="2.5" fill="#7bcf9e" />
      <circle cx="156" cy="122" r="2.5" fill="#4c8df0" />
    </Frame>
  ),
  "job-musician": (id) => (
    <Frame id={id}>
      <Chibi shirt="#7bcf9e" armPose="up" face="happy" />
      <path d="M 150 60 L 150 96 Q 156 92 160 96 Q 160 104 150 104 Q 142 104 142 96 Q 142 90 150 92 Z" fill={INK} />
    </Frame>
  ),
  "job-writer": (id) => (
    <Frame id={id}>
      <Chibi shirt="#f6d34c" armPose="down" face="smile" />
      <line x1="138" y1="130" x2="164" y2="104" stroke="#5a4a52" strokeWidth="5" strokeLinecap="round" />
      <path d="M 160 108 L 168 100 L 164 96 L 156 104 Z" fill="#ffd166" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
    </Frame>
  ),
  "job-student": (id) => (
    <Frame id={id}>
      <Chibi shirt="#8fcfff" armPose="down" face="happy" />
      <rect x="118" y="100" width="26" height="34" rx="5" fill="#f45c5c" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "job-waiter": (id) => (
    <Frame id={id}>
      <Chibi shirt="#3a3a3a" armPose="up" face="smile" />
      <ellipse cx="150" cy="86" rx="16" ry="5" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <circle cx="150" cy="80" r="6" fill="#f45c5c" stroke={INK} strokeWidth="1.5" />
    </Frame>
  ),
  "job-cashier": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffd6e8" armPose="down" face="smile" />
      <rect x="128" y="110" width="34" height="24" rx="3" fill="#c7c7c7" stroke={INK} strokeWidth="2.5" />
      <rect x="134" y="100" width="22" height="12" fill="#a9a9a9" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "job-firefighter": (id) => (
    <Frame id={id}>
      <Chibi shirt="#f45c5c" armPose="down" face="smile" />
      <path d="M 100 30 Q 130 34 128 56 L 72 56 Q 70 34 100 30 Z" fill="#f45c5c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="86" y="52" width="28" height="8" fill="#f6d34c" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "job-engineer": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffb347" armPose="down" face="smile" />
      <path d="M 100 32 Q 132 34 130 54 L 70 54 Q 68 34 100 32 Z" fill="#f6d34c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "job-lawyer": (id) => (
    <Frame id={id}>
      <Chibi shirt="#3a3a3a" armPose="down" face="smile" />
      <rect x="128" y="112" width="30" height="22" rx="3" fill="#a2704c" stroke={INK} strokeWidth="2.5" />
      <rect x="140" y="108" width="6" height="8" fill="#a2704c" stroke={INK} strokeWidth="1.5" />
    </Frame>
  ),
  "job-manager": (id) => (
    <Frame id={id}>
      <Chibi shirt="#dff1ff" armPose="down" face="smile" />
      <path d="M 96 106 L 104 106 L 108 124 L 100 136 L 92 124 Z" fill="#4c8df0" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </Frame>
  ),
  "job-pilot": (id) => (
    <Frame id={id}>
      <Chibi shirt="#1f3b73" armPose="up" face="smile" />
      <ellipse cx="100" cy="50" rx="20" ry="10" fill="#1f3b73" stroke={INK} strokeWidth="2.5" />
      <rect x="86" y="44" width="28" height="6" fill="#f6d34c" />
    </Frame>
  ),
  "job-scientist": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffffff" armPose="down" face="smile" />
      <path d="M 142 90 L 142 112 L 132 132 Q 130 138 138 138 L 158 138 Q 166 138 164 132 L 154 112 L 154 90 Z" fill="#c9eaff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "job-dentist": (id) => (
    <Frame id={id}>
      <Chibi shirt="#dff1ff" armPose="down" face="smile" />
      <path
        d="M 148 92 Q 160 90 161 104 Q 162 116 156 126 Q 153 132 150 126 Q 148 122 146 122 Q 144 122 142 126 Q 138 132 136 126 Q 130 116 131 104 Q 132 90 148 92 Z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Frame>
  ),
  "job-accountant": (id) => (
    <Frame id={id}>
      <Chibi shirt="#7bcf9e" armPose="down" face="smile" />
      <rect x="128" y="100" width="30" height="36" rx="3" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <line x1="134" y1="110" x2="152" y2="110" stroke={INK} strokeWidth="1.5" />
      <line x1="134" y1="118" x2="152" y2="118" stroke={INK} strokeWidth="1.5" />
      <line x1="134" y1="126" x2="146" y2="126" stroke={INK} strokeWidth="1.5" />
    </Frame>
  ),
};
