import { Frame, Chibi, INK } from "./shared";

export const familyIcons = {
  "family-mother": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ff9ec7" armPose="down" face="happy" />
      <path d="M 66 70 Q 60 110 70 140" stroke="#6b4a57" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M 134 70 Q 140 110 130 140" stroke="#6b4a57" strokeWidth="10" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "family-father": (id) => (
    <Frame id={id}>
      <Chibi shirt="#4c8df0" armPose="down" face="smile" />
      <rect x="82" y="76" width="16" height="10" rx="4" fill="none" stroke={INK} strokeWidth="2.5" />
      <rect x="102" y="76" width="16" height="10" rx="4" fill="none" stroke={INK} strokeWidth="2.5" />
      <line x1="98" y1="81" x2="102" y2="81" stroke={INK} strokeWidth="2.5" />
      <path d="M 90 90 Q 100 94 110 90" stroke="#5a4a52" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "family-sister": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffd6e8" armPose="wave" face="wink" />
      <path d="M 100 44 L 92 36 L 100 30 L 108 36 Z" fill="#ff9ec7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </Frame>
  ),
  "family-brother": (id) => (
    <Frame id={id}>
      <Chibi shirt="#7bcf9e" armPose="up" face="happy" />
    </Frame>
  ),
  "family-grandmother": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffe9d6" armPose="down" face="happy" />
      <path
        d="M 68 68 Q 72 40 100 40 Q 128 40 132 68 Q 118 58 100 58 Q 82 58 68 68 Z"
        fill="#e8e2e5"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="42" r="10" fill="#e8e2e5" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "family-grandfather": (id) => (
    <Frame id={id}>
      <Chibi shirt="#cdeaff" armPose="down" face="smile" />
      <path
        d="M 68 68 Q 72 40 100 40 Q 128 40 132 68 Q 118 58 100 58 Q 82 58 68 68 Z"
        fill="#d9d3d6"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="82" y="76" width="16" height="10" rx="4" fill="none" stroke={INK} strokeWidth="2.5" />
      <rect x="102" y="76" width="16" height="10" rx="4" fill="none" stroke={INK} strokeWidth="2.5" />
      <line x1="98" y1="81" x2="102" y2="81" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
};
