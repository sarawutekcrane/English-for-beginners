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

const TIMER_MIN_SECONDS = 1;
const TIMER_MAX_SECONDS = 10;
const TIMER_DEFAULT_SECONDS = 3;
const TIMER_STEP_SECONDS = 1;
// Countdown starts this long after the "hear example" audio actually
// finishes playing (its real onend event, not a guessed fixed delay from
// tap time) -- keeps the start accurate regardless of the clip's length.
const TIMER_START_DELAY_MS = 100;
// Once the bar has visibly finished animating down to empty (see
// handleZeroTransitionEnd -- driven by the fill's real transitionend
// event, not a guessed duration), the reveal waits this much longer
// before it actually fires, so "empty" sits on screen for a beat instead
// of the reveal appearing to fire the instant the bar finishes.
const TIMEOUT_REVEAL_POST_TRANSITION_DELAY_MS = 100;
// Safety net only, in case the fill's transitionend event never fires for
// some environment-specific reason (backgrounded tab, reduced-motion,
// etc.) -- generously longer than .timer-bar-fill's own 0.85s width
// transition so it never preempts a transitionend that's about to land;
// it exists purely so the reveal can't get stuck forever, not as a second
// source of truth for the timing (handleZeroTransitionEnd is the real
// trigger either way).
const ZERO_TRANSITION_FALLBACK_MS = 1000;

/** Long horizontal countdown bar matching the app's pastel-token visual language. */
function CountdownBar({ timeLeft, duration, onZeroTransitionEnd }) {
  const pct = duration > 0 ? Math.max(0, Math.min(1, timeLeft / duration)) : 0;
  const urgent = timeLeft <= 1;
  // Fires for every width change (each tick shrinks the fill), but only
  // the transition that lands AT zero should ever trigger a reveal --
  // earlier ticks' transitionend events are ignored via the timeLeft===0
  // check.
  const handleFillTransitionEnd = (e) => {
    if (e.propertyName === "width" && timeLeft === 0) onZeroTransitionEnd();
  };
  return (
    <div className={`timer-bar${urgent ? " urgent" : ""}`} role="timer" aria-label={`เหลือเวลา ${timeLeft} วินาที`}>
      <div className="timer-bar-track">
        <div
          className="timer-bar-fill"
          style={{ width: `${pct * 100}%` }}
          onTransitionEnd={handleFillTransitionEnd}
        />
      </div>
      <span className="timer-bar-number">{timeLeft}</span>
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
  // True only once the countdown has actually begun ticking for the
  // current question (after "hear example" finishes + the start delay).
  // Stays true after the question is answered/timed out -- reset back to
  // false only by resetForNewQuestion -- so the display's "has this
  // question's countdown started" check can rely on it alone even once
  // frozen.
  const [countdownActive, setCountdownActive] = useState(false);
  // Snapshot of timerDuration taken at the moment THIS question's countdown
  // actually started. The stepper can still be adjusted while a countdown
  // is running (by design -- changes apply "from the next start onward"),
  // but the ring's percentage must keep dividing by the duration it
  // actually started counting down from, not whatever the stepper
  // currently reads -- otherwise adjusting +/- mid-countdown retroactively
  // warps the ring's fill percentage and the number/ring visibly jump out
  // of sync with each other.
  const [activeDuration, setActiveDuration] = useState(TIMER_DEFAULT_SECONDS);

  const question = useMemo(() => (activeAnswer ? buildQuestion(pool, activeAnswer) : null), [pool, activeAnswer]);

  const isCorrect = question && !timedOut && selectedId === question.answer.id;
  const answered = selectedId !== null || timedOut;
  const finished = session.finished;

  // The countdown display is always visible (Part 2), but only reflects
  // live ticking state once THIS question's countdown has actually
  // started (countdownActive, which stays true through the
  // answered/timed-out freeze -- see its declaration above). Before that
  // -- and whenever the Timer toggle is off entirely -- it just mirrors
  // the currently configured duration, live, so adjusting the stepper is
  // reflected immediately in the waiting/inactive display.
  const countdownStarted = timerOn && countdownActive;
  const displayTimeLeft = countdownStarted ? timeLeft : timerDuration;
  const displayDuration = countdownStarted ? activeDuration : timerDuration;

  // Phase 11: options are now the Thai meanings themselves, so there's no
  // Translation/Phonetic toggle left to gate the post-answer reveal behind
  // -- always show the full English/transliteration/meaning detail once
  // answered, correct or not, so the learner still gets the full picture.
  const effectiveRevealed = revealed || answered;

  // Plain replay with no side effects on the timer -- used for the
  // automatic post-answer/post-timeout pronunciation replay, never for the
  // "hear example" tap itself (that's hearExample below, which wires the
  // countdown-start trigger onto its own onEnd).
  const play = () => speak(question.answer.audioText);

  const speakTimeoutRef = useRef(null);
  const countdownStartTimeoutRef = useRef(null);
  const timeoutRevealTimeoutRef = useRef(null);
  const zeroTransitionFallbackTimeoutRef = useRef(null);
  // Guards handleZeroTransitionEnd against firing twice for the same
  // zero-crossing (the real transitionend event and the fallback timeout
  // could both land) and against firing at all once the learner has
  // manually answered during the grace window between reaching 0 and the
  // reveal actually appearing.
  const zeroTransitionHandledRef = useRef(false);
  // Guards against a replay of "hear example" restarting the countdown --
  // set once the countdown has been triggered for the CURRENT question,
  // reset to false at every question-change reset point below.
  const countdownStartedRef = useRef(false);
  // handleExampleAudioEnd is attached to a specific utterance at tap time,
  // but doesn't actually run until that utterance's audio finishes --
  // possibly several seconds later for a longer clip, during which the
  // learner could toggle the timer off or answer the question outright
  // (nothing disables the answer options while audio is merely playing).
  // Reading these via refs instead of closing over the render-time values
  // means both the immediate check and the delayed one inside the
  // setTimeout below always see the LATEST state, not a stale snapshot
  // from whenever the tap happened.
  const timerOnRef = useRef(timerOn);
  useEffect(() => {
    timerOnRef.current = timerOn;
  }, [timerOn]);

  const answeredRef = useRef(answered);
  useEffect(() => {
    answeredRef.current = answered;
  }, [answered]);

  const timerDurationRef = useRef(timerDuration);
  useEffect(() => {
    timerDurationRef.current = timerDuration;
  }, [timerDuration]);

  const clearAllTimers = () => {
    clearTimeout(speakTimeoutRef.current);
    clearTimeout(countdownStartTimeoutRef.current);
    clearTimeout(timeoutRevealTimeoutRef.current);
    clearTimeout(zeroTransitionFallbackTimeoutRef.current);
  };

  useEffect(() => clearAllTimers, []);

  const resetForNewQuestion = () => {
    setSelectedId(null);
    setRevealed(false);
    setTimedOut(false);
    setCountdownActive(false);
    setTimeLeft(timerDuration);
    setActiveDuration(timerDuration);
    countdownStartedRef.current = false;
    zeroTransitionHandledRef.current = false;
  };

  useEffect(() => {
    resetForNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleOn]);

  const choose = (opt) => {
    if (answered) return;
    // A genuine tap always wins over any in-flight countdown-start delay,
    // or an in-flight timeout-reveal grace delay (the learner tapped an
    // option during the brief window after the countdown hit 0 but before
    // the delayed timeout reveal fired): clearing all of these here (in
    // addition to the countdown effect's own cleanup, which fires on the
    // next render once `answered` flips true) guarantees no late
    // countdown-start or late timeout-reveal can land after this.
    // zeroTransitionHandledRef is also set here, not just cleared via
    // resetForNewQuestion, since the bar's already-in-flight CSS
    // transition can still fire its real transitionend event after this
    // point (browsers don't cancel an in-progress transition just because
    // a React handler ran) -- without this, that late event would still
    // schedule a spurious handleTimeout after the learner already
    // answered manually.
    clearTimeout(countdownStartTimeoutRef.current);
    clearTimeout(timeoutRevealTimeoutRef.current);
    clearTimeout(zeroTransitionFallbackTimeoutRef.current);
    zeroTransitionHandledRef.current = true;
    setSelectedId(opt.id);
    if (opt.id === question.answer.id) playCorrect();
    else playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(play, 500);
  };

  const next = () => {
    clearAllTimers();
    session.submit(isCorrect);
    resetForNewQuestion();
  };

  const restart = () => {
    clearAllTimers();
    session.restart();
    resetForNewQuestion();
  };

  const retryWrongOnly = () => {
    clearAllTimers();
    session.retryWrongOnly();
    resetForNewQuestion();
  };

  // Fires when the countdown reaches zero without an answer. Reuses the
  // exact same incorrect-answer path a manual wrong tap already uses
  // (playIncorrect, then speak the correct pronunciation after the
  // module's established 500ms pacing) so this feeds into
  // useSinglePassSession's normal submit()/wrongItems tracking via next()
  // -- not a separate scoring path. `timedOut` flips `answered` to true the
  // same way a manual selection does, so the reveal and the existing
  // "ข้อถัดไป →" button appear and simply wait for a manual tap -- no
  // auto-advance here, matching a manual wrong answer exactly.
  const handleTimeout = () => {
    setTimedOut(true);
    playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(play, 500);
  };

  // Fires on every "hear example" tap's audio-end event, but only the
  // FIRST one (per question) actually starts the countdown -- every
  // subsequent replay while the countdown is already running (or already
  // finished) is a no-op here, matching the deliberate design requirement
  // that replaying audio can't be used to reset/extend thinking time.
  const handleExampleAudioEnd = () => {
    if (!timerOnRef.current || countdownStartedRef.current || answeredRef.current) return;
    countdownStartedRef.current = true;
    clearTimeout(countdownStartTimeoutRef.current);
    countdownStartTimeoutRef.current = setTimeout(() => {
      // Re-check at fire time too: the learner could have answered during
      // this short extra delay window.
      if (answeredRef.current) return;
      setTimeLeft(timerDurationRef.current);
      setActiveDuration(timerDurationRef.current);
      setCountdownActive(true);
    }, TIMER_START_DELAY_MS);
  };

  const hearExample = () => {
    speak(question.answer.audioText, { onEnd: handleExampleAudioEnd });
  };

  // Duration changes apply from the next countdown-start onward (read via
  // timerDurationRef at the moment handleExampleAudioEnd's delayed
  // callback fires) -- not retroactively to an already-ticking countdown.
  // Since a question's countdown can only ever start once (guarded by
  // countdownStartedRef), "next countdown-start" in practice means the
  // next question's first "hear example" tap.
  const adjustTimerDuration = (delta) => {
    setTimerDuration((d) => Math.min(TIMER_MAX_SECONDS, Math.max(TIMER_MIN_SECONDS, d + delta)));
  };

  // Countdown ticking: starts once countdownActive flips true (from
  // handleExampleAudioEnd's delayed callback) and stops -- via this
  // effect's own cleanup -- the moment the question becomes
  // answered/finished, or countdownActive is reset for a new question. No
  // lingering interval can ever fire into a question the learner has
  // already left.
  useEffect(() => {
    if (!countdownActive || answered || finished) return;
    const intervalId = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdownActive, answered, finished]);

  // The single trigger for the actual reveal once the bar has visibly
  // finished animating down to empty -- called from CountdownBar's real
  // transitionend event (the primary path) or the fallback timeout below
  // (only if that event never fires). Guarded so it only ever schedules
  // handleTimeout once per zero-crossing, and never after the learner has
  // already answered manually during the grace window.
  const handleZeroTransitionEnd = () => {
    if (zeroTransitionHandledRef.current || answeredRef.current) return;
    zeroTransitionHandledRef.current = true;
    clearTimeout(zeroTransitionFallbackTimeoutRef.current);
    clearTimeout(timeoutRevealTimeoutRef.current);
    timeoutRevealTimeoutRef.current = setTimeout(handleTimeout, TIMEOUT_REVEAL_POST_TRANSITION_DELAY_MS);
  };

  // Split from the ticking effect above so the zero-detection isn't inside
  // a useState updater function -- React's Strict Mode can invoke updater
  // functions twice in development to check for purity, which would
  // double-fire side effects (sound, scheduling) if this were called from
  // inside setTimeLeft's callback instead.
  //
  // Reaching 0 does NOT call handleTimeout directly, and does NOT schedule
  // it on a fixed guessed delay either -- both of those would let the
  // reveal fire before the bar has visibly finished shrinking to empty
  // (its width transition alone takes 0.85s, well longer than any small
  // fixed delay). Instead this only arms a generous fallback timeout;
  // the REAL trigger is CountdownBar's transitionend event calling
  // handleZeroTransitionEnd once the bar has actually finished animating.
  // timeLeft only ever transitions TO 0 once per question (subsequent
  // ticks clamp at 0, the same value React already has, so this effect
  // doesn't re-run and re-arm a second fallback).
  useEffect(() => {
    if (!countdownActive || answered || finished) return;
    if (timeLeft === 0) {
      zeroTransitionHandledRef.current = false;
      clearTimeout(zeroTransitionFallbackTimeoutRef.current);
      zeroTransitionFallbackTimeoutRef.current = setTimeout(handleZeroTransitionEnd, ZERO_TRANSITION_FALLBACK_MS);
    }
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
      </div>

      {/* Own row directly below the toggle switches and above the blue
          card -- a standalone settings row, not nested inside the toggle
          pill group or the card. Always rendered, timer toggle on or off,
          so flipping the toggle never shifts the card below it -- same
          always-reserved principle as the countdown display inside the
          card, just applied to this row too. Also lets the learner
          pre-configure their preferred duration before ever turning the
          timer on. */}
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
          <button className="btn btn-round btn-blue" onClick={hearExample} aria-label="เล่นเสียง">
            🔊
          </button>

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

          {/* Always visible/reserved, timer toggle on or off, so nothing
              above (the options grid) or below (feedback/reveal) ever
              shifts position when the toggle is flipped or the countdown
              starts/stops. Rendered below the options grid specifically so
              a learner tapping quickly can never have an answer button
              move out from under their finger.

              While the timer is off (or a question's countdown hasn't
              started yet), it's a static, non-counting display of the
              currently configured duration. Once a countdown starts, it
              ticks live; once the learner answers early or times out, it
              freezes at whatever value it last showed (countdownActive
              stays true through that freeze -- see its declaration above)
              and only resets, to the current configured duration, when
              resetForNewQuestion runs for the next question. */}
          <div className="timer-slot">
            <CountdownBar
              timeLeft={displayTimeLeft}
              duration={displayDuration}
              onZeroTransitionEnd={handleZeroTransitionEnd}
            />
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
