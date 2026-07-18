import { Frame, INK, Chibi } from "./shared";

export const bodyHealthIcons = {
  "body-head": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="104" r="42" fill="#ffe9d6" stroke={INK} strokeWidth="3.5" />
      <circle cx="88" cy="98" r="4" fill={INK} />
      <circle cx="112" cy="98" r="4" fill={INK} />
      <path d="M 88 116 Q 100 122 112 116" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "body-eye": (id) => (
    <Frame id={id}>
      <path d="M 50 104 Q 100 66 150 104 Q 100 142 50 104 Z" fill="#ffffff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="100" cy="104" r="20" fill="#8fcfff" stroke={INK} strokeWidth="2.5" />
      <circle cx="100" cy="104" r="9" fill={INK} />
      <circle cx="94" cy="98" r="3" fill="#ffffff" />
    </Frame>
  ),
  "body-ear": (id) => (
    <Frame id={id}>
      <path d="M 100 60 Q 140 60 140 100 Q 140 140 108 140 Q 96 140 96 124 Q 108 124 108 108 Q 96 108 96 92 Q 96 60 100 60 Z" fill="#ffe9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "body-nose": (id) => (
    <Frame id={id}>
      <path d="M 92 66 Q 78 116 88 130 Q 100 140 112 130 Q 122 116 108 66 Z" fill="#ffe9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="92" cy="126" r="3" fill={INK} />
      <circle cx="108" cy="126" r="3" fill={INK} />
    </Frame>
  ),
  "body-mouth": (id) => (
    <Frame id={id}>
      <path d="M 56 100 Q 100 130 144 100 Q 100 118 56 100 Z" fill="#e0876b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 60 100 Q 100 112 140 100" fill="none" stroke="#ffffff" strokeWidth="4" />
    </Frame>
  ),
  "body-hand": (id) => (
    <Frame id={id}>
      <path
        d="M 70 140 L 68 96 Q 68 88 76 88 Q 84 88 84 96 L 84 116 L 88 116 L 88 80 Q 88 72 96 72 Q 104 72 104 80 L 104 116 L 108 116 L 108 76 Q 108 68 116 68 Q 124 68 124 76 L 124 116 L 128 116 L 128 86 Q 128 78 136 78 Q 144 78 144 86 L 144 124 Q 144 156 104 156 Q 70 156 70 140 Z"
        fill="#ffe9d6"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </Frame>
  ),
  "body-arm": (id) => (
    <Frame id={id}>
      <path d="M 70 60 Q 60 100 90 130 L 120 160 L 140 142 L 116 116 Q 96 92 106 62 Z" fill="#ffe9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "body-leg": (id) => (
    <Frame id={id}>
      <path d="M 86 56 L 114 56 L 118 130 L 132 158 L 108 158 L 100 130 L 92 158 L 68 158 L 82 130 Z" fill="#ffe9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "body-foot": (id) => (
    <Frame id={id}>
      <path d="M 66 138 Q 62 100 80 90 Q 96 82 100 100 L 138 118 Q 150 124 146 136 Q 142 148 122 148 L 66 148 Z" fill="#ffe9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  ),
  "body-stomach": (id) => (
    <Frame id={id}>
      <ellipse cx="100" cy="108" rx="42" ry="36" fill="#ffe9d6" stroke={INK} strokeWidth="3.5" />
      <path d="M 100 84 L 100 132" stroke="#e0a15c" strokeWidth="2" opacity="0.5" />
    </Frame>
  ),
  "body-back": (id) => (
    <Frame id={id}>
      <path d="M 70 60 Q 100 50 130 60 L 140 150 L 60 150 Z" fill="#ffe9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 100 66 L 96 140 M 100 66 L 104 140" stroke="#e0a15c" strokeWidth="2" opacity="0.4" />
    </Frame>
  ),
  "body-heart": (id) => (
    <Frame id={id}>
      <path
        d="M 100 130 C 60 100 50 68 78 54 C 94 46 100 62 100 62 C 100 62 106 46 122 54 C 150 68 140 100 100 130 Z"
        fill="#f45c5c"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Frame>
  ),
  "body-tooth": (id) => (
    <Frame id={id}>
      <path
        d="M 100 60 Q 130 58 132 90 Q 134 116 122 140 Q 116 152 108 138 Q 104 128 100 128 Q 96 128 92 138 Q 84 152 78 140 Q 66 116 68 90 Q 70 58 100 60 Z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Frame>
  ),
  "body-hair": (id) => (
    <Frame id={id}>
      <path
        d="M 56 120 Q 50 60 100 52 Q 150 60 144 120 Q 130 96 100 96 Q 70 96 56 120 Z"
        fill="#6b4a57"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Frame>
  ),
  "body-finger": (id) => (
    <Frame id={id}>
      <path d="M 88 60 Q 88 52 96 52 Q 104 52 104 60 L 104 140 Q 104 152 96 152 Q 88 152 88 140 Z" fill="#ffe9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="96" cy="150" rx="10" ry="6" fill="#ffcfc0" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "body-doctor": (id) => (
    <Frame id={id}>
      <Chibi shirt="#dff1ff" armPose="down" face="smile" />
      <path d="M 78 90 Q 78 70 100 70 Q 122 70 122 90" stroke="#8fcfff" strokeWidth="4" fill="none" />
      <circle cx="100" cy="96" r="6" fill="#8fcfff" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "body-hospital": (id) => (
    <Frame id={id}>
      <rect x="60" y="80" width="80" height="70" fill="#ffffff" stroke={INK} strokeWidth="3.5" />
      <rect x="92" y="96" width="16" height="38" fill="#f45c5c" />
      <rect x="81" y="107" width="38" height="16" fill="#f45c5c" />
    </Frame>
  ),
  "body-medicine": (id) => (
    <Frame id={id}>
      <path d="M 84 70 L 116 70 L 116 130 Q 116 150 100 150 Q 84 150 84 130 Z" fill="#ffffff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="84" y="100" width="32" height="30" fill="#f45c5c" />
    </Frame>
  ),
  "body-sick": (id) => (
    <Frame id={id}>
      <Chibi shirt="#c9ccd6" armPose="down" face="sad" />
      <path d="M 132 52 Q 140 64 132 72 Q 124 64 132 52 Z" fill="#bfe6ff" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "body-healthy": (id) => (
    <Frame id={id}>
      <Chibi shirt="#7bcf9e" armPose="up" face="happy" />
      <path d="M 148 56 L 158 68 L 178 42" fill="none" stroke="#4fae78" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),
};
