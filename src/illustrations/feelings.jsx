import { Frame, INK, Chibi, Sparkle } from "./shared";

function SweatDrop({ x = 132, y = 52 }) {
  return <path d={`M ${x} ${y} Q ${x + 8} ${y + 12} ${x} ${y + 20} Q ${x - 8} ${y + 12} ${x} ${y} Z`} fill="#bfe6ff" stroke={INK} strokeWidth="2.5" />;
}

function QuestionMark({ x = 150, y = 60 }) {
  return (
    <text x={x} y={y} fontSize="46" fontWeight="800" fill="#ff9ec7" fontFamily="'Baloo 2', sans-serif">
      ?
    </text>
  );
}

export const feelingsIcons = {
  "feeling-happy": (id) => (
    <Frame id={id}>
      <Sparkle x="150" y="50" />
      <Chibi shirt="#7bcf9e" armPose="up" face="happy" />
    </Frame>
  ),
  "feeling-sad": (id) => (
    <Frame id={id}>
      <Chibi shirt="#8fcfff" armPose="down" face="sad" />
    </Frame>
  ),
  "feeling-angry": (id) => (
    <Frame id={id}>
      <Chibi shirt="#f45c5c" armPose="up" face="surprised" />
      <path d="M 80 60 L 92 68 M 120 60 L 108 68" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </Frame>
  ),
  "feeling-excited": (id) => (
    <Frame id={id}>
      <Sparkle x="150" y="52" />
      <Sparkle x="50" y="64" s="0.7" />
      <Chibi shirt="#ffd166" armPose="up" face="surprised" />
    </Frame>
  ),
  "feeling-nervous": (id) => (
    <Frame id={id}>
      <Chibi shirt="#cdeaff" armPose="down" face="sad" />
      <SweatDrop />
    </Frame>
  ),
  "feeling-tired": (id) => (
    <Frame id={id}>
      <Chibi shirt="#c9ccd6" armPose="down" face="sad" />
      <text x="140" y="60" fontSize="20" fontWeight="800" fill="#8a7a82" fontFamily="'Baloo 2', sans-serif">z</text>
      <text x="152" y="46" fontSize="14" fontWeight="800" fill="#8a7a82" fontFamily="'Baloo 2', sans-serif">z</text>
    </Frame>
  ),
  "feeling-bored": (id) => (
    <Frame id={id}>
      <Chibi shirt="#e6e6e6" armPose="down" face="dot" />
    </Frame>
  ),
  "feeling-surprised": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffd6e8" armPose="up" face="surprised" />
    </Frame>
  ),
  "feeling-scared": (id) => (
    <Frame id={id}>
      <Chibi shirt="#8fcfff" armPose="down" face="surprised" />
      <SweatDrop x={128} y={50} />
    </Frame>
  ),
  "feeling-relaxed": (id) => (
    <Frame id={id}>
      <Chibi shirt="#a8e063" armPose="down" face="smile" />
    </Frame>
  ),
  "feeling-confused": (id) => (
    <Frame id={id}>
      <QuestionMark />
      <Chibi shirt="#ffd166" armPose="down" face="surprised" />
    </Frame>
  ),
  "feeling-proud": (id) => (
    <Frame id={id}>
      <Sparkle x="148" y="54" s="0.9" />
      <Chibi shirt="#f6d34c" armPose="up" face="happy" />
    </Frame>
  ),
  "feeling-embarrassed": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffd6e8" armPose="down" face="sad" />
      <SweatDrop x={130} y={54} />
    </Frame>
  ),
  "feeling-worried": (id) => (
    <Frame id={id}>
      <Chibi shirt="#cdeaff" armPose="down" face="sad" />
      <SweatDrop x={134} y={48} />
    </Frame>
  ),
  "feeling-confident": (id) => (
    <Frame id={id}>
      <Sparkle x="150" y="48" s="0.8" />
      <Chibi shirt="#4c8df0" armPose="up" face="happy" />
    </Frame>
  ),
  "feeling-jealous": (id) => (
    <Frame id={id}>
      <Chibi shirt="#7bcf9e" armPose="down" face="sad" />
    </Frame>
  ),
  "feeling-lonely": (id) => (
    <Frame id={id}>
      <g transform="translate(30,30) scale(0.7)">
        <Chibi shirt="#a9a9a9" armPose="down" face="sad" />
      </g>
    </Frame>
  ),
  "feeling-grateful": (id) => (
    <Frame id={id}>
      <Sparkle x="146" y="48" s="0.9" />
      <Chibi shirt="#ffd6e8" armPose="praying" face="happy" />
    </Frame>
  ),
  "feeling-disappointed": (id) => (
    <Frame id={id}>
      <Chibi shirt="#c9ccd6" armPose="down" face="sad" />
    </Frame>
  ),
  "feeling-curious": (id) => (
    <Frame id={id}>
      <QuestionMark x={150} y={56} />
      <Chibi shirt="#c9a0f5" armPose="up" face="surprised" />
    </Frame>
  ),
};
