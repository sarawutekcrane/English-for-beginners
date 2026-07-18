// The source app also had a Counter/Quantifier lesson+drill pair here.
// Japanese numeral classifiers have no direct English equivalent, and
// English quantifiers (a piece of, a pair of, countable/uncountable) are a
// minor vocabulary topic rather than a core A2-B1 grammar pattern, so that
// pair was dropped rather than repurposed -- see the Phase 5 commit message.
const SECTIONS = [
  { id: "lesson", emoji: "📖", title: "แพทเทิร์นประโยค", subtitle: "โครงสร้าง คำสำคัญ & ตัวอย่างประโยค", color: "pink" },
  { id: "wordorder", emoji: "🧩", title: "ฝึกเรียงประโยค", subtitle: "แตะคำให้เรียงถูกลำดับ", color: "blue" },
  { id: "conjugationLesson", emoji: "🔤", title: "สอนและอธิบายวิธีการผันกริยา", subtitle: "regular vs irregular", color: "pink" },
  { id: "conjugationPractice", emoji: "✏️", title: "ฝึกผันกริยา", subtitle: "เลือกรูปผันที่ถูกต้อง", color: "blue" },
  { id: "adjectiveLesson", emoji: "🎨", title: "สอนและอธิบายคำคุณศัพท์", subtitle: "comparative & superlative", color: "pink" },
  { id: "adjectivePractice", emoji: "💫", title: "ฝึกผันคำคุณศัพท์", subtitle: "เลือกรูปผันที่ถูกต้อง", color: "blue" },
];

export default function SectionPicker({ onPick }) {
  return (
    <div className="module-grid">
      {SECTIONS.map((s) => (
        <button key={s.id} className={`module-card module-${s.color}`} onClick={() => onPick(s.id)}>
          <span className="module-emoji">{s.emoji}</span>
          <span className="module-title">{s.title}</span>
          <span className="module-subtitle th-text">{s.subtitle}</span>
        </button>
      ))}
    </div>
  );
}
