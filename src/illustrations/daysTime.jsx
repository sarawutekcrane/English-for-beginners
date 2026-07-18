import { Frame, INK, Sun } from "./shared";

function CalendarPage({ label, accent = "#ff9ec7" }) {
  return (
    <g>
      <rect x="54" y="58" width="92" height="92" rx="10" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <rect x="54" y="58" width="92" height="26" rx="10" fill={accent} stroke={INK} strokeWidth="3" />
      <line x1="74" y1="50" x2="74" y2="66" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1="126" y1="50" x2="126" y2="66" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <text x="100" y="122" fontSize="34" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="'Baloo 2', sans-serif">
        {label}
      </text>
    </g>
  );
}

function Clock({ hourAngle, minuteAngle }) {
  return (
    <g>
      <circle cx="100" cy="104" r="42" fill="#ffffff" stroke={INK} strokeWidth="3.5" />
      <line
        x1="100"
        y1="104"
        x2={100 + 20 * Math.sin((hourAngle * Math.PI) / 180)}
        y2={104 - 20 * Math.cos((hourAngle * Math.PI) / 180)}
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="104"
        x2={100 + 30 * Math.sin((minuteAngle * Math.PI) / 180)}
        y2={104 - 30 * Math.cos((minuteAngle * Math.PI) / 180)}
        stroke="#ff9ec7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="100" cy="104" r="3" fill={INK} />
    </g>
  );
}

export const daysTimeIcons = {
  "dayTime-monday": (id) => <Frame id={id}>{CalendarPage({ label: "M", accent: "#ff9ec7" })}</Frame>,
  "dayTime-tuesday": (id) => <Frame id={id}>{CalendarPage({ label: "T", accent: "#8fcfff" })}</Frame>,
  "dayTime-wednesday": (id) => <Frame id={id}>{CalendarPage({ label: "W", accent: "#7bcf9e" })}</Frame>,
  "dayTime-thursday": (id) => <Frame id={id}>{CalendarPage({ label: "T", accent: "#f6d34c" })}</Frame>,
  "dayTime-friday": (id) => <Frame id={id}>{CalendarPage({ label: "F", accent: "#c9a0f5" })}</Frame>,
  "dayTime-saturday": (id) => <Frame id={id}>{CalendarPage({ label: "S", accent: "#ffb347" })}</Frame>,
  "dayTime-sunday": (id) => <Frame id={id}>{CalendarPage({ label: "S", accent: "#f45c5c" })}</Frame>,
  "dayTime-today": (id) => (
    <Frame id={id}>
      {CalendarPage({ label: "★", accent: "#ffd166" })}
    </Frame>
  ),
  "dayTime-tomorrow": (id) => (
    <Frame id={id}>
      {CalendarPage({ label: "→", accent: "#7bcf9e" })}
    </Frame>
  ),
  "dayTime-yesterday": (id) => (
    <Frame id={id}>
      {CalendarPage({ label: "←", accent: "#a9a9a9" })}
    </Frame>
  ),
  "dayTime-morning": (id) => (
    <Frame id={id}>
      <rect x="0" y="130" width="200" height="70" fill="#ffe3c2" />
      <Sun cx={100} cy={128} r={28} color="#ffb347" />
    </Frame>
  ),
  "dayTime-afternoon": (id) => (
    <Frame id={id}>
      <Sun cx={100} cy={90} r={32} color="#ffd166" />
    </Frame>
  ),
  "dayTime-evening": (id) => (
    <Frame id={id}>
      <rect x="0" y="130" width="200" height="70" fill="#e7d3ff" />
      <circle cx="100" cy="140" r="28" fill="#ff9ec7" stroke={INK} strokeWidth="3" />
    </Frame>
  ),
  "dayTime-night": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="104" r="86" fill="#2f2b52" opacity="0.15" />
      <path
        d="M 118 56 A 32 32 0 1 0 120 120 A 42 42 0 1 1 118 56 Z"
        fill="#ffe9a6"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Frame>
  ),
  "dayTime-week": (id) => (
    <Frame id={id}>
      <rect x="44" y="58" width="112" height="92" rx="10" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <rect x="44" y="58" width="112" height="26" rx="10" fill="#8fcfff" stroke={INK} strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={52 + i * 15} y={96} width="10" height="10" rx="2" fill={i < 5 ? "#ff9ec7" : "#e6e6e6"} stroke={INK} strokeWidth="1.5" />
      ))}
    </Frame>
  ),
  "dayTime-month": (id) => (
    <Frame id={id}>
      <rect x="54" y="58" width="92" height="92" rx="10" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <rect x="54" y="58" width="92" height="26" rx="10" fill="#c9a0f5" stroke={INK} strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <circle key={i} cx={70 + (i % 3) * 24} cy={100 + Math.floor(i / 3) * 18} r="5" fill="#ffd6e8" stroke={INK} strokeWidth="1.5" />
      ))}
    </Frame>
  ),
  "dayTime-year": (id) => (
    <Frame id={id}>
      <rect x="50" y="60" width="100" height="88" rx="10" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <rect x="50" y="60" width="100" height="26" rx="10" fill="#f6d34c" stroke={INK} strokeWidth="3" />
      <text x="100" y="122" fontSize="26" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="'Baloo 2', sans-serif">
        365
      </text>
    </Frame>
  ),
  "dayTime-hour": (id) => <Frame id={id}>{Clock({ hourAngle: 90, minuteAngle: 0 })}</Frame>,
  "dayTime-minute": (id) => <Frame id={id}>{Clock({ hourAngle: 30, minuteAngle: 180 })}</Frame>,
  "dayTime-weekend": (id) => (
    <Frame id={id}>
      <rect x="44" y="58" width="112" height="92" rx="10" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <rect x="44" y="58" width="112" height="26" rx="10" fill="#f45c5c" stroke={INK} strokeWidth="3" />
      <rect x="70" y="98" width="24" height="24" rx="4" fill="#ffd6e8" stroke={INK} strokeWidth="2" />
      <rect x="106" y="98" width="24" height="24" rx="4" fill="#ffd6e8" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
};
