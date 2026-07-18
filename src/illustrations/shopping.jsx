import { Frame, INK, Chibi } from "./shared";

function Coin({ x, y, r = 12, fill = "#f6d34c" }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={INK} strokeWidth="2" />
      <text x={x} y={y + 4} fontSize={r} fontWeight="800" textAnchor="middle" fill={INK} fontFamily="'Baloo 2', sans-serif">
        $
      </text>
    </g>
  );
}

export const shoppingIcons = {
  "shop-money": (id) => (
    <Frame id={id}>
      <rect x="52" y="86" width="96" height="52" rx="6" fill="#7bcf9e" stroke={INK} strokeWidth="3" />
      <circle cx="100" cy="112" r="16" fill="#fff8ea" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "shop-price": (id) => (
    <Frame id={id}>
      <path d="M 60 60 L 110 60 L 148 98 Q 154 104 148 110 L 110 148 L 60 148 Z" fill="#ffd166" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="78" cy="78" r="6" fill="#ffffff" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "shop-cheap": (id) => (
    <Frame id={id}>
      <Coin x={100} y={110} r={30} fill="#7bcf9e" />
      <path d="M 100 70 L 100 92" stroke="#4fae78" strokeWidth="5" strokeLinecap="round" />
      <path d="M 88 82 L 100 94 L 112 82" fill="none" stroke="#4fae78" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),
  "shop-expensive": (id) => (
    <Frame id={id}>
      <Coin x={86} y={126} r={16} />
      <Coin x={106} y={110} r={16} />
      <Coin x={116} y={90} r={16} />
      <path d="M 100 62 L 100 84" stroke="#e85d7a" strokeWidth="5" strokeLinecap="round" />
      <path d="M 88 74 L 100 62 L 112 74" fill="none" stroke="#e85d7a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),
  "shop-buy": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ff9ec7" armPose="down" face="happy" />
      <path d="M 130 96 L 160 96 L 158 130 Q 158 138 150 138 L 136 138 Q 128 138 128 130 Z" fill="#ffd6e8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "shop-sell": (id) => (
    <Frame id={id}>
      <Chibi shirt="#8fcfff" armPose="wave" face="smile" />
      <Coin x={150} y={70} r={12} />
    </Frame>
  ),
  "shop-store": (id) => (
    <Frame id={id}>
      <rect x="56" y="90" width="88" height="60" fill="#fff3da" stroke={INK} strokeWidth="3" />
      <path d="M 50 70 L 100 50 L 150 70 L 150 92 L 50 92 Z" fill="#ff9ec7" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="86" y="118" width="28" height="32" fill="#a2704c" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "shop-market": (id) => (
    <Frame id={id}>
      <path d="M 54 90 L 100 62 L 146 90 Z" fill="#8fcfff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="60" y="90" width="80" height="56" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <circle cx="80" cy="118" r="7" fill="#f45c5c" stroke={INK} strokeWidth="1.5" />
      <circle cx="100" cy="122" r="7" fill="#ffd166" stroke={INK} strokeWidth="1.5" />
      <circle cx="120" cy="118" r="7" fill="#7bcf9e" stroke={INK} strokeWidth="1.5" />
    </Frame>
  ),
  "shop-cash": (id) => (
    <Frame id={id}>
      <rect x="50" y="92" width="72" height="42" rx="4" fill="#7bcf9e" stroke={INK} strokeWidth="2.5" />
      <rect x="62" y="80" width="72" height="42" rx="4" fill="#a8e063" stroke={INK} strokeWidth="2.5" />
      <circle cx="98" cy="101" r="10" fill="#fff8ea" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "shop-bag": (id) => (
    <Frame id={id}>
      <path d="M 64 88 L 136 88 L 144 152 L 56 152 Z" fill="#ffd6e8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 80 88 Q 80 62 100 62 Q 120 62 120 88" fill="none" stroke={INK} strokeWidth="4" />
    </Frame>
  ),
  "shop-size": (id) => (
    <Frame id={id}>
      <rect x="50" y="86" width="30" height="30" rx="4" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <text x="65" y="108" fontSize="16" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="'Baloo 2', sans-serif">S</text>
      <rect x="85" y="80" width="34" height="34" rx="4" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <text x="102" y="104" fontSize="18" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="'Baloo 2', sans-serif">M</text>
      <rect x="124" y="72" width="38" height="38" rx="4" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <text x="143" y="98" fontSize="20" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="'Baloo 2', sans-serif">L</text>
    </Frame>
  ),
  "shop-change": (id) => (
    <Frame id={id}>
      <Coin x={82} y={122} r={14} />
      <Coin x={112} y={112} r={18} fill="#c7c7c7" />
      <Coin x={96} y={90} r={12} fill="#f6d34c" />
    </Frame>
  ),
  "shop-sale": (id) => (
    <Frame id={id}>
      <path d="M 60 60 L 110 60 L 148 98 Q 154 104 148 110 L 110 148 L 60 148 Z" fill="#f45c5c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <text x="94" y="112" fontSize="30" fontWeight="800" textAnchor="middle" fill="#ffffff" fontFamily="'Baloo 2', sans-serif">%</text>
    </Frame>
  ),
  "shop-customer": (id) => (
    <Frame id={id}>
      <Chibi shirt="#c9a0f5" armPose="down" face="happy" />
      <path d="M 130 96 L 160 96 L 158 130 Q 158 138 150 138 L 136 138 Q 128 138 128 130 Z" fill="#e0d6f5" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </Frame>
  ),
  "shop-cart": (id) => (
    <Frame id={id}>
      <path d="M 50 68 L 66 68 L 82 120 L 144 120 L 154 84 L 74 84" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="92" cy="140" r="8" fill="#3a3a3a" stroke={INK} strokeWidth="2" />
      <circle cx="132" cy="140" r="8" fill="#3a3a3a" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "shop-wallet": (id) => (
    <Frame id={id}>
      <rect x="54" y="86" width="92" height="60" rx="8" fill="#a2704c" stroke={INK} strokeWidth="3" />
      <path d="M 54 106 L 146 106" stroke="#5a4a52" strokeWidth="2" opacity="0.5" />
      <circle cx="132" cy="116" r="6" fill="#f6d34c" stroke={INK} strokeWidth="1.5" />
    </Frame>
  ),
  "shop-receipt": (id) => (
    <Frame id={id}>
      <path d="M 66 56 L 134 56 L 134 152 L 122 144 L 110 152 L 98 144 L 86 152 L 74 144 L 66 152 Z" fill="#ffffff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="78" y1="76" x2="122" y2="76" stroke={INK} strokeWidth="2" opacity="0.5" />
      <line x1="78" y1="92" x2="122" y2="92" stroke={INK} strokeWidth="2" opacity="0.5" />
      <line x1="78" y1="108" x2="122" y2="108" stroke={INK} strokeWidth="2" opacity="0.5" />
    </Frame>
  ),
  "shop-discount": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="104" r="46" fill="#ffd6e8" stroke={INK} strokeWidth="3" />
      <text x="100" y="116" fontSize="34" fontWeight="800" textAnchor="middle" fill="#d6437e" fontFamily="'Baloo 2', sans-serif">%</text>
    </Frame>
  ),
  "shop-creditcard": (id) => (
    <Frame id={id}>
      <rect x="48" y="80" width="104" height="66" rx="8" fill="#8fcfff" stroke={INK} strokeWidth="3" />
      <rect x="48" y="96" width="104" height="14" fill="#3a3a3a" />
      <rect x="60" y="122" width="30" height="8" rx="2" fill="#ffffff" opacity="0.8" />
    </Frame>
  ),
  "shop-coupon": (id) => (
    <Frame id={id}>
      <rect x="46" y="88" width="108" height="44" rx="6" fill="#fff8ea" stroke={INK} strokeWidth="3" strokeDasharray="6 5" />
      <circle cx="46" cy="110" r="8" fill="#eaf6ff" stroke={INK} strokeWidth="2" />
      <circle cx="154" cy="110" r="8" fill="#eaf6ff" stroke={INK} strokeWidth="2" />
      <text x="100" y="117" fontSize="20" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="'Baloo 2', sans-serif">%</text>
    </Frame>
  ),
};
