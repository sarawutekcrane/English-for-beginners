import { useEffect, useMemo, useRef, useState } from "react";
import Toggle from "../../components/Toggle";
import AnnotatedText from "../../components/AnnotatedText";
import { useSpeak } from "../../hooks/useSpeech";
import { shuffle } from "../../utils/content";
import { playCorrect, playIncorrect } from "../../utils/sound";
import { useReviewQueue } from "../../utils/reviewQueue";

const EMPTY = [];

// `makeItems` only ever reads each chunk's OWN `phonetic` field -- never
// the question-level `phonetic`/`correctOrder` (the assembled full
// sentence). Keeping these two data shapes separate in the schema, and
// only ever touching the chunk-level one here, is what prevents a
// "romaji-leak": the chunk pool/pills must never be able to spoil the full
// sentence or its correct order before the learner submits.
function makeItems(chunks) {
  return shuffle(chunks.map((chunk, i) => ({ key: `${i}-${chunk.text}`, text: chunk.text, phonetic: chunk.phonetic })));
}

export default function WordOrderPractice({ pattern, onBack }) {
  const { speak } = useSpeak();
  const [shuffleOn, setShuffleOn] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const baseQuestions = useMemo(() => pattern.wordOrderQuestions, [pattern]);
  const review = useReviewQueue(shuffleOn ? baseQuestions : EMPTY);
  const [index, setIndex] = useState(0);
  const finished = shuffleOn && review.finished;
  const question = shuffleOn ? review.current : baseQuestions[index % baseQuestions.length];

  const [poolItems, setPoolItems] = useState(() => (question ? makeItems(question.chunks) : []));
  const [answerItems, setAnswerItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!question) return;
    setPoolItems(makeItems(question.chunks));
    setAnswerItems([]);
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  useEffect(() => {
    setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, shuffleOn]);

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

  const speakTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(speakTimeoutRef.current), []);

  const submit = () => {
    const userOrder = answerItems.map((a) => a.text);
    const correct = JSON.stringify(userOrder) === JSON.stringify(question.correctOrder);
    setIsCorrect(correct);
    setSubmitted(true);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (correct) playCorrect();
    else playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(() => {
      speak(question.correctOrder.join(" "));
    }, 500);
  };

  const next = () => {
    clearTimeout(speakTimeoutRef.current);
    if (shuffleOn) review.submit(isCorrect);
    else setIndex((i) => i + 1);
  };

  const restart = () => {
    review.restart();
    setIndex(0);
    setScore({ correct: 0, total: 0 });
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
          {shuffleOn
            ? `เรียงถูกครบแล้ว ${review.totalCount - review.remainingCount} / ${review.totalCount}`
            : `${(index % baseQuestions.length) + 1} / ${baseQuestions.length}`}{" "}
          · คะแนน {score.correct}/{score.total}
        </p>
      </div>

      <div className="toggle-group">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="practice-card">
          <p className="th-text session-complete-text">เก่งมาก! คุณเรียงประโยคถูกครบทุกข้อในชุดนี้แล้ว 🎉📘</p>
          <button className="btn btn-success btn-sm" onClick={restart}>
            🔁 เริ่มรอบใหม่ (สุ่มใหม่)
          </button>
        </div>
      ) : (
        <div className="practice-card">
          <p className="th-text word-order-prompt">{question.promptThai}</p>

          <div className="answer-slot">
            {answerItems.length === 0 && <span className="answer-slot-hint th-text">แตะคำด้านล่างตามลำดับ</span>}
            {answerItems.map((item) => (
              <button key={item.key} className="chunk-pill placed en-text" onClick={() => tapAnswer(item)} disabled={submitted}>
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
