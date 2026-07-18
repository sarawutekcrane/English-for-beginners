import { useEffect, useMemo, useRef, useState } from "react";
import Toggle from "../components/Toggle";
import AnnotatedText from "../components/AnnotatedText";
import { useSpeak } from "../hooks/useSpeech";
import { VOCAB_CATEGORIES, getVocab, toCard, sample, shuffle } from "../utils/content";
import { playCorrect, playIncorrect } from "../utils/sound";
import { useReviewQueue } from "../utils/reviewQueue";
import PHONETIC_CONFUSIONS from "../data/phoneticConfusions.json";

const EMPTY = [];

function PoolPicker({ onPick }) {
  return (
    <div className="picker">
      <section className="picker-section">
        <h3 className="picker-heading">📚 เลือกหมวดหมู่คำศัพท์</h3>
        <div className="category-grid">
          {VOCAB_CATEGORIES.map((c) => (
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

/**
 * One correct answer + 3 distractors, shuffled into display order.
 * Prefers phonetically-confusable sound-alike words (curated in
 * phoneticConfusions.json) when available for the answer -- these test
 * listening discrimination much better than arbitrary same-category words.
 * Any remaining slots (fewer than 3 genuine confusables, or none at all)
 * are filled with same-category distractors, so every question still ends
 * up with exactly 4 options either way.
 */
function buildQuestion(pool, answer) {
  const confusables = PHONETIC_CONFUSIONS[answer.id] || [];
  const preferredDistractors = shuffle(confusables).slice(0, 3);
  const remaining = 3 - preferredDistractors.length;
  const usedIds = new Set([answer.id, ...preferredDistractors.map((c) => c.id)]);
  const fallbackDistractors =
    remaining > 0 ? sample(pool.filter((p) => !usedIds.has(p.id)), remaining) : [];
  const options = shuffle([answer, ...preferredDistractors, ...fallbackDistractors]);
  return { answer, options };
}

function QuizView({ selection, onBack }) {
  const { speak } = useSpeak();
  const [shuffleOn, setShuffleOn] = useState(false);
  const [pool] = useState(() => getVocab(selection.category).map(toCard));

  const [cursor, setCursor] = useState(0);
  const review = useReviewQueue(shuffleOn ? pool : EMPTY);
  const activeAnswer = shuffleOn ? review.current : pool[cursor % pool.length];

  const [selectedId, setSelectedId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showThai, setShowThai] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);

  const question = useMemo(() => (activeAnswer ? buildQuestion(pool, activeAnswer) : null), [pool, activeAnswer]);

  const isCorrect = question && selectedId === question.answer.id;
  const answered = selectedId !== null;
  const finished = shuffleOn && review.finished;

  // Auto-reveal translation/phonetic/answer on a correct answer, as if
  // their toggles were switched on. A wrong guess never triggers this.
  const effectiveShowThai = showThai || (answered && isCorrect);
  const effectiveShowPhonetic = showPhonetic || (answered && isCorrect);
  const effectiveRevealed = revealed || (answered && isCorrect);

  const play = () => speak(question.answer.audioText);

  const speakTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(speakTimeoutRef.current), []);

  useEffect(() => {
    setSelectedId(null);
    setRevealed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleOn]);

  const choose = (opt) => {
    if (answered) return;
    setSelectedId(opt.id);
    setScore((s) => ({ correct: s.correct + (opt.id === question.answer.id ? 1 : 0), total: s.total + 1 }));
    if (opt.id === question.answer.id) playCorrect();
    else playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(play, 500);
  };

  const next = () => {
    clearTimeout(speakTimeoutRef.current);
    if (shuffleOn) review.submit(isCorrect);
    else setCursor((c) => c + 1);
    setSelectedId(null);
    setRevealed(false);
  };

  const restart = () => {
    review.restart();
    setScore({ correct: 0, total: 0 });
    setSelectedId(null);
    setRevealed(false);
  };

  return (
    <div className="quiz-view">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <p className="progress-label th-text">
        {selection.label} · คะแนน {score.correct} / {score.total}
        {shuffleOn && ` · ตอบถูกครบแล้ว ${review.totalCount - review.remainingCount} / ${review.totalCount}`}
      </p>

      <div className="toggle-group blue">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="แปล" checked={showThai} onChange={setShowThai} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="quiz-card">
          <p className="th-text session-complete-text">เก่งมาก! คุณตอบถูกครบทุกคำในชุดนี้แล้ว 🎉📘</p>
          <button className="btn btn-success btn-sm" onClick={restart}>
            🔁 เริ่มรอบใหม่ (สุ่มใหม่)
          </button>
        </div>
      ) : (
        <div className="quiz-card">
          <button className="btn btn-round btn-blue" onClick={play} aria-label="เล่นเสียง">
            🔊
          </button>
          <p className="th-text quiz-instruction">ฟังเสียงแล้วเลือกคำที่ตรงกัน</p>

          <div className="quiz-options">
            {question.options.map((opt) => {
              let cls = "quiz-option";
              if (answered) {
                if (opt.id === question.answer.id) cls += " correct";
                else if (opt.id === selectedId) cls += " incorrect";
              }
              return (
                <button key={opt.id} className={cls} onClick={() => choose(opt)} disabled={answered}>
                  <AnnotatedText className="en-text" plain={opt.display} segments={opt.segments} />
                  {effectiveShowPhonetic && <span className="quiz-option-hint">{opt.reading}</span>}
                  {effectiveShowThai && <span className="quiz-option-hint th-text">{opt.thai}</span>}
                </button>
              );
            })}
          </div>

          {answered && (
            <p className={`quiz-feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"} th-text`}>
              {isCorrect ? "เก่งมาก! ถูกต้อง 🎉" : "ยังไม่ถูกนะ ลองฟังใหม่อีกครั้ง 💪"}
            </p>
          )}

          {effectiveRevealed && (
            <p className="quiz-reveal en-text">
              เฉลย: <AnnotatedText plain={question.answer.display} segments={question.answer.segments} />
              {question.answer.reading ? ` (${question.answer.reading})` : ""}
              {question.answer.partOfSpeech ? ` (${question.answer.partOfSpeech})` : ""}
            </p>
          )}

          <div className="quiz-actions">
            <button className="btn btn-outline btn-sm" onClick={() => setRevealed(true)}>
              เฉลยคำตอบ
            </button>
            {answered && (
              <button className="btn btn-success btn-sm" onClick={next}>
                ข้อถัดไป →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListeningQuiz() {
  const [selection, setSelection] = useState(null);

  if (!selection) return <PoolPicker onPick={setSelection} />;
  return <QuizView selection={selection} onBack={() => setSelection(null)} />;
}
