import { useEffect, useRef, useState } from "react";
import Toggle from "../../components/Toggle";
import { useSpeak } from "../../hooks/useSpeech";
import { getAllAdjectiveQuestions } from "../../utils/adjectives";
import { playCorrect, playIncorrect } from "../../utils/sound";
import { useReviewQueue } from "../../utils/reviewQueue";

const BASE_QUESTIONS = getAllAdjectiveQuestions();
const EMPTY = [];

export default function AdjectivePractice({ onBack }) {
  const { speak } = useSpeak();
  const [shuffleOn, setShuffleOn] = useState(false);
  const [showThai, setShowThai] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const review = useReviewQueue(shuffleOn ? BASE_QUESTIONS : EMPTY);
  const [index, setIndex] = useState(0);
  const finished = shuffleOn && review.finished;
  const question = shuffleOn ? review.current : BASE_QUESTIONS[index % BASE_QUESTIONS.length];
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setIndex(0);
    setSelected(null);
  }, [shuffleOn]);

  useEffect(() => {
    setSelected(null);
  }, [question]);

  const answered = selected !== null;
  const isCorrect = question ? selected === question.correct : false;

  const speakTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(speakTimeoutRef.current), []);

  const choose = (opt) => {
    if (answered) return;
    setSelected(opt);
    setScore((s) => ({ correct: s.correct + (opt === question.correct ? 1 : 0), total: s.total + 1 }));
    if (opt === question.correct) playCorrect();
    else playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(() => {
      speak(question.correct);
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
    setSelected(null);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="practice-view">
      <div className="practice-topbar">
        <button className="btn btn-outline blue btn-sm" onClick={onBack}>
          ← กลับ
        </button>
        <p className="progress-label th-text">
          {shuffleOn
            ? `ผันถูกครบแล้ว ${review.totalCount - review.remainingCount} / ${review.totalCount}`
            : `${(index % BASE_QUESTIONS.length) + 1} / ${BASE_QUESTIONS.length}`}{" "}
          · คะแนน {score.correct}/{score.total}
        </p>
      </div>

      <div className="toggle-group blue">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="แปล" checked={showThai} onChange={setShowThai} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="practice-card blue">
          <p className="th-text session-complete-text">เก่งมาก! คุณผันคำคุณศัพท์ถูกครบทุกข้อในชุดนี้แล้ว 🎉📘</p>
          <button className="btn btn-success btn-sm" onClick={restart}>
            🔁 เริ่มรอบใหม่ (สุ่มใหม่)
          </button>
        </div>
      ) : (
        <div className="practice-card blue">
          <div className="verb-card">
            <p className="en-text verb-dict" onClick={() => speak(question.item.dict)} role="button" tabIndex={0}>
              {question.item.dict} 🔊
            </p>
            {showPhonetic && <p className="flashcard-romaji">{question.dictPhonetic}</p>}
            {showThai && <p className="th-text verb-meaning">{question.item.meaningThai}</p>}
          </div>

          <p className="th-text conjugation-instruction">
            จงผัน <span className="en-text">{question.item.dict}</span> เป็นรูป{" "}
            <span className="en-text">{question.formLabel}</span>
          </p>

          <div className="quiz-options">
            {question.options.map((opt) => {
              let cls = "quiz-option";
              if (answered) {
                if (opt === question.correct) cls += " correct";
                else if (opt === selected) cls += " incorrect";
              }
              return (
                <button key={opt} className={cls} onClick={() => choose(opt)} disabled={answered}>
                  <span className="en-text">{opt}</span>
                  {showPhonetic && <span className="quiz-option-hint">{question.optionPhonetic[opt]}</span>}
                </button>
              );
            })}
          </div>

          {answered && (
            <>
              <p className={`quiz-feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"} th-text`}>
                {isCorrect ? "ถูกต้อง! เก่งมาก 🎉" : "ยังไม่ถูก คำตอบที่ถูกต้องคือตัวเลือกที่ถูกไฮไลต์ 💪"}
              </p>
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
