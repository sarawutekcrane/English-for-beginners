import { Frame, Chibi, Sun, INK, Sparkle } from "./shared";

export const greetingIcons = {
  "hello-wave": (id) => (
    <Frame id={id}>
      <Sun cx={156} cy={46} r={16} />
      <Chibi shirt="#ff9ec7" armPose="wave" face="smile" />
    </Frame>
  ),
  sunrise: (id) => (
    <Frame id={id}>
      <rect x="0" y="130" width="200" height="70" fill="#ffe3c2" />
      <Sun cx={100} cy={128} r={30} color="#ffb347" />
      <path d="M 20 130 Q 100 100 180 130" fill="none" stroke="#5a4a52" strokeWidth="3" opacity="0.3" />
    </Frame>
  ),
  sunset: (id) => (
    <Frame id={id}>
      <rect x="0" y="130" width="200" height="70" fill="#e7d3ff" />
      <circle cx="100" cy="140" r="30" fill="#ff9ec7" stroke="#5a4a52" strokeWidth="3" />
      <path d="M 20 140 Q 100 116 180 140" fill="none" stroke="#5a4a52" strokeWidth="3" opacity="0.25" />
    </Frame>
  ),
  "thanks-heart": (id) => (
    <Frame id={id}>
      <path
        d="M 100 44 C 90 30 66 34 66 54 C 66 72 100 92 100 92 C 100 92 134 72 134 54 C 134 34 110 30 100 44 Z"
        fill="#ff9ec7"
        stroke="#5a4a52"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Chibi shirt="#ffd166" armPose="bow" face="happy" />
    </Frame>
  ),
  "wave-goodbye": (id) => (
    <Frame id={id}>
      <Chibi shirt="#8fcfff" armPose="wave" face="smile" flip />
      <path d="M 30 60 Q 20 50 26 40" stroke={INK} strokeWidth="2.5" fill="none" opacity="0.35" />
    </Frame>
  ),
  "please-hands": (id) => (
    <Frame id={id}>
      <Sparkle x="146" y="48" s="0.9" />
      <Chibi shirt="#ffd6e8" armPose="praying" face="smile" />
    </Frame>
  ),
  "moon-sleep": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="104" r="86" fill="#2f2b52" opacity="0.12" />
      <path
        d="M 120 50 A 34 34 0 1 0 122 118 A 44 44 0 1 1 120 50 Z"
        fill="#ffe9a6"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text x="140" y="150" fontSize="22" fontWeight="800" fill="#8a7a82" fontFamily="'Baloo 2', sans-serif">
        z
      </text>
      <text x="155" y="132" fontSize="16" fontWeight="800" fill="#8a7a82" fontFamily="'Baloo 2', sans-serif">
        z
      </text>
    </Frame>
  ),
  "question-face": (id) => (
    <Frame id={id}>
      <text x="150" y="60" fontSize="46" fontWeight="800" fill="#ff9ec7" fontFamily="'Baloo 2', sans-serif">
        ?
      </text>
      <Chibi shirt="#ffd166" armPose="down" face="surprised" />
    </Frame>
  ),
  "happy-face": (id) => (
    <Frame id={id}>
      <Sparkle x="150" y="50" />
      <Sparkle x="52" y="60" s="0.7" />
      <Chibi shirt="#7bcf9e" armPose="up" face="happy" />
    </Frame>
  ),
  handshake: (id) => (
    <Frame id={id}>
      <ellipse cx="100" cy="128" rx="46" ry="14" fill="#ffe9d6" opacity="0.5" />
      <path d="M 60 108 Q 80 96 100 108 L 96 122 Q 80 128 66 120 Z" fill="#ffe9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 140 108 Q 120 96 100 108 L 104 122 Q 120 128 134 120 Z" fill="#ffd6b3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Sparkle x="100" y="70" s="1.1" />
    </Frame>
  ),
  "see-you-later": (id) => (
    <Frame id={id}>
      <Chibi shirt="#c9a0f5" armPose="wave" face="wink" flip />
    </Frame>
  ),
  "excuse-me-leave": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffd6e8" armPose="bow" face="smile" flip />
    </Frame>
  ),
  "sad-bow": (id) => (
    <Frame id={id}>
      <path d="M 128 50 Q 136 60 128 68" stroke="#8fcfff" strokeWidth="3" fill="none" opacity="0.6" />
      <Chibi shirt="#cdeaff" armPose="bow" face="sad" />
    </Frame>
  ),
  "sorry-sweat": (id) => (
    <Frame id={id}>
      <path d="M 132 52 Q 140 64 132 72 Q 124 64 132 52 Z" fill="#bfe6ff" stroke={INK} strokeWidth="2.5" />
      <Chibi shirt="#cdeaff" armPose="bow" face="sad" />
    </Frame>
  ),
  "youre-welcome": (id) => (
    <Frame id={id}>
      <Chibi shirt="#8fcfff" armPose="down" face="happy" />
      <path
        d="M 148 56 L 158 68 L 178 42"
        fill="none"
        stroke="#4fae78"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </Frame>
  ),
};

export function GreetingIllustration({ icon, id }) {
  const render = greetingIcons[icon] || greetingIcons["hello-wave"];
  return render(id || icon);
}
