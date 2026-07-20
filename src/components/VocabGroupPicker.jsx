import { VOCAB_GROUPS } from "../utils/content";

/**
 * Shared theme-group picker sitting above each vocab module's own category
 * picker. One component reused by Flashcards, Listening Quiz, Speaking
 * Practice, and Vocabulary Recall so the grouping stays visually and
 * behaviorally identical everywhere, mirroring Conversation Practice's
 * GroupPicker (module-grid/module-card, same card shape).
 */
export default function VocabGroupPicker({ onPick, heading = "📚 เลือกหมวดคำศัพท์" }) {
  return (
    <div className="picker">
      <section className="picker-section">
        <h3 className="picker-heading">{heading}</h3>
        <div className="module-grid">
          {VOCAB_GROUPS.map((g) => (
            <button key={g.id} className="module-card" onClick={() => onPick(g)}>
              <span className="module-emoji">{g.emoji}</span>
              <span className="module-title th-text">{g.label}</span>
              <span className="module-subtitle th-text">{g.subtitle}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
