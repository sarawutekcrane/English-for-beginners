import { useEffect, useMemo, useRef, useState } from "react";
import Illustration from "../illustrations";
import Toggle from "../components/Toggle";
import AnnotatedText from "../components/AnnotatedText";
import InAppBrowserNotice from "../components/InAppBrowserNotice";
import VocabGroupPicker from "../components/VocabGroupPicker";
import { useSpeak, useSpeechRecognition, matchesEnglish } from "../hooks/useSpeech";
import { useSwipeBack } from "../hooks/useSwipeBack";
import { VOCAB_CATEGORIES, getVocab, toCard } from "../utils/content";
import { playCorrect, playIncorrect } from "../utils/sound";
import { useSinglePassSession } from "../utils/reviewQueue";

const NUMERIC_ONLY = /^\d+$/;

function CategoryPicker({ group, onPick, onBack }) {
  useSwipeBack(onBack);
  const categories = VOCAB_CATEGORIES.filter((c) => c.group === group.id);
  return (
    <div className="picker">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดคำศัพท์
      </button>
      <section className="picker-section">
        <h3 className="picker-heading">
          {group.emoji} {group.label} · เลือกหมวดคำศัพท์เพื่อฝึกพูด
        </h3>
        <div className="category-grid">
          {categories.map((c) => (
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

const STATUS = {
  idle: "idle",
  requesting: "requesting",
  listening: "listening",
  match: "match",
  nomatch: "nomatch",
  error: "error",
};

// Investigation note (mic-flicker report): a TTS/mic-overlap guard was
// added here to address a "we heard: Play" hypothesis, gating the mic
// button's `disabled` on a second state (`speaking`, plus a follow-up
// `ttsCooldown` timer set from a `useEffect` reacting to it) alongside
// the recognition hook's own `listening` state. That guard is what
// caused a separate, confirmed bug: `ttsCooldown` was set one render
// cycle *after* `speaking` flipped back to false (React runs passive
// effects after paint), so there was a genuine, observable render where
// `disabled` evaluated false (button enabled) sandwiched between two
// `true` renders -- a real disabled -> enabled -> disabled flicker,
// verified via direct state-transition logging, not merely suspected.
// No `recognition.start()` call was ever involved in that flicker (mic
// activation stays 100% tap-initiated -- see useSpeech.js, only one call
// site, reachable only from this component's `record()` onClick handler).
// The reference "Japanese for Beginners" app (a known-working
// implementation of this same module) never had this second state at
// all: its mic button's disabled condition is `!supported || listening`,
// full stop -- a single source of truth driven only by the recognition
// object's own onstart/onend. Removed the guard here to match that
// structure instead of patching the timing gap, since the simpler
// single-state design can't reproduce this bug class by construction.
//
// Follow-up (confirmed live: mic flickers during "hear example" AND the
// post-answer reveal audio; recognized transcripts unrelated to what was
// said, e.g. "red" -> "black"/"play"): re-checked the Japanese reference
// app again, specifically for a shared TTS-active gate this time. It has
// NONE -- its mic `disabled` is `!supported || listening`, same as here,
// and nothing in its `record()`/`hearExample()` ever checks `speaking`.
// So this isn't a porting regression or a divergence from the reference;
// it's a real gap present in BOTH apps' architecture that the earlier fix
// correctly left alone (removing the flicker-causing second state was
// still right) but didn't address: nothing stopped `recognition.start()`
// firing while TTS audio was still audible (a fast tap on this button
// while `hearExample`'s or the reveal's speech was still playing), which
// lets the mic pick up the device's own TTS output -- a textbook feedback
// loop, and a much better explanation for "red" transcribing as an
// unrelated word than generic recognizer inaccuracy. Fixed independently
// (no reference structure to port here) with a synchronous guard in
// useSpeech.js's start() against the browser's own live
// `speechSynthesis.speaking`, mirrored here for early-exit + UX, plus
// disabling "hear example" while the mic is active so TTS can't play into
// a live recognition either. The mic button's disabled/pressed appearance
// still comes only from `listening`/`status` (recognition's own events),
// per the same single-source-of-truth principle -- `speaking` is added to
// `disabled` only (grays the button out), never to any "active/pressed"
// look, and is read directly with no derived second state, so it can't
// reproduce the earlier two-hop `ttsCooldown` timing bug.
function SpeakingView({ category, onBack }) {
  const { speak, speaking, primeSpeechEngine } = useSpeak();
  const { supported, listening, start } = useSpeechRecognition();
  useSwipeBack(onBack);

  const [shuffleOn, setShuffleOn] = useState(false);
  const baseCards = useMemo(() => getVocab(category.id).map(toCard), [category]);
  const session = useSinglePassSession(baseCards, shuffleOn);
  const [status, setStatus] = useState(STATUS.idle);
  const [errorType, setErrorType] = useState(null);
  const [heard, setHeard] = useState("");
  const [showThai, setShowThai] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);

  useEffect(() => {
    setStatus(STATUS.idle);
    setHeard("");
  }, [category, shuffleOn]);

  const finished = session.finished;
  const card = session.current;

  // Chrome's speech recognition sometimes transcribes spoken number words
  // (e.g. "three") as bare Arabic numerals (e.g. "3"). This maps each
  // number card's numeric value back to its word form, for both matching
  // and the "we heard" display, so a digit never appears unexpectedly.
  // No-op for categories with no numeric vocabulary (value stays undefined).
  const numberWordMap = useMemo(() => {
    const map = {};
    for (const c of baseCards) {
      if (c.value != null) map[c.value] = c.answerText;
    }
    return map;
  }, [baseCards]);

  // Guarded (not just visually disabled below) so TTS can never play into
  // a live recognition attempt -- see the feedback-loop investigation note
  // above this component.
  const hearExample = () => {
    if (listening || status === STATUS.requesting) return;
    speak(card.audioText);
  };

  const speakTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(speakTimeoutRef.current), []);

  const record = () => {
    // Defensive guard against rapid repeated taps: the mic button is also
    // `disabled` while requesting/listening (see the `disabled` prop
    // below), but that only takes effect after a re-render, so a very fast
    // double-tap can still fire this handler twice before the first
    // re-render lands. Checking `status` here (set synchronously below,
    // read on the very next call) closes that window; the recognition hook
    // itself also aborts any in-flight instance before starting a new one
    // as a second line of defense.
    if (listening || status === STATUS.requesting) return;
    // Mirrors the synchronous guard inside useSpeech.js's start() (the
    // actual airtight enforcement point) so a blocked tap here fails fast
    // with a clear message instead of round-tripping through start() first.
    if (typeof window !== "undefined" && window.speechSynthesis?.speaking) {
      setErrorType("tts-active");
      setStatus(STATUS.error);
      return;
    }
    // Bug fix: if "hear example" is never tapped, the reveal audio after
    // this attempt (fired later, async, from the recognition result
    // handler below) was the first speechSynthesis call of the session --
    // some browsers silently drop that first call unless it's triggered
    // directly inside a synchronous user gesture. This tap is one, so
    // priming here unlocks the engine the same way tapping "hear example"
    // already did, regardless of whether the learner ever tapped it.
    primeSpeechEngine();
    // "requesting" (not "listening") until the recognizer's own onstart
    // fires -- getting the mic permission prompt resolved and the
    // recognizer actually capturing audio can take a perceptible moment,
    // and showing "listening" before that was genuinely true is what made
    // an early failure feel like it fired "instantly": the user believed
    // they'd already had their chance to speak.
    setStatus(STATUS.requesting);
    setErrorType(null);
    setHeard("");
    clearTimeout(speakTimeoutRef.current);
    start({
      onStart: () => setStatus(STATUS.listening),
      onResult: (transcript, alternatives = [transcript]) => {
        const numericAlt = alternatives.find((alt) => NUMERIC_ONLY.test(alt.trim()));
        const numericValue = numericAlt != null ? parseInt(numericAlt, 10) : null;

        const displayText =
          numericValue != null && numberWordMap[numericValue] ? numberWordMap[numericValue] : transcript;
        setHeard(displayText);

        // Phase 10 fix: judge the match against the SAME text shown as "we
        // heard" (displayText), never against a lower-ranked recognizer
        // alternative the learner never sees. The old code checked
        // `alternatives.some(...)` across all 5 recognizer guesses while
        // only ever displaying the top one -- so if the top/displayed guess
        // was a completely different word but a lower-ranked alternative
        // happened to equal the target, the attempt was marked correct
        // while showing the wrong "heard" word. That's exactly what
        // real-device testing reproduced for "Five" (displayed "fight") and
        // "Four" (displayed "fall"). Numbers also skip the substring
        // fallback (allowContains: false) since "four" is a literal
        // substring of "fourteen" -- both real, separately graded entries.
        const ok =
          matchesEnglish(displayText, card.answerText, { allowContains: card.value == null }) ||
          (card.value != null && numericValue === card.value);
        setStatus(ok ? STATUS.match : STATUS.nomatch);
        if (ok) playCorrect();
        else playIncorrect();
        // Replay the target pronunciation after every attempt -- match or
        // not -- so the learner always hears the model pronunciation.
        speakTimeoutRef.current = setTimeout(() => {
          speak(card.audioText);
        }, 500);
      },
      // Bug 4(b) fix: surface which error actually happened instead of
      // collapsing every failure into one generic "didn't hear you"
      // message -- a denied mic permission needs a completely different
      // instruction (grant permission) than genuine silence or a timeout.
      onError: (type) => {
        setErrorType(type);
        setStatus(STATUS.error);
      },
    });
  };

  const retry = () => {
    setStatus(STATUS.idle);
    setErrorType(null);
    setHeard("");
  };

  const ERROR_MESSAGES = {
    "not-allowed": "กรุณาอนุญาตให้เว็บไซต์นี้ใช้ไมโครโฟน แล้วลองใหม่อีกครั้ง",
    "permission-denied": "กรุณาอนุญาตให้เว็บไซต์นี้ใช้ไมโครโฟน แล้วลองใหม่อีกครั้ง",
    "no-speech": "ไม่ได้ยินเสียงพูด กรุณาลองพูดอีกครั้ง",
    timeout: "ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง",
    "audio-capture": "ไม่พบไมโครโฟน กรุณาตรวจสอบอุปกรณ์แล้วลองใหม่อีกครั้ง",
    network: "การเชื่อมต่อมีปัญหา กรุณาลองใหม่อีกครั้ง",
    "tts-active": "กรุณารอให้เสียงตัวอย่างเล่นจบก่อน แล้วลองใหม่อีกครั้ง",
  };
  const errorMessage = ERROR_MESSAGES[errorType] || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";

  const next = () => {
    clearTimeout(speakTimeoutRef.current);
    session.submit(status === STATUS.match);
    setStatus(STATUS.idle);
    setHeard("");
  };

  const restart = () => {
    session.restart();
    setStatus(STATUS.idle);
    setHeard("");
  };

  const retryWrongOnly = () => {
    session.retryWrongOnly();
    setStatus(STATUS.idle);
    setHeard("");
  };

  // Auto-reveal translation/phonetic on a correct (matched) attempt, as if
  // the toggles below were switched on.
  const effectiveShowPhonetic = showPhonetic || status === STATUS.match;
  const effectiveShowThai = showThai || status === STATUS.match;

  return (
    <div className="speaking-view">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <p className="progress-label th-text">
        {category.label} · ทำไปแล้ว {session.score.total}/{session.total} ข้อ · คะแนน {session.score.correct}/
        {session.total}
      </p>

      <div className="toggle-group">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="แปล" checked={showThai} onChange={setShowThai} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="speaking-card">
          {session.wrongCount === 0 ? (
            <>
              <p className="th-text session-complete-text">เก่งมาก! คุณฝึกพูดครบทุกคำในหมวดนี้แล้ว 🎉📘</p>
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
        <div className="speaking-card">
          <div className="flashcard-illustration">
            <Illustration item={card} />
          </div>

          <AnnotatedText as="p" className="flashcard-text en-text" plain={card.display} segments={card.segments} />
          {card.partOfSpeech && <p className="verb-group en-text">{card.partOfSpeech}</p>}

          <button
            className="btn btn-outline btn-sm"
            onClick={hearExample}
            disabled={listening || status === STATUS.requesting}
          >
            🔊 ฟังตัวอย่างเสียง
          </button>

          {!supported && (
            <p className="speaking-note th-text">
              เบราว์เซอร์นี้ไม่รองรับการรู้จำเสียงพูด กรุณาลองใช้ Google Chrome บนคอมพิวเตอร์
            </p>
          )}

          <button
            className="btn btn-round"
            disabled={!supported || listening || status === STATUS.requesting || speaking}
            onClick={record}
            aria-label="พูดออกเสียง"
          >
            🎤
          </button>

          {status === STATUS.requesting && <p className="th-text">กำลังขอสิทธิ์ใช้ไมโครโฟน...</p>}
          {status === STATUS.listening && <p className="th-text">กำลังฟัง... พูดคำศัพท์ได้เลย</p>}

          {status === STATUS.match && (
            <div className="speaking-feedback">
              <p className="quiz-feedback feedback-correct th-text">เยี่ยมมาก! ออกเสียงตรงกันเลย 🎉</p>
              {heard && <p className="th-text speaking-heard">ระบบได้ยินว่า: "{heard}"</p>}
            </div>
          )}
          {status === STATUS.nomatch && (
            <div className="speaking-feedback">
              <p className="quiz-feedback feedback-incorrect th-text">ยังไม่ตรงนะ ลองอีกครั้ง 💪</p>
              {heard && <p className="th-text speaking-heard">ระบบได้ยินว่า: "{heard}"</p>}
            </div>
          )}
          {status === STATUS.error && <p className="th-text speaking-heard">{errorMessage}</p>}

          {(status === STATUS.nomatch || status === STATUS.error) && (
            <button className="btn btn-outline btn-sm" onClick={retry}>
              🔁 ลองอีกครั้ง
            </button>
          )}

          {effectiveShowPhonetic && <p className="flashcard-romaji">{card.reading}</p>}
          {effectiveShowThai && <p className="flashcard-thai th-text">{card.thai}</p>}

          <div className="quiz-actions">
            <button className="btn btn-success btn-sm" onClick={next}>
              คำถัดไป →
            </button>
          </div>
        </div>
      )}

      <p className="speaking-disclaimer th-text">
        💡 ฟีเจอร์นี้ทำงานได้ดีที่สุดบน <strong>Google Chrome บนคอมพิวเตอร์</strong> และเป็นเพียงการตรวจสอบคร่าวๆ
        ไม่ใช่การประเมินสำเนียงหรือการออกเสียงที่แม่นยำ
      </p>
    </div>
  );
}

export default function SpeakingPractice() {
  const [group, setGroup] = useState(null);
  const [category, setCategory] = useState(null);

  return (
    <>
      <InAppBrowserNotice />
      {!group ? (
        <VocabGroupPicker onPick={setGroup} />
      ) : !category ? (
        <CategoryPicker group={group} onPick={setCategory} onBack={() => setGroup(null)} />
      ) : (
        <SpeakingView category={category} onBack={() => setCategory(null)} />
      )}
    </>
  );
}
