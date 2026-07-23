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
// The reveal waits this long after timeLeft actually reaches 0 before it
// fires, so "empty" sits on screen for a beat instead of the reveal
// appearing to fire the instant the bar/number hit zero. No longer tied to
// waiting for a CSS transitionend -- the bar's width is now an instant,
// untransitioned snap (see .timer-bar-fill), so the moment timeLeft hits 0
// IS the moment the bar is visually empty; nothing further to wait for
// besides this deliberate pause itself.
const TIMEOUT_REVEAL_DELAY_MS = 100;

/**
 * Yellow warning stage kicks in at roughly the halfway point, red at the
 * final second -- scaled so it's not tuned only for the default 3s case.
 * A pure "halfway" cutoff (duration/2) would never actually show yellow at
 * short durations, since the only ticks below halfway are already claimed
 * by the red "final second" rule (e.g. duration=3's halfway is 1.5, but
 * timeLeft=1 is already red) -- the Math.max(2, ...) floor guarantees at
 * least one genuinely yellow tick even at short durations, while long
 * durations still land close to a true halfway split.
 */
function yellowThresholdFor(duration) {
  return Math.max(2, Math.ceil(duration / 2));
}

/**
 * Long horizontal countdown bar matching the app's pastel-token visual
 * language. The fill's width is a direct, untransitioned derivation of
 * timeLeft/duration -- exactly the same values driving the number below it
 * -- so the bar and number always update in the same render/frame with no
 * possibility of drifting apart (no separate width transition to lag
 * behind the number; see .timer-bar-fill). This also means a fresh
 * question's bar simply shows full immediately with no "filling up"
 * animation, with no special-casing needed for that reset.
 */
function CountdownBar({ timeLeft, duration }) {
  const pct = duration > 0 ? Math.max(0, Math.min(1, timeLeft / duration)) : 0;
  const urgent = timeLeft <= 1;
  const warning = !urgent && timeLeft <= yellowThresholdFor(duration);
  return (
    <div
      className={`timer-bar${urgent ? " urgent" : warning ? " warning" : ""}`}
      role="timer"
      aria-label={`เหลือเวลา ${timeLeft} วินาที`}
    >
      <div className="timer-bar-track">
        <div className="timer-bar-fill" style={{ width: `${pct * 100}%` }} />
      </div>
      {/* Keyed on timeLeft so every tick remounts a fresh node -- CSS
          animations restart on mount, giving a uniform little pulse on
          every single number change (see .timer-bar-number's
          timer-tick-pulse animation) instead of an isolated effect at any
          one specific transition. */}
      <span className="timer-bar-number" key={timeLeft}>
        {timeLeft}
      </span>
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
  const timeoutRevealTimeoutRef = useRef(null);
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
    clearTimeout(timeoutRevealTimeoutRef.current);
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
  };

  useEffect(() => {
    resetForNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleOn]);

  const choose = (opt) => {
    if (answered) return;
    // A genuine tap always wins over any in-flight timeout-reveal grace
    // delay (the learner tapped an option during the brief window after
    // the countdown hit 0 but before the delayed timeout reveal fired):
    // clearing it here (in addition to the countdown effect's own
    // cleanup, which fires on the next render once `answered` flips true)
    // guarantees no late timeout-reveal can land after this.
    clearTimeout(timeoutRevealTimeoutRef.current);
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
  //
  // No artificial delay before starting: investigated a report that the
  // gap after "hear example" finishes felt longer than intended. This app
  // only ever uses the Web Speech API's SpeechSynthesisUtterance for this
  // audio (confirmed in useSpeech.js -- no pre-recorded files, no app-code
  // silence padding anywhere in the speak() path), and it's a well-known,
  // widely-reported cross-browser characteristic of that API that its
  // `onend` event fires with real trailing latency after the audible
  // speech actually stops -- the browser/OS voice engine's own doing, not
  // something this app adds or has visibility into (there's no access to
  // the raw audio waveform from here, only the onend event timing). A
  // deliberate extra buffer on top of that already-unmeasurable delay only
  // compounds it, so this now starts the countdown the instant onend
  // fires, with nothing added.
  const handleExampleAudioEnd = () => {
    if (!timerOnRef.current || countdownStartedRef.current || answeredRef.current) return;
    countdownStartedRef.current = true;
    setTimeLeft(timerDurationRef.current);
    setActiveDuration(timerDurationRef.current);
    setCountdownActive(true);
  };

  const hearExample = () => {
    speak(question.answer.audioText, { onEnd: handleExampleAudioEnd });
  };

  // Duration changes apply from the next countdown-start onward (read via
  // timerDurationRef at the moment handleExampleAudioEnd fires -- still
  // needed even without an artificial delay, since audio playback itself
  // can take a while, so this can fire long after the render where
  // hearExample was tapped) -- not retroactively to an already-ticking
  // countdown. Since a question's countdown can only ever start once
  // (guarded by countdownStartedRef), "next countdown-start" in practice
  // means the next question's first "hear example" tap.
  const adjustTimerDuration = (delta) => {
    setTimerDuration((d) => Math.min(TIMER_MAX_SECONDS, Math.max(TIMER_MIN_SECONDS, d + delta)));
  };

  // Countdown ticking: starts once countdownActive flips true (from
  // handleExampleAudioEnd) and stops -- via this effect's own cleanup --
  // the moment the question becomes answered/finished, or countdownActive
  // is reset for a new question. No lingering interval can ever fire into
  // a question the learner has already left.
  useEffect(() => {
    if (!countdownActive || answered || finished) return;
    const intervalId = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdownActive, answered, finished]);

  // Split from the ticking effect above so the zero-detection isn't inside
  // a useState updater function -- React's Strict Mode can invoke updater
  // functions twice in development to check for purity, which would
  // double-fire side effects (sound, scheduling) if this were called from
  // inside setTimeLeft's callback instead.
  //
  // Reaching 0 doesn't call handleTimeout immediately -- it schedules it
  // after TIMEOUT_REVEAL_DELAY_MS, so "0"/empty sits on screen for a beat
  // before the reveal appears. This used to have to wait for the bar's
  // width transition to genuinely finish (via a transitionend listener),
  // since the bar previously kept visibly animating for up to 0.85s AFTER
  // timeLeft hit 0. Now that the bar's width is an instant, untransitioned
  // derivation of timeLeft (see CountdownBar/.timer-bar-fill), the moment
  // timeLeft hits 0 IS the moment the bar is already visually empty, so a
  // plain fixed delay is correct here -- there's nothing left to wait to
  // "finish". timeLeft only ever transitions TO 0 once per question
  // (subsequent ticks clamp at 0, the same value React already has, so
  // this effect doesn't re-run and schedule a second delayed reveal).
  useEffect(() => {
    if (!countdownActive || answered || finished) return;
    if (timeLeft === 0) {
      clearTimeout(timeoutRevealTimeoutRef.current);
      timeoutRevealTimeoutRef.current = setTimeout(handleTimeout, TIMEOUT_REVEAL_DELAY_MS);
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
            <CountdownBar timeLeft={displayTimeLeft} duration={displayDuration} />
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
