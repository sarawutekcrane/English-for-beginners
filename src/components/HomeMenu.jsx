import { useState } from "react";
import Mascot from "./Mascot";
import SettingsPanel from "./SettingsPanel";

// Phase 0 placeholder: real learning modules (Flashcards, Listening Quiz,
// etc.) land in later phases. This single entry point exists only to prove
// the app shell, Context, and data pipeline work end-to-end.
const MODULES = [
  {
    id: "scaffoldCheck",
    emoji: "🧪",
    title: "ทดสอบระบบ",
    subtitle: "หน้าทดสอบชั่วคราว (Phase 0)",
    color: "pink",
  },
];

export default function HomeMenu({ onSelect }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="home-menu">
      <button className="settings-btn" onClick={() => setSettingsOpen(true)} aria-label="ตั้งค่า">
        ⚙️
      </button>

      <header className="home-header">
        <Mascot mood="excited" size={110} />
        <h1 className="home-title">
          English <span>for</span> Beginners
        </h1>
      </header>

      <div className="module-grid">
        {MODULES.map((m) => (
          <button key={m.id} className={`module-card module-${m.color}`} onClick={() => onSelect(m.id)}>
            <span className="module-emoji">{m.emoji}</span>
            <span className="module-title">{m.title}</span>
            <span className="module-subtitle th-text">{m.subtitle}</span>
          </button>
        ))}
      </div>

      <p className="home-footer th-text">แตะโมดูลด้านบนเพื่อเริ่มเรียนรู้กันเลย! 🌸</p>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
