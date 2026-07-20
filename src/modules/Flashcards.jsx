import { useEffect, useMemo, useState } from "react";
import Illustration from "../illustrations";
import Toggle from "../components/Toggle";
import AnnotatedText from "../components/AnnotatedText";
import VocabGroupPicker from "../components/VocabGroupPicker";
import { useSpeak } from "../hooks/useSpeech";
import { VOCAB_CATEGORIES, getVocab, toCard, shuffle } from "../utils/content";

function CategoryPicker({ group, onPick, onBack }) {
  const categories = VOCAB_CATEGORIES.filter((c) => c.group === group.id);
  return (
    <div className="picker">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดคำศัพท์
      </button>
      <section className="picker-section">
        <h3 className="picker-heading">
          {group.emoji} {group.label} · เลือกหมวดหมู่คำศัพท์
        </h3>
        <div className="category-grid">
          {categories.map((c) => (
            <button
              key={c.id}
              className="category-chip"
              onClick={() => onPick({ category: c.id, label: c.label })}
            >
              <span className="category-chip-emoji">{c.emoji}</span>
              <span className="category-chip-label th-text">{c.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function FlashcardView({ selection, onBack }) {
  const { speak } = useSpeak();
  const [shuffleOn, setShuffleOn] = useState(false);
  const [index, setIndex] = useState(0);
  const [showThai, setShowThai] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [round, setRound] = useState(0);
  const [completed, setCompleted] = useState(false);

  const cards = useMemo(() => {
    const base = getVocab(selection.category).map(toCard);
    return shuffleOn ? shuffle(base) : base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, shuffleOn, round]);

  useEffect(() => {
    setIndex(0);
    setCompleted(false);
  }, [cards]);

  const card = cards[index];

  const say = () => speak(card.audioText);

  const go = (delta) => {
    if (shuffleOn) {
      if (delta === 1 && index === cards.length - 1) {
        setCompleted(true);
        return;
      }
      if (delta === -1 && index === 0) return;
    }
    setIndex((i) => (i + delta + cards.length) % cards.length);
  };

  const restart = () => setRound((r) => r + 1);

  return (
    <div className="flashcards-view">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <p className="progress-label th-text">
        {selection.label} · {index + 1} / {cards.length}
      </p>

      <div className="toggle-group">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="แปล" checked={showThai} onChange={setShowThai} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {completed ? (
        <div className="flashcard">
          <p className="th-text session-complete-text">คุณดูครบทุกคำศัพท์ในหมวดนี้แล้ว! 🎉📘</p>
          <button className="btn btn-success btn-sm" onClick={restart}>
            🔁 เริ่มรอบใหม่ (สุ่มใหม่)
          </button>
        </div>
      ) : (
        <>
          <div className="flashcard" onClick={say} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && say()}>
            <div className="flashcard-illustration">
              <Illustration item={card} />
            </div>
            <AnnotatedText as="p" className="flashcard-text en-text" plain={card.display} segments={card.segments} />
            {card.partOfSpeech && <p className="verb-group en-text">{card.partOfSpeech}</p>}
            {showPhonetic && <p className="flashcard-romaji">{card.reading}</p>}
            {showThai && <p className="flashcard-thai th-text">{card.thai}</p>}
            <p className="flashcard-hint th-text">แตะเพื่อฟังเสียง 🔊</p>
          </div>

          <div className="flashcard-nav">
            <button className="btn btn-round btn-outline" onClick={() => go(-1)} aria-label="ก่อนหน้า" disabled={shuffleOn && index === 0}>
              ‹
            </button>
            <button className="btn btn-round" onClick={say} aria-label="ฟังเสียง">
              🔊
            </button>
            <button className="btn btn-round btn-outline" onClick={() => go(1)} aria-label="ถัดไป">
              ›
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Flashcards() {
  const [group, setGroup] = useState(null);
  const [selection, setSelection] = useState(null);

  if (!group) return <VocabGroupPicker onPick={setGroup} />;
  if (!selection) {
    return <CategoryPicker group={group} onPick={setSelection} onBack={() => setGroup(null)} />;
  }
  return <FlashcardView selection={selection} onBack={() => setSelection(null)} />;
}
