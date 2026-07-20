import { useEffect, useMemo, useState } from "react";
import Toggle from "../components/Toggle";
import AnnotatedText from "../components/AnnotatedText";
import { useSpeak } from "../hooks/useSpeech";
import { VOCAB_CATEGORIES, getVocab, toCard } from "../utils/content";
import { playCorrect, playIncorrect } from "../utils/sound";
import { useSinglePassSession } from "../utils/reviewQueue";

// Strips only sentence-level punctuation that decorates a quiz phrase
// (periods, commas, question/exclamation marks, semicolons, colons,
// parentheses) -- never characters that are part of a word's actual
// spelling. Apostrophes are deliberately NOT stripped: several real target
// words depend on them (the greetings category's contractions like "I'm",
// "don't", "You're"), so typing "Im" for those must be rejected, not
// silently accepted by stripping the character that makes the spelling
// correct.
//
// Hyphens and spaces ARE treated as interchangeable (by user request): a
// hyphenated target ("T-shirt", "X-ray", "Check-up") accepts either the
// hyphen or a space in that position ("T-shirt" or "T shirt"), since a
// learner reasonably can't be expected to know which one a given compound
// word uses. Collapsing both to a single canonical space, on both sides of
// the comparison, makes this symmetric -- it does NOT make the separator
// optional: "Tshirt" (no separator at all) still doesn't equal "t shirt",
// so this stays spelling-strict, just flexible about hyphen-vs-space.
function normalizeAnswer(str = "") {
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:()]/g, "")
    .replace(/[-\s]+/g, " ")
    .trim();
}

// Design decision: this is a spelling-practice feature, so the whole point
// is testing correct spelling -- there is no typo tolerance of any kind
// here, on purpose. An earlier version allowed a 1-edit-distance typo (with
// growing restrictions: 4+ character targets only, then never on the first
// letter), but live testing kept finding cases that still shouldn't have
// passed as "close enough" (e.g. "for" for target "four" is a single
// deletion with a matching first letter, so it slipped through the
// first-letter-only guard too). Rather than keep chasing individually
// reported false positives with ever-narrower fuzzy-match rules, the typed
// answer must now equal the target exactly (case-insensitive) -- simplest,
// safest, and the only rule that can't be defeated by a not-yet-reported
// edit pattern.
function checkAnswer(typed, target) {
  const a = normalizeAnswer(typed);
  const b = normalizeAnswer(target);
  if (!a) return false;
  return a === b;
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
  const session = useSinglePassSession(baseCards, shuffleOn);
  const finished = session.finished;
  const card = session.current;

  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showThai, setShowThai] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);

  useEffect(() => {
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
    if (ok) playCorrect();
    else playIncorrect();
  };

  const next = () => {
    session.submit(isCorrect);
    setInput("");
    setSubmitted(false);
  };

  const restart = () => {
    session.restart();
    setInput("");
    setSubmitted(false);
  };

  const retryWrongOnly = () => {
    session.retryWrongOnly();
    setInput("");
    setSubmitted(false);
  };

  return (
    <div className="quiz-view">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <p className="progress-label th-text">
        {category.label} · ทำไปแล้ว {session.score.total}/{session.total} ข้อ · คะแนน {session.score.correct}/
        {session.total}
      </p>

      <div className="toggle-group blue">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="แปล" checked={showThai} onChange={setShowThai} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="quiz-card">
          {session.wrongCount === 0 ? (
            <>
              <p className="th-text session-complete-text">เก่งมาก! คุณสะกดคำถูกครบทุกคำในชุดนี้แล้ว 🎉📘</p>
              <button className="btn btn-success btn-sm" onClick={restart}>
                🔁 เริ่มใหม่
              </button>
            </>
          ) : (
            <>
              <p className="th-text session-complete-text">
                คะแนน {session.score.correct}/{session.score.total}
              </p>
              <button className="btn btn-outline btn-sm" onClick={retryWrongOnly}>
                🔁 ลองทำเฉพาะข้อที่ตอบผิด
              </button>
              <button className="btn btn-success btn-sm" onClick={restart}>
                🔁 เริ่มใหม่
              </button>
            </>
          )}
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
