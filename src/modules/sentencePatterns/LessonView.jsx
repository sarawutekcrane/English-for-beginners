import { useSpeak } from "../../hooks/useSpeech";
import AnnotatedText from "../../components/AnnotatedText";

export default function LessonView({ pattern, onBack }) {
  const { speak } = useSpeak();

  return (
    <div className="lesson-view">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนแพทเทิร์น
      </button>

      <h3 className="pattern-detail-title">
        <span className="en-text">
          {pattern.order}. {pattern.title}
        </span>
        <span className="pattern-detail-title-th th-text">{pattern.titleTh}</span>
      </h3>

      <div className="lesson-card">
        <h3 className="lesson-heading">📐 โครงสร้างประโยค</h3>
        <p className="lesson-structure en-text">{pattern.structure}</p>

        <h3 className="lesson-heading">🔤 คำสำคัญ (Function Words)</h3>
        <div className="particle-list">
          {pattern.functionWords.map((fw) => (
            <div key={fw.word} className="particle-item">
              <span className="particle-chip en-text">{fw.word}</span>
              <span className="particle-role th-text">{fw.role}</span>
            </div>
          ))}
        </div>

        {pattern.timeNote && (
          <div className="time-note th-text">
            <span>⏰</span> {pattern.timeNote}
          </div>
        )}

        <h3 className="lesson-heading">💬 ตัวอย่างประโยค</h3>
        <div className="example-list">
          {pattern.examples.map((ex, i) => (
            <div key={i} className="example-card" onClick={() => speak(ex.text)} role="button" tabIndex={0}>
              <AnnotatedText as="p" className="en-text example-jp" plain={ex.text} segments={ex.altScript} />
              <p className="example-romaji">{ex.phonetic}</p>
              <p className="th-text example-thai">{ex.thai}</p>
              <span className="example-play">🔊 แตะเพื่อฟัง</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
