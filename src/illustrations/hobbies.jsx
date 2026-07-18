import { Frame, INK, Chibi, Sparkle } from "./shared";

export const hobbiesIcons = {
  "hobby-reading": (id) => (
    <Frame id={id}>
      <Chibi shirt="#8fcfff" armPose="down" face="smile" />
      <path d="M 128 100 L 160 96 L 162 128 L 130 132 Z" fill="#ffffff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="146" y1="98" x2="146" y2="130" stroke={INK} strokeWidth="1.5" opacity="0.5" />
    </Frame>
  ),
  "hobby-swimming": (id) => (
    <Frame id={id}>
      <Chibi shirt="#4c8df0" armPose="wave" face="happy" />
      <path d="M 40 150 Q 60 140 80 150 Q 100 160 120 150 Q 140 140 160 150" fill="none" stroke="#8fcfff" strokeWidth="5" strokeLinecap="round" />
    </Frame>
  ),
  "hobby-running": (id) => (
    <Frame id={id}>
      <Chibi shirt="#f6d34c" armPose="up" face="happy" />
      <path d="M 40 130 Q 55 130 65 130" stroke={INK} strokeWidth="3" opacity="0.4" strokeLinecap="round" />
      <path d="M 35 145 Q 52 145 64 145" stroke={INK} strokeWidth="3" opacity="0.4" strokeLinecap="round" />
    </Frame>
  ),
  "hobby-dancing": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ff9ec7" armPose="up" face="wink" />
      <Sparkle x="150" y="60" s="0.8" />
      <Sparkle x="50" y="70" s="0.6" />
    </Frame>
  ),
  "hobby-singing": (id) => (
    <Frame id={id}>
      <Chibi shirt="#c9a0f5" armPose="up" face="happy" />
      <path d="M 150 60 L 150 92 Q 156 88 160 92 Q 160 100 150 100 Q 142 100 142 92 Q 142 86 150 88 Z" fill={INK} />
    </Frame>
  ),
  "hobby-painting": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ff9ec7" armPose="wave" face="happy" />
      <ellipse cx="152" cy="112" rx="16" ry="11" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <circle cx="146" cy="108" r="2.5" fill="#f45c5c" />
      <circle cx="152" cy="110" r="2.5" fill="#7bcf9e" />
      <circle cx="158" cy="114" r="2.5" fill="#4c8df0" />
    </Frame>
  ),
  "hobby-fishing": (id) => (
    <Frame id={id}>
      <Chibi shirt="#7bcf9e" armPose="up" face="smile" />
      <line x1="140" y1="70" x2="164" y2="132" stroke="#a2704c" strokeWidth="3" strokeLinecap="round" />
      <circle cx="164" cy="140" r="4" fill="#8fcfff" stroke={INK} strokeWidth="1.5" />
    </Frame>
  ),
  "hobby-gaming": (id) => (
    <Frame id={id}>
      <rect x="56" y="94" width="88" height="44" rx="20" fill="#3a3a3a" stroke={INK} strokeWidth="3" />
      <circle cx="82" cy="116" r="8" fill="#ffffff" />
      <circle cx="128" cy="108" r="5" fill="#f45c5c" />
      <circle cx="140" cy="120" r="5" fill="#7bcf9e" />
    </Frame>
  ),
  "hobby-traveling": (id) => (
    <Frame id={id}>
      <Chibi shirt="#ffd166" armPose="down" face="happy" />
      <rect x="128" y="106" width="30" height="34" rx="4" fill="#4c8df0" stroke={INK} strokeWidth="2.5" />
      <rect x="138" y="100" width="10" height="10" fill="#4c8df0" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "hobby-drawing": (id) => (
    <Frame id={id}>
      <Chibi shirt="#8fcfff" armPose="down" face="smile" />
      <line x1="138" y1="132" x2="162" y2="108" stroke="#5a4a52" strokeWidth="5" strokeLinecap="round" />
      <path d="M 158 112 L 166 104 L 162 100 L 154 108 Z" fill="#ffd166" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
    </Frame>
  ),
  "hobby-football": (id) => (
    <Frame id={id}>
      <Chibi shirt="#7bcf9e" armPose="up" face="happy" />
      <circle cx="150" cy="138" r="14" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <path d="M 150 128 L 156 134 L 154 142 L 146 142 L 144 134 Z" fill={INK} />
    </Frame>
  ),
  "hobby-guitar": (id) => (
    <Frame id={id}>
      <Chibi shirt="#f5924a" armPose="down" face="happy" />
      <ellipse cx="150" cy="130" rx="16" ry="20" fill="#e0a15c" stroke={INK} strokeWidth="2.5" />
      <line x1="150" y1="110" x2="150" y2="76" stroke="#a2704c" strokeWidth="5" strokeLinecap="round" />
    </Frame>
  ),
  "hobby-movies": (id) => (
    <Frame id={id}>
      <rect x="52" y="76" width="96" height="60" rx="6" fill="#3a3a3a" stroke={INK} strokeWidth="3" />
      <rect x="60" y="84" width="80" height="44" rx="3" fill="#8fcfff" />
      <path d="M 92 96 L 92 116 L 112 106 Z" fill="#ffffff" />
    </Frame>
  ),
  "hobby-camping": (id) => (
    <Frame id={id}>
      <path d="M 60 148 L 100 68 L 140 148 Z" fill="#ff9ec7" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 86 148 L 100 110 L 114 148 Z" fill="#e8548a" />
    </Frame>
  ),
  "hobby-cycling": (id) => (
    <Frame id={id}>
      <circle cx="72" cy="128" r="24" fill="none" stroke="#3a3a3a" strokeWidth="4" />
      <circle cx="130" cy="128" r="24" fill="none" stroke="#3a3a3a" strokeWidth="4" />
      <path d="M 72 128 L 100 88 L 130 128 M 100 88 L 84 88" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="70" r="12" fill="#ffe9d6" stroke={INK} strokeWidth="2.5" />
    </Frame>
  ),
  "hobby-knitting": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="118" r="24" fill="#ff9ec7" stroke={INK} strokeWidth="3" />
      <path d="M 82 100 Q 100 118 118 100" fill="none" stroke="#d6437e" strokeWidth="2" opacity="0.6" />
      <line x1="120" y1="80" x2="140" y2="60" stroke="#a2704c" strokeWidth="3" strokeLinecap="round" />
      <line x1="130" y1="80" x2="150" y2="60" stroke="#a2704c" strokeWidth="3" strokeLinecap="round" />
    </Frame>
  ),
  "hobby-photography": (id) => (
    <Frame id={id}>
      <rect x="56" y="88" width="88" height="60" rx="8" fill="#3a3a3a" stroke={INK} strokeWidth="3" />
      <circle cx="100" cy="118" r="20" fill="#8fcfff" stroke={INK} strokeWidth="3" />
      <rect x="80" y="76" width="24" height="14" rx="3" fill="#3a3a3a" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "hobby-gardening": (id) => (
    <Frame id={id}>
      <Chibi shirt="#7bcf9e" armPose="down" face="happy" />
      <path d="M 140 150 L 140 110" stroke="#5fbf77" strokeWidth="5" strokeLinecap="round" />
      <circle cx="140" cy="100" r="12" fill="#ffd166" stroke={INK} strokeWidth="2" />
    </Frame>
  ),
  "hobby-hiking": (id) => (
    <Frame id={id}>
      <path d="M 44 148 L 84 78 L 112 122 L 128 96 L 160 148 Z" fill="#a2704c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 84 78 L 92 92 L 76 92 Z" fill="#ffffff" opacity="0.7" />
    </Frame>
  ),
  "hobby-yoga": (id) => (
    <Frame id={id}>
      <circle cx="100" cy="70" r="18" fill="#ffe9d6" stroke={INK} strokeWidth="3" />
      <path d="M 70 130 Q 100 100 130 130 Q 100 150 70 130 Z" fill="#c9a0f5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 60 110 Q 80 100 100 108" stroke="#c9a0f5" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M 140 110 Q 120 100 100 108" stroke="#c9a0f5" strokeWidth="8" fill="none" strokeLinecap="round" />
    </Frame>
  ),
};
