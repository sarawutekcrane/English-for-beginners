import { useEffect, useMemo, useRef, useState } from "react";
import Toggle from "../components/Toggle";
import AnnotatedText from "../components/AnnotatedText";
import VocabGroupPicker from "../components/VocabGroupPicker";
import { useSpeak } from "../hooks/useSpeech";
import { VOCAB_CATEGORIES, getVocab, toCard, sample, shuffle } from "../utils/content";
import { playCorrect, playIncorrect } from "../utils/sound";
import { useSinglePassSession } from "../utils/reviewQueue";
import PHONETIC_CONFUSIONS from "../data/phoneticConfusions.json";

function PoolPicker({ group, onPick, onBack }) {
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

const TIMER_MIN_SECONDS = 2;
const TIMER_MAX_SECONDS = 20;
const TIMER_DEFAULT_SECONDS = 3;
const TIMER_STEP_SECONDS = 1;

/** Circular countdown ring matching the app's existing SVG/pastel-token visual language. */
function CountdownRing({ timeLeft, duration }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const pct = duration > 0 ? timeLeft / duration : 0;
  const offset = circumference * (1 - pct);
  const urgent = timeLeft <= 1;
  return (
    <div className={`timer-ring${urgent ? " urgent" : ""}`} role="timer" aria-label={`เหลือเวลา ${timeLeft} วินาที`}>
      <svg viewBox="0 0 60 60" width="60" height="60">
        <circle className="timer-ring-track" cx="30" cy="30" r={radius} />
        <circle
          className="timer-ring-progress"
          cx="30"
          cy="30"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="timer-ring-number">{timeLeft}</span>
    </div>
  );
}

function QuizView({ selection, onBack }) {
  const { speak } = useSpeak();
  const [shuffleOn, setShuffleOn] = useState(false);
  const [pool] = useState(() => getVocab(selection.category).map(toCard));

  const session = useSinglePassSession(pool, shuffleOn);
  const activeAnswer = session.current;

  const [selectedId, setSelectedId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Local, non-persisted per-session state, matching every other toggle in
  // the app (only speechRate is a device preference saved to localStorage)
  // -- defaults to off/3s and resets whenever this module is freshly
  // remounted from home via the existing key-based remount pattern.
  const [timerOn, setTimerOn] = useState(false);
  const [timerDuration, setTimerDuration] = useState(TIMER_DEFAULT_SECONDS);
  const [timeLeft, setTimeLeft] = useState(TIMER_DEFAULT_SECONDS);

  const question = useMemo(() => (activeAnswer ? buildQuestion(pool, activeAnswer) : null), [pool, activeAnswer]);

  const isCorrect = question && !timedOut && selectedId === question.answer.id;
  const answered = selectedId !== null || timedOut;
  const finished = session.finished;

  // Phase 11: options are now the Thai meanings themselves, so there's no
  // Translation/Phonetic toggle left to gate the post-answer reveal behind
  // -- always show the full English/transliteration/meaning detail once
  // answered, correct or not, so the learner still gets the full picture.
  const effectiveRevealed = revealed || answered;

  const play = () => speak(question.answer.audioText);

  const speakTimeoutRef = useRef(null);
  const autoAdvanceTimeoutRef = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(speakTimeoutRef.current);
      clearTimeout(autoAdvanceTimeoutRef.current);
    },
    []
  );

  useEffect(() => {
    setSelectedId(null);
    setRevealed(false);
    setTimedOut(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleOn]);

  const choose = (opt) => {
    if (answered) return;
    // A genuine tap always wins over an in-flight countdown: clearing the
    // auto-advance timer here (in addition to the countdown effect's own
    // cleanup, which fires on the next render once `answered` flips true)
    // guarantees no late auto-reveal/auto-advance can land after this.
    clearTimeout(autoAdvanceTimeoutRef.current);
    setSelectedId(opt.id);
    if (opt.id === question.answer.id) playCorrect();
    else playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(play, 500);
  };

  const next = () => {
    clearTimeout(speakTimeoutRef.current);
    clearTimeout(autoAdvanceTimeoutRef.current);
    session.submit(isCorrect);
    setSelectedId(null);
    setRevealed(false);
    setTimedOut(false);
  };

  const restart = () => {
    clearTimeout(speakTimeoutRef.current);
    clearTimeout(autoAdvanceTimeoutRef.current);
    session.restart();
    setSelectedId(null);
    setRevealed(false);
    setTimedOut(false);
  };

  const retryWrongOnly = () => {
    clearTimeout(speakTimeoutRef.current);
    clearTimeout(autoAdvanceTimeoutRef.current);
    session.retryWrongOnly();
    setSelectedId(null);
    setRevealed(false);
    setTimedOut(false);
  };

  // Fires when the countdown reaches zero without an answer. Reuses the
  // exact same incorrect-answer path a manual wrong tap already uses
  // (playIncorrect, then speak the correct pronunciation after the
  // module's established 500ms pacing) so this feeds into
  // useSinglePassSession's normal submit()/wrongItems tracking via next()
  // -- not a separate scoring path. The auto-advance-to-next-question that
  // follows reuses that same 500ms delay, since no auto-advance flow
  // existed anywhere in this module before this feature to copy a timing
  // value from.
  const handleTimeout = () => {
    setTimedOut(true);
    playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(play, 500);
    clearTimeout(autoAdvanceTimeoutRef.current);
    autoAdvanceTimeoutRef.current = setTimeout(next, 500);
  };

  // Stepper adjustments apply immediately: they restart the CURRENT
  // question's countdown at the new duration (via the ticking effect
  // below, which has timerDuration in its dependency array), rather than
  // waiting until the next question. Chosen for the more predictable
  // mental model -- the displayed duration is always what's actually
  // counting down.
  const adjustTimerDuration = (delta) => {
    setTimerDuration((d) => Math.min(TIMER_MAX_SECONDS, Math.max(TIMER_MIN_SECONDS, d + delta)));
  };

  // Countdown ticking: (re)starts fresh whenever the timer is switched on,
  // a new question loads, or the duration is adjusted. The cleanup clears
  // the interval the moment any of those change OR the question becomes
  // answered/finished/the timer is switched off -- no lingering interval
  // can ever fire into a question the learner has already left.
  useEffect(() => {
    if (!timerOn || !question || answered || finished) return;
    setTimeLeft(timerDuration);
    const intervalId = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timerOn, question, answered, finished, timerDuration]);

  // Split from the ticking effect above so the zero-detection isn't inside
  // a useState updater function -- React's Strict Mode can invoke updater
  // functions twice in development to check for purity, which would
  // double-fire handleTimeout's side effects (sound, scheduling) if it
  // were called from inside setTimeLeft's callback instead.
  useEffect(() => {
    if (!timerOn || answered || finished || !question) return;
    if (timeLeft === 0) handleTimeout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  return (
    <div className="quiz-view">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <p className="progress-label th-text">
        {selection.label} · ทำไปแล้ว {session.score.total}/{session.total} ข้อ · คะแนน {session.score.correct}/
        {session.total}
      </p>

      <div className="toggle-group blue">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle emoji="⏱️" label="จับเวลา" checked={timerOn} onChange={setTimerOn} />
        {timerOn && (
          <div className="timer-stepper">
            <button
              type="button"
              className="timer-stepper-btn"
              onClick={() => adjustTimerDuration(-TIMER_STEP_SECONDS)}
              disabled={timerDuration <= TIMER_MIN_SECONDS}
              aria-label="ลดเวลานับถอยหลัง"
            >
              −
            </button>
            <span className="timer-stepper-value th-text">{timerDuration} วิ</span>
            <button
              type="button"
              className="timer-stepper-btn"
              onClick={() => adjustTimerDuration(TIMER_STEP_SECONDS)}
              disabled={timerDuration >= TIMER_MAX_SECONDS}
              aria-label="เพิ่มเวลานับถอยหลัง"
            >
              +
            </button>
          </div>
        )}
      </div>

      {finished ? (
        <div className="quiz-card">
          {session.wrongCount === 0 ? (
            <>
              <p className="th-text session-complete-text">เก่งมาก! คุณตอบถูกครบทุกคำในชุดนี้แล้ว 🎉📘</p>
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
          <button className="btn btn-round btn-blue" onClick={play} aria-label="เล่นเสียง">
            🔊
          </button>

          {timerOn && !answered && <CountdownRing timeLeft={timeLeft} duration={timerDuration} />}

          <p className="th-text quiz-instruction">ฟังเสียงแล้วเลือกความหมายที่ตรงกัน</p>

          <div className="quiz-options">
            {question.options.map((opt) => {
              let cls = "quiz-option";
              if (answered) {
                if (opt.id === question.answer.id) cls += " correct";
                else if (opt.id === selectedId) cls += " incorrect";
              }
              return (
                <button key={opt.id} className={cls} onClick={() => choose(opt)} disabled={answered}>
                  <span className="th-text">{opt.thai}</span>
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
              {" -- "}
              <span className="th-text">{question.answer.thai}</span>
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
  const [group, setGroup] = useState(null);
  const [selection, setSelection] = useState(null);

  if (!group) return <VocabGroupPicker onPick={setGroup} />;
  if (!selection) {
    return <PoolPicker group={group} onPick={setSelection} onBack={() => setGroup(null)} />;
  }
  return <QuizView selection={selection} onBack={() => setSelection(null)} />;
}
