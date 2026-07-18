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
  "family-son": (id) => (
    <Frame id={id}>
      <g transform="translate(18,18) scale(0.8)">
        <Chibi shirt="#8fcfff" armPose="up" face="happy" />
      </g>
    </Frame>
  ),
  "family-daughter": (id) => (
    <Frame id={id}>
      <g transform="translate(18,18) scale(0.8)">
        <Chibi shirt="#ffd6e8" armPose="wave" face="wink" />
      </g>
    </Frame>
  ),
  "family-husband": (id) => (
    <Frame id={id}>
      <Chibi shirt="#4c8df0" armPose="down" face="smile" />
      <path d="M 96 106 L 104 106 L 108 124 L 100 136 L 92 124 Z" fill="#5a4a52" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </Frame>
  ),
  "family-wife": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ff9ec7" armPose="down" face="happy" />
      <circle cx="88" cy="128" r="3" fill="#f6d34c" />
    </Frame>
  ),
  "family-aunt": (id) => (
    <Frame id={id}>
      <Chibi shirt="#b07ae0" armPose="wave" face="smile" />
      <circle cx="70" cy="92" r="3" fill="#f6d34c" />
      <circle cx="130" cy="92" r="3" fill="#f6d34c" />
    </Frame>
  ),
  "family-uncle": (id) => (
    <Frame id={id}>
      <Chibi shirt="#5fbf77" armPose="down" face="smile" />
      <path d="M 88 90 Q 100 96 112 90" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "family-cousin": (id) => (
    <Frame id={id}>
      <g transform="translate(24,24) scale(0.75)">
        <Chibi shirt="#f6d34c" armPose="wave" face="happy" />
      </g>
    </Frame>
  ),
  "family-niece": (id) => (
    <Frame id={id}>
      <g transform="translate(30,31) scale(0.7)">
        <Chibi shirt="#ffb6cf" armPose="wave" face="wink" />
      </g>
    </Frame>
  ),
  "family-nephew": (id) => (
    <Frame id={id}>
      <g transform="translate(30,31) scale(0.7)">
        <Chibi shirt="#a0d8f5" armPose="up" face="happy" />
      </g>
    </Frame>
  ),
  "family-baby": (id) => (
    <Frame id={id}>
      <ellipse cx="100" cy="140" rx="30" ry="22" fill="#fff3da" stroke={INK} strokeWidth="3" />
      <circle cx="100" cy="100" r="32" fill="#ffe9d6" stroke={INK} strokeWidth="3.5" />
      <path d="M 80 84 Q 100 74 120 84" stroke="#6b4a57" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="90" cy="100" r="3.5" fill={INK} />
      <circle cx="110" cy="100" r="3.5" fill={INK} />
      <path d="M 92 112 Q 100 118 108 112" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "family-parents": (id) => (
    <Frame id={id}>
      <g transform="translate(-6,26) scale(0.62)">
        <Chibi shirt="#4c8df0" armPose="down" face="smile" />
      </g>
      <g transform="translate(64,26) scale(0.62)">
        <Chibi shirt="#ff9ec7" armPose="down" face="happy" />
      </g>
    </Frame>
  ),
  "family-children": (id) => (
    <Frame id={id}>
      <g transform="translate(-2,30) scale(0.58)">
        <Chibi shirt="#8fcfff" armPose="up" face="happy" />
      </g>
      <g transform="translate(66,30) scale(0.58)">
        <Chibi shirt="#ffd6e8" armPose="wave" face="wink" />
      </g>
    </Frame>
  ),
  "family-grandparents": (id) => (
    <Frame id={id}>
      <g transform="translate(-6,26) scale(0.55)">
        <Chibi shirt="#cdeaff" armPose="down" face="smile" />
        <path
          d="M 68 68 Q 72 40 100 40 Q 128 40 132 68 Q 118 58 100 58 Q 82 58 68 68 Z"
          fill="#d9d3d6"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
      <g transform="translate(74,26) scale(0.55)">
        <Chibi shirt="#ffe9d6" armPose="down" face="happy" />
        <path
          d="M 68 68 Q 72 40 100 40 Q 128 40 132 68 Q 118 58 100 58 Q 82 58 68 68 Z"
          fill="#e8e2e5"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
    </Frame>
  ),
  "family-grandchild": (id) => (
    <Frame id={id}>
      <g transform="translate(30,31) scale(0.7)">
        <Chibi shirt="#7bcf9e" armPose="up" face="wink" />
      </g>
    </Frame>
  ),
};
