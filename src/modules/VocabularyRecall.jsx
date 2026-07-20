import { useEffect, useMemo, useState } from "react";
import Toggle from "../components/Toggle";
import AnnotatedText from "../components/AnnotatedText";
import { useSpeak } from "../hooks/useSpeech";
import { VOCAB_CATEGORIES, getVocab, toCard } from "../utils/content";
import { playCorrect, playIncorrect } from "../utils/sound";
import { useReviewQueue } from "../utils/reviewQueue";

const EMPTY = [];

function normalizeAnswer(str = "") {
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,!?'";:()-]/g, "");
}

/** Classic edit-distance (insert/delete/substitute), used only for the typo-tolerance check below. */
function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[rows - 1][cols - 1];
}

// Typo tolerance decision (Phase 8 item 9): allow a single-character typo
// (Levenshtein distance <= 1) to still count as correct, but ONLY for
// targets of 4+ characters. Below that length a 1-edit distance can land on
// a completely different real word ("cat" -> "bat"/"car"/"cot" are all just
// one edit away), which would silently mark a wrong-but-similar word as
// correct in a spelling drill -- the same "short words need exact matching"
// principle applied to Speaking Practice's matchesEnglish() fix in this
// phase. For longer words a 1-edit slip (a doubled letter, a transposed
// pair, one missing/extra character) is overwhelmingly a genuine typo, so
// forgiving it keeps A2-B1 spelling practice fair rather than punishing.
const MIN_LEN_FOR_TYPO_TOLERANCE = 4;

function checkAnswer(typed, target) {
  const a = normalizeAnswer(typed);
  const b = normalizeAnswer(target);
  if (!a) return false;
  if (a === b) return true;
  // Never tolerate a changed first letter as a "typo", no matter the overall
  // edit distance. Bug found in live testing: "fhree" vs "three" is exactly
  // 1 edit away (f->t), so the distance<=1 rule alone accepted it -- but a
  // wrong first letter/sound is a different word's onset, not a plausible
  // slip of the finger (unlike a doubled letter, a transposed pair, or a
  // missing/extra character elsewhere in the word). The first sound is also
  // the pedagogically most important part of a word to get right in a
  // spelling drill, so it gets zero tolerance even on long words.
  if (a[0] !== b[0]) return false;
  if (b.length >= MIN_LEN_FOR_TYPO_TOLERANCE && levenshtein(a, b) <= 1) return true;
  return false;
}

function CategoryPicker({ onPick }) {
  return (
    <div className="picker">
      <section className="picker-section">
        <h3 className="picker-heading">📚 เลือกหมวดหมู่คำศัพท์</h3>
        <div className="category-grid">
          {VOCAB_CATEGORIES.map((c) => (
            <button key={c.id} className="category-chip" onClick={() => onPick(c)}>
              <span className="category-chip-emoji">{c.emoji}</span>
              <span className="category-chip-label th-text">{c.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function RecallView({ category, onBack }) {
  const { speak } = useSpeak();
  const [shuffleOn, setShuffleOn] = useState(false);
  const baseCards = useMemo(() => getVocab(category.id).map(toCard), [category]);
  const review = useReviewQueue(shuffleOn ? baseCards : EMPTY);
  const [index, setIndex] = useState(0);
  const finished = shuffleOn && review.finished;
  const card = shuffleOn ? review.current : baseCards[index % baseCards.length];

  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showThai, setShowThai] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);

  useEffect(() => {
    setIndex(0);
    setInput("");
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, shuffleOn]);

  // Auto-play the target word's audio as soon as a new question loads --
  // this is a listening drill first (no text/word shown up front), typing
  // practice second.
  useEffect(() => {
    if (card && !finished) speak(card.audioText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, finished]);

  const hearAgain = () => card && speak(card.audioText);

  const submit = (e) => {
    e.preventDefault();
    if (submitted || !card || !input.trim()) return;
    const ok = checkAnswer(input, card.answerText);
    setIsCorrect(ok);
    setSubmitted(true);
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    if (ok) playCorrect();
    else playIncorrect();
  };

  const next = () => {
    if (shuffleOn) review.submit(isCorrect);
    else setIndex((i) => i + 1);
    setInput("");
    setSubmitted(false);
  };

  const restart = () => {
    review.restart();
    setIndex(0);
    setScore({ correct: 0, total: 0 });
    setInput("");
    setSubmitted(false);
  };

  return (
    <div className="quiz-view">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <p className="progress-label th-text">
        {category.label} · คะแนน {score.correct} / {score.total}
        {shuffleOn && ` · ตอบถูกครบแล้ว ${review.totalCount - review.remainingCount} / ${review.totalCount}`}
      </p>

      <div className="toggle-group blue">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="แปล" checked={showThai} onChange={setShowThai} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="quiz-card">
          <p className="th-text session-complete-text">เก่งมาก! คุณสะกดคำถูกครบทุกคำในชุดนี้แล้ว 🎉📘</p>
          <button className="btn btn-success btn-sm" onClick={restart}>
            🔁 เริ่มรอบใหม่ (สุ่มใหม่)
          </button>
        </div>
      ) : (
        <div className="quiz-card">
          <button className="btn btn-round btn-blue" onClick={hearAgain} aria-label="ฟังอีกครั้ง">
            🔊
          </button>
          <p className="th-text quiz-instruction">ฟังเสียงแล้วพิมพ์คำศัพท์ภาษาอังกฤษที่ได้ยิน</p>

          <form className="recall-form" onSubmit={submit}>
            <input
              type="text"
              className="recall-input en-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={submitted}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              placeholder="พิมพ์คำตอบที่นี่..."
              aria-label="พิมพ์คำตอบ"
            />
            {!submitted && (
              <button type="submit" className="btn btn-success" disabled={!input.trim()}>
                ตรวจคำตอบ
              </button>
            )}
          </form>

          {submitted && (
            <p className={`quiz-feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"} th-text`}>
              {isCorrect ? "เก่งมาก! ถูกต้อง 🎉" : "ยังไม่ถูกนะ ลองฟังใหม่อีกครั้ง 💪"}
            </p>
          )}

          {submitted && (
            <p className="quiz-reveal en-text">
              เฉลย: <AnnotatedText plain={card.display} segments={card.segments} />
              {card.partOfSpeech ? ` (${card.partOfSpeech})` : ""}
            </p>
          )}

          {submitted && showPhonetic && <p className="flashcard-romaji">{card.reading}</p>}
          {submitted && showThai && <p className="flashcard-thai th-text">{card.thai}</p>}

          {submitted && (
            <div className="quiz-actions">
              <button className="btn btn-success btn-sm" onClick={next}>
                ข้อถัดไป →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VocabularyRecall() {
  const [category, setCategory] = useState(null);

  if (!category) return <CategoryPicker onPick={setCategory} />;
  return <RecallView category={category} onBack={() => setCategory(null)} />;
}
