import { useEffect, useRef, useState } from "react";
import Toggle from "../../components/Toggle";
import { useSpeak } from "../../hooks/useSpeech";
import { useSwipeBack } from "../../hooks/useSwipeBack";
import { getAllVerbConjugationQuestions, regularityLabel } from "../../utils/grammar";
import { playCorrect, playIncorrect } from "../../utils/sound";
import { useSinglePassSession } from "../../utils/reviewQueue";

const BASE_QUESTIONS = getAllVerbConjugationQuestions();

export default function ConjugationPractice({ onBack }) {
  const { speak } = useSpeak();
  useSwipeBack(onBack);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [showThai, setShowThai] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);

  const session = useSinglePassSession(BASE_QUESTIONS, shuffleOn);
  const finished = session.finished;
  const question = session.current;
  const [selected, setSelected] = useState(null);

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
    if (opt === question.correct) playCorrect();
    else playIncorrect();
    clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(() => {
      speak(question.correct);
    }, 500);
  };

  const next = () => {
    clearTimeout(speakTimeoutRef.current);
    session.submit(isCorrect);
    setSelected(null);
  };

  const restart = () => {
    session.restart();
    setSelected(null);
  };

  const retryWrongOnly = () => {
    session.retryWrongOnly();
    setSelected(null);
  };

  return (
    <div className="practice-view">
      <div className="practice-topbar">
        <button className="btn btn-outline blue btn-sm" onClick={onBack}>
          ← กลับ
        </button>
        <p className="progress-label th-text">
          ทำไปแล้ว {session.score.total}/{session.total} ข้อ · คะแนน {session.score.correct}/{session.total}
        </p>
      </div>

      <div className="toggle-group blue">
        <Toggle emoji="🔀" label="สุ่ม" checked={shuffleOn} onChange={setShuffleOn} />
        <Toggle label="แปล" checked={showThai} onChange={setShowThai} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      {finished ? (
        <div className="practice-card blue">
          {session.wrongCount === 0 ? (
            <>
              <p className="th-text session-complete-text">เก่งมาก! คุณผันกริยาถูกครบทุกข้อในชุดนี้แล้ว 🎉📘</p>
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
        <div className="practice-card blue">
          <div className="verb-card">
            <p className="en-text verb-dict" onClick={() => speak(question.item.dict)} role="button" tabIndex={0}>
              {question.item.dict} 🔊
            </p>
            <p className="verb-group th-text">{regularityLabel(question.item.regularity)}</p>
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
                {isCorrect ? "ถูกต้อง! เก่งมาก 🎉" : "ยังไม่ถูก ลองอ่านคำอธิบายด้านล่าง 💪"}
              </p>
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
