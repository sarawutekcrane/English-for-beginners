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
};

export function GreetingIllustration({ icon, id }) {
  const render = greetingIcons[icon] || greetingIcons["hello-wave"];
  return render(id || icon);
}
