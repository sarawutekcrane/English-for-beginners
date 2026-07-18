import { useEffect, useState } from "react";
import HomeMenu from "./components/HomeMenu";
import SettingsPanel from "./components/SettingsPanel";
import Flashcards from "./modules/Flashcards";
import ListeningQuiz from "./modules/ListeningQuiz";
import { playClick } from "./utils/sound";

// Forward-compatible with the module UI patterns future phases will add
// (Speaking Practice, etc. reuse these same class names).
const CLICKABLE_SELECTOR = "button, .topic-card, .reply-option, .quiz-option, .chunk-pill";

const TITLES = {
  flashcards: "แฟลชการ์ด",
  listening: "แบบทดสอบฟัง",
};

function App() {
  const [view, setView] = useState("home");
  const [instanceKey, setInstanceKey] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest(CLICKABLE_SELECTOR);
      if (el && !el.disabled) playClick();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const goHome = () => {
    setView("home");
    setInstanceKey((k) => k + 1);
  };

  const openView = (next) => {
    setView(next);
    setInstanceKey((k) => k + 1);
  };

  return (
    <div className="app-shell">
      {view === "home" ? (
        <HomeMenu onSelect={openView} />
      ) : (
        <>
          <div className="top-bar">
            <button className="back-btn" onClick={goHome} aria-label="กลับหน้าหลัก">
              ←
            </button>
            <h2>{TITLES[view]}</h2>
            <button className="top-bar-settings-btn" onClick={() => setSettingsOpen(true)} aria-label="ตั้งค่า">
              ⚙️
            </button>
          </div>
          {view === "flashcards" && <Flashcards key={instanceKey} />}
          {view === "listening" && <ListeningQuiz key={instanceKey} />}
          {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
        </>
      )}
    </div>
  );
}

export default App;
