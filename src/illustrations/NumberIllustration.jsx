import { Frame, INK } from "./shared";

const PALETTE = ["#ff9ec7", "#8fcfff", "#ffd166", "#7bcf9e", "#c9a0f5"];

function DotGrid({ value }) {
  const dots = [];
  const cols = 5;
  const count = Math.min(value, 10);
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    dots.push(
      <circle
        key={i}
        cx={48 + col * 26}
        cy={148 + row * 20}
        r="6"
        fill={PALETTE[row % PALETTE.length]}
        stroke={INK}
        strokeWidth="1.5"
      />
    );
  }
  return <g opacity="0.9">{dots}</g>;
}

/** Generic illustration for the numbers category, parameterized by numeric value -- no per-entry hand art needed. */
export default function NumberIllustration({ value, id }) {
  const color = PALETTE[(value - 1) % PALETTE.length];
  return (
    <Frame id={id || `n${value}`}>
      <circle cx="100" cy="86" r="46" fill="#ffffff" stroke={INK} strokeWidth="4" />
      <text x="100" y="104" fontSize="56" fontWeight="800" textAnchor="middle" fill={color} fontFamily="'Baloo 2', sans-serif">
        {value}
      </text>
      <DotGrid value={value} />
    </Frame>
  );
}
