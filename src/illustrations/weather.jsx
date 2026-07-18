import { Frame, INK, Sun, Sparkle } from "./shared";

function Cloud({ x = 100, y = 100, fill = "#dfe6f0", scale = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx="-24" cy="6" rx="22" ry="16" fill={fill} stroke={INK} strokeWidth="3" />
      <ellipse cx="10" cy="-4" rx="28" ry="20" fill={fill} stroke={INK} strokeWidth="3" />
      <ellipse cx="34" cy="8" rx="18" ry="14" fill={fill} stroke={INK} strokeWidth="3" />
      <rect x="-40" y="6" width="94" height="18" rx="9" fill={fill} stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Raindrop({ x, y }) {
  return <path d={`M ${x} ${y} Q ${x - 4} ${y + 12} ${x} ${y + 18} Q ${x + 4} ${y + 12} ${x} ${y} Z`} fill="#4c8df0" />;
}

function Snowflake({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
      <line x1="-8" y1="0" x2="8" y2="0" />
      <line x1="0" y1="-8" x2="0" y2="8" />
      <line x1="-6" y1="-6" x2="6" y2="6" />
      <line x1="-6" y1="6" x2="6" y2="-6" />
    </g>
  );
}

function Bolt({ x = 100, y = 100 }) {
  return <path d={`M ${x} ${y - 20} L ${x - 10} ${y + 4} L ${x} ${y + 4} L ${x - 6} ${y + 24} L ${x + 14} ${y - 4} L ${x + 2} ${y - 4} Z`} fill="#f6d34c" stroke={INK} strokeWidth="2" strokeLinejoin="round" />;
}

export const weatherIcons = {
  "weather-sunny": (id) => (
    <Frame id={id}>
      <Sun cx={100} cy={100} r={34} />
    </Frame>
  ),
  "weather-rainy": (id) => (
    <Frame id={id}>
      <Cloud y={80} />
      <Raindrop x={78} y={126} />
      <Raindrop x={100} y={134} />
      <Raindrop x={122} y={126} />
    </Frame>
  ),
  "weather-cloudy": (id) => (
    <Frame id={id}>
      <Cloud y={90} scale={1.1} />
      <Cloud x={70} y={60} fill="#eef2f8" scale={0.6} />
    </Frame>
  ),
  "weather-windy": (id) => (
    <Frame id={id}>
      <Cloud x={110} y={70} scale={0.75} />
      <path d="M 40 110 Q 90 100 130 110" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M 50 130 Q 100 120 150 130" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M 45 150 Q 85 142 115 150" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
    </Frame>
  ),
  "weather-snowy": (id) => (
    <Frame id={id}>
      <Cloud y={70} fill="#c9d6e8" />
      <Snowflake x={76} y={132} />
      <Snowflake x={100} y={144} s={1.2} />
      <Snowflake x={124} y={132} />
    </Frame>
  ),
  "weather-hot": (id) => (
    <Frame id={id}>
      <Sun cx={100} cy={104} r={30} color="#ff8a5c" />
      <path d="M 60 156 Q 66 140 60 128" stroke="#ff8a5c" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M 140 156 Q 134 140 140 128" stroke="#ff8a5c" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
    </Frame>
  ),
  "weather-cold": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="104" r="40" fill="#dff1ff" stroke={INK} strokeWidth="3" />
      <Snowflake x={100} y={104} s={2.2} />
    </Frame>
  ),
  "weather-warm": (id) => (
    <Frame id={id}>
      <Sun cx={100} cy={104} r={28} color="#ffd166" />
    </Frame>
  ),
  "weather-cool": (id) => (
    <Frame id={id}>
      <Cloud y={100} fill="#eaf3ff" />
      <path d="M 70 140 Q 100 130 130 140" stroke="#8fcfff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
    </Frame>
  ),
  "weather-foggy": (id) => (
    <Frame id={id}>
      <line x1="50" y1="80" x2="150" y2="80" stroke="#c7c7c7" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
      <line x1="40" y1="104" x2="160" y2="104" stroke="#c7c7c7" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      <line x1="55" y1="128" x2="145" y2="128" stroke="#c7c7c7" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
    </Frame>
  ),
  "weather-stormy": (id) => (
    <Frame id={id}>
      <Cloud y={72} fill="#8a8fa3" />
      <Bolt x={100} y={122} />
    </Frame>
  ),
  "weather-humid": (id) => (
    <Frame id={id}>
      <path
        d="M 100 60 C 78 92 66 112 66 130 C 66 152 82 166 100 166 C 118 166 134 152 134 130 C 134 112 122 92 100 60 Z"
        fill="#8fcfff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="86" cy="120" rx="8" ry="12" fill="#ffffff" opacity="0.5" />
    </Frame>
  ),
  "weather-thunder": (id) => (
    <Frame id={id}>
      <Cloud y={68} fill="#8a8fa3" />
      <Bolt x={100} y={120} />
    </Frame>
  ),
  "weather-lightning": (id) => (
    <Frame id={id}>
      <Bolt x={100} y={104} />
      <Sparkle x="60" y="60" s="0.7" />
      <Sparkle x="140" y="150" s="0.6" />
    </Frame>
  ),
  "weather-rainbow": (id) => (
    <Frame id={id}>
      <path d="M 40 150 A 60 60 0 0 1 160 150" fill="none" stroke="#f45c5c" strokeWidth="8" />
      <path d="M 50 150 A 50 50 0 0 1 150 150" fill="none" stroke="#ffd166" strokeWidth="8" />
      <path d="M 60 150 A 40 40 0 0 1 140 150" fill="none" stroke="#7bcf9e" strokeWidth="8" />
      <path d="M 70 150 A 30 30 0 0 1 130 150" fill="none" stroke="#4c8df0" strokeWidth="8" />
    </Frame>
  ),
  "weather-umbrella": (id) => (
    <Frame id={id}>
      <path d="M 54 100 Q 100 54 146 100 Z" fill="#ff9ec7" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="100" y1="100" x2="100" y2="160" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M 100 160 Q 110 168 100 172" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "weather-spring": (id) => (
    <Frame id={id}>
      <Sun cx={140} cy={54} r={16} />
      <path d="M 100 150 L 100 100" stroke="#5fbf77" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="90" r="16" fill="#ffd6e8" stroke={INK} strokeWidth="2.5" />
      <circle cx="84" cy="102" r="12" fill="#ff9ec7" stroke={INK} strokeWidth="2" />
      <circle cx="116" cy="102" r="12" fill="#ff9ec7" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "weather-summer": (id) => (
    <Frame id={id}>
      <Sun cx={100} cy={90} r={32} color="#ffb347" />
      <path d="M 70 150 Q 100 138 130 150" stroke="#f6d34c" strokeWidth="6" fill="none" strokeLinecap="round" />
    </Frame>
  ),
  "weather-autumn": (id) => (
    <Frame id={id}>
      <path
        d="M 100 60 C 130 70 140 100 120 128 C 130 130 136 140 130 150 C 112 146 100 130 100 130 C 100 130 88 146 70 150 C 64 140 70 130 80 128 C 60 100 70 70 100 60 Z"
        fill="#e0876b"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line x1="100" y1="60" x2="100" y2="130" stroke={INK} strokeWidth="2" opacity="0.5" />
    </Frame>
  ),
  "weather-winter": (id) => (
    <Frame id={id}>
      <Cloud y={70} fill="#dfe6f0" />
      <Snowflake x={100} y={130} s={1.6} />
    </Frame>
  ),
};
