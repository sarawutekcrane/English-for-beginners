import { useEffect, useMemo, useRef, useState } from "react";
import Toggle from "../../components/Toggle";
import AnnotatedText from "../../components/AnnotatedText";
import { useSpeak } from "../../hooks/useSpeech";
import { shuffle } from "../../utils/content";
import { playCorrect, playIncorrect } from "../../utils/sound";
import { useSinglePassSession } from "../../utils/reviewQueue";

// `makeItems` only ever reads each chunk's OWN `phonetic` field -- never
// the question-level `phonetic`/`correctOrder` (the assembled full
// sentence). Keeping these two data shapes separate in the schema, and
// only ever touching the chunk-level one here, is what prevents a
// "romaji-leak": the chunk pool/pills must never be able to spoil the full
// sentence or its correct order before the learner submits.
function makeItems(chunks) {
  return shuffle(chunks.map((chunk, i) => ({ key: `${i}-${chunk.text}`, text: chunk.text, phonetic: chunk.phonetic })));
}

// Hold a placed chunk this long before it "lifts" into drag-to-reorder mode.
// Below this threshold, release-without-holding falls through to the classic tap-to-remove behavior.
const LONG_PRESS_MS = 350;
// Movement past this radius before the long-press timer fires cancels the gesture entirely
// (treated as neither a tap nor a drag), so a slightly-off tap never accidentally starts a drag.
const MOVE_CANCEL_PX = 10;

function arrayMove(arr, from, to) {
  const copy = arr.slice();
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

export default function WordOrderPractice({ pattern, onBack }) {
  const { speak } = useSpeak();
  const [shuffleOn, setShuffleOn] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);

  const baseQuestions = useMemo(() => pattern.wordOrderQuestions, [pattern]);
  const session = useSinglePassSession(baseQuestions, shuffleOn);
  const finished = session.finished;
  const question = session.current;

  const [poolItems, setPoolItems] = useState(() => (question ? makeItems(question.chunks) : []));
  const [answerItems, setAnswerItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggingKey, setDraggingKey] = useState(null);

  useEffect(() => {
    if (!question) return;
    setPoolItems(makeItems(question.chunks));
    setAnswerItems([]);
    setSubmitted(false);
    setDraggingKey(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const submittedRef = useRef(submitted);
  useEffect(() => {
    submittedRef.current = submitted;
  }, [submitted]);

  const tapPool = (item) => {
    if (submitted) return;
    setPoolItems((p) => p.filter((x) => x.key !== item.key));
    setAnswerItems((a) => [...a, item]);
  };

  const tapAnswer = (item) => {
    if (submitted) return;
    setAnswerItems((a) => a.filter((x) => x.key !== item.key));
    setPoolItems((p) => [...p, item]);
  };

  // ---- long-press-then-drag reordering within the answer slot ----
  // Quick tap-and-release still removes a chunk (tapAnswer above, unchanged).
  // Press-and-hold past LONG_PRESS_MS "lifts" the chunk so it can be dragged to a new position.
  const chunkNodeRefs = useRef({});
  const gestureRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const registerChunkNode = (key) => (node) => {
    if (node) chunkNodeRefs.current[key] = node;
    else delete chunkNodeRefs.current[key];
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const findHoverKey = (draggedKey, clientX, clientY) => {
    for (const [key, node] of Object.entries(chunkNodeRefs.current)) {
      if (key === draggedKey || !node) continue;
      const rect = node.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return key;
      }
    }
    return null;
  };

  const startGesture = (key, clientX, clientY) => {
    if (submittedRef.current) return;
    clearLongPressTimer();
    gestureRef.current = { key, startX: clientX, startY: clientY, longPressed: false, cancelled: false };
    longPressTimerRef.current = setTimeout(() => {
      const g = gestureRef.current;
      if (g && g.key === key && !g.cancelled) {
        g.longPressed = true;
        setDraggingKey(key);
      }
    }, LONG_PRESS_MS);
  };

  // Returns true while a drag is actively in progress (used to decide whether to preventDefault on touch).
  const moveGesture = (clientX, clientY) => {
    const g = gestureRef.current;
    if (!g || g.cancelled) return false;
    if (!g.longPressed) {
      const dist = Math.hypot(clientX - g.startX, clientY - g.startY);
      if (dist > MOVE_CANCEL_PX) {
        g.cancelled = true;
        clearLongPressTimer();
      }
      return false;
    }
    const hoverKey = findHoverKey(g.key, clientX, clientY);
    if (hoverKey) {
      setAnswerItems((items) => {
        const from = items.findIndex((it) => it.key === g.key);
        const to = items.findIndex((it) => it.key === hoverKey);
        if (from === -1 || to === -1 || from === to) return items;
        return arrayMove(items, from, to);
      });
    }
    return true;
  };

  const endGesture = (allowTapFallback) => {
    const g = gestureRef.current;
    clearLongPressTimer();
    gestureRef.current = null;
    setDraggingKey(null);
    if (allowTapFallback && g && !g.longPressed && !g.cancelled) {
      const item = answerItems.find((it) => it.key === g.key);
      if (item) tapAnswer(item);
    }
  };

  useEffect(() => () => clearLongPressTimer(), []);

  // All touch handling is wired via native (non-passive) listeners rather than React's synthetic
  // onTouchStart/onTouchMove/onTouchEnd props, for two reasons: (1) preventDefault must reliably work
  // on touchmove to suppress page scroll mid-drag, which passive-by-default synthetic handlers can't
  // guarantee, and (2) preventDefault on touchstart/touchend suppresses the browser's synthetic
  // mouse-compatibility events (mousedown/mouseup/click) that otherwise fire after a touch gesture and
  // would double-trigger the separate mouse handling below.
  // A ref-callback (with React 19's cleanup-function return) is used instead of useEffect so it
  // re-attaches correctly if the answer-slot element itself is ever unmounted and remounted
  // (e.g. finishing a session and then retrying the wrong answers).
  const answerSlotCallbackRef = (node) => {
    if (!node) return undefined;
    const findChunkKey = (target) => target.closest?.("[data-chunk-key]")?.getAttribute("data-chunk-key");

    const onTouchStart = (e) => {
      const key = findChunkKey(e.target);
      if (!key) return;
      e.preventDefault();
      const t = e.touches[0];
      startGesture(key, t.clientX, t.clientY);
    };
    const onTouchMove = (e) => {
      if (!gestureRef.current) return;
      const t = e.touches[0];
      const dragging = moveGesture(t.clientX, t.clientY);
      if (dragging) e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (gestureRef.current) e.preventDefault();
      endGesture(true);
    };
    const onTouchCancel = (e) => {
      if (gestureRef.current) e.preventDefault();
      endGesture(false);
    };

    node.addEventListener("touchstart", onTouchStart, { passive: false });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd, { passive: false });
    node.addEventListener("touchcancel", onTouchCancel, { passive: false });
    return () => {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
      node.removeEventListener("touchcancel", onTouchCancel);
    };
  };

  const handleAnswerMouseDown = (e) => {
    const key = e.target.closest?.("[data-chunk-key]")?.getAttribute("data-chunk-key");
    if (!key) return;
    startGesture(key, e.clientX, e.clientY);

    const onMouseMove = (ev) => moveGesture(ev.clientX, ev.clientY);
    const onMouseUp = () => {
      endGesture(true);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleAnswerKeyDown = (item) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tapAnswer(item);
    }
  };

  const speakTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(speakTimeoutRef.current), []);

  const submit = () => {
    const userOrder = answerItems.map((a) => a.text);
    const correct = JSON.stringify(userOrder) === JSON.stringify(question.correctOrder);
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) playCorrect();
    else playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(() => {
      speak(question.correctOrder.join(" "));
    }, 500);
  };

  const next = () => {
    clearTimeout(speakTimeoutRef.current);
    session.submit(isCorrect);
  };

  const restart = () => {
    session.restart();
  };

  const retryWrongOnly = () => {
    session.retryWrongOnly();
  };

  const playCorrectSentence = () => speak(question.correctOrder.join(" "));

  return (
    <div className="practice-view">
      <div className="practice-topbar">
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          ← เปลี่ยนแพทเทิร์น
        </button>
        <h3 className="pattern-detail-title">
          <span className="en-text">
            {pattern.order}. {pattern.title}
          </span>
          <span className="pattern-detail-title-th th-text">{pattern.titleTh}</span>
        </h3>
        <p className="progress-label th-text">
          ทำไปแล้ว {session.score.total}/{session.total} ข้อ · คะแนน {session.score.correct}/{session.total}
        </p>
      </div>

      <div className="toggle-group">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="practice-card">
          {session.wrongCount === 0 ? (
            <>
              <p className="th-text session-complete-text">เก่งมาก! คุณเรียงประโยคถูกครบทุกข้อในชุดนี้แล้ว 🎉📘</p>
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
        <div className="practice-card">
          <p className="th-text word-order-prompt">{question.promptThai}</p>

          <div className="answer-slot" ref={answerSlotCallbackRef} onMouseDown={handleAnswerMouseDown}>
            {answerItems.length === 0 && <span className="answer-slot-hint th-text">แตะคำด้านล่างตามลำดับ</span>}
            {answerItems.map((item) => (
              <button
                key={item.key}
                data-chunk-key={item.key}
                ref={registerChunkNode(item.key)}
                className={`chunk-pill placed en-text${draggingKey === item.key ? " dragging" : ""}`}
                onKeyDown={handleAnswerKeyDown(item)}
                disabled={submitted}
              >
                {item.text}
                {showPhonetic && <span className="chunk-romaji-hint">{item.phonetic}</span>}
              </button>
            ))}
          </div>

          <div className="chunk-pool">
            {poolItems.map((item) => (
              <button key={item.key} className="chunk-pill en-text" onClick={() => tapPool(item)} disabled={submitted}>
                {item.text}
                {showPhonetic && <span className="chunk-romaji-hint">{item.phonetic}</span>}
              </button>
            ))}
          </div>

          {!submitted ? (
            // Phase 11: the pool can now hold extra wrong-verb-form
            // distractor chunks that are never meant to be placed (e.g.
            // "have" alongside the correct "has"), so "pool empty" is no
            // longer the right enable condition -- the answer slot just
            // needs to hold exactly as many chunks as the correct sentence.
            <button
              className="btn btn-success"
              onClick={submit}
              disabled={answerItems.length !== question.correctOrder.length}
            >
              ตรวจคำตอบ
            </button>
          ) : (
            <>
              <p className={`quiz-feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"} th-text`}>
                {isCorrect ? "เก่งมาก! เรียงถูกต้อง 🎉" : "ยังไม่ถูกนะ ลองดูเฉลยด้านล่าง 💪"}
              </p>
              <div className="quiz-reveal">
                <AnnotatedText as="p" className="en-text" plain={question.correctOrder.join(" ")} />
              </div>
              <button className="btn btn-outline btn-sm" onClick={playCorrectSentence}>
                🔊 ฟังประโยคที่ถูกต้อง
              </button>
              <p className="explanation-box th-text">💡 {question.explanation}</p>
              <button className="btn btn-success btn-sm" onClick={next}>
                ข้อถัดไป →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
