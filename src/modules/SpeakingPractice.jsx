import { useEffect, useMemo, useRef, useState } from "react";
import Illustration from "../illustrations";
import Toggle from "../components/Toggle";
import AnnotatedText from "../components/AnnotatedText";
import { useSpeak, useSpeechRecognition, matchesEnglish } from "../hooks/useSpeech";
import { VOCAB_CATEGORIES, getVocab, toCard } from "../utils/content";
import { playCorrect, playIncorrect } from "../utils/sound";
import { useReviewQueue } from "../utils/reviewQueue";

const NUMERIC_ONLY = /^\d+$/;
const EMPTY = [];

function CategoryPicker({ onPick }) {
  return (
    <div className="picker">
      <section className="picker-section">
        <h3 className="picker-heading">📚 เลือกหมวดคำศัพท์เพื่อฝึกพูด</h3>
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

const STATUS = { idle: "idle", listening: "listening", match: "match", nomatch: "nomatch", error: "error" };

function SpeakingView({ category, onBack }) {
  const { speak } = useSpeak();
  const { supported, listening, start } = useSpeechRecognition();

  const [shuffleOn, setShuffleOn] = useState(false);
  const baseCards = useMemo(() => getVocab(category.id).map(toCard), [category]);
  const review = useReviewQueue(shuffleOn ? baseCards : EMPTY);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState(STATUS.idle);
  const [errorType, setErrorType] = useState(null);
  const [heard, setHeard] = useState("");
  const [showThai, setShowThai] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);

  useEffect(() => {
    setIndex(0);
    setStatus(STATUS.idle);
    setHeard("");
  }, [category, shuffleOn]);

  const finished = shuffleOn && review.finished;
  const card = shuffleOn ? review.current : baseCards[index % baseCards.length];

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

  const hearExample = () => speak(card.audioText);

  const speakTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(speakTimeoutRef.current), []);

  const record = () => {
    // Defensive guard against rapid repeated taps: the mic button is also
    // `disabled` while listening, but that only takes effect after a
    // re-render, so a very fast double-tap can still fire this handler
    // twice before `listening` flips to true. useSpeechRecognition.start()
    // already aborts any in-flight recognition before starting a new one,
    // but bailing out here avoids resetting status/heard mid-listen too.
    if (listening) return;
    setStatus(STATUS.listening);
    setErrorType(null);
    setHeard("");
    clearTimeout(speakTimeoutRef.current);
    start({
      onResult: (transcript, alternatives = [transcript]) => {
        const numericAlt = alternatives.find((alt) => NUMERIC_ONLY.test(alt.trim()));
        const numericValue = numericAlt != null ? parseInt(numericAlt, 10) : null;

        const displayText =
          numericValue != null && numberWordMap[numericValue] ? numberWordMap[numericValue] : transcript;
        setHeard(displayText);

        const ok =
          alternatives.some((alt) => matchesEnglish(alt, card.answerText)) ||
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
  };
  const errorMessage = ERROR_MESSAGES[errorType] || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";

  const next = () => {
    clearTimeout(speakTimeoutRef.current);
    if (shuffleOn) review.submit(status === STATUS.match);
    else setIndex((i) => (i + 1) % baseCards.length);
    setStatus(STATUS.idle);
    setHeard("");
  };

  const restart = () => {
    review.restart();
    setIndex(0);
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
        {category.label} ·{" "}
        {shuffleOn
          ? `ตอบถูกครบแล้ว ${review.totalCount - review.remainingCount} / ${review.totalCount}`
          : `${index + 1} / ${baseCards.length}`}
      </p>

      <div className="toggle-group">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="แปล" checked={showThai} onChange={setShowThai} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="speaking-card">
          <p className="th-text session-complete-text">เก่งมาก! คุณฝึกพูดครบทุกคำในหมวดนี้แล้ว 🎉📘</p>
          <button className="btn btn-success btn-sm" onClick={restart}>
            🔁 เริ่มรอบใหม่ (สุ่มใหม่)
          </button>
        </div>
      ) : (
        <div className="speaking-card">
          <div className="flashcard-illustration">
            <Illustration item={card} />
          </div>

          <AnnotatedText as="p" className="flashcard-text en-text" plain={card.display} segments={card.segments} />

          <button className="btn btn-outline btn-sm" onClick={hearExample}>
            🔊 ฟังตัวอย่างเสียง
          </button>

          {!supported && (
            <p className="speaking-note th-text">
              เบราว์เซอร์นี้ไม่รองรับการรู้จำเสียงพูด กรุณาลองใช้ Google Chrome บนคอมพิวเตอร์
            </p>
          )}

          <button className="btn btn-round" disabled={!supported || listening} onClick={record} aria-label="พูดออกเสียง">
            🎤
          </button>

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
  const [category, setCategory] = useState(null);

  if (!category) return <CategoryPicker onPick={setCategory} />;
  return <SpeakingView category={category} onBack={() => setCategory(null)} />;
}
