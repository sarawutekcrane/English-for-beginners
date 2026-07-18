import { useSpeak } from "../../../hooks/useSpeech";
import { verbs, regularityLabel } from "../../../utils/grammar";

function GroupCard({ regularity, note, children }) {
  return (
    <div className="group-rule-card">
      <span className="verb-group th-text">{regularityLabel(regularity)}</span>
      {note && <p className="th-text group-rule-explanation">{note}</p>}
      <div className="verb-chip-row">{children}</div>
    </div>
  );
}

export default function TopicIntro() {
  const { speak } = useSpeak();
  const regular = verbs.filter((v) => v.regularity === "regular");
  const irregular = verbs.filter((v) => v.regularity === "irregular");

  return (
    <div className="lesson-card">
      <h3 className="lesson-heading">🔤 Regular verbs</h3>
      <GroupCard regularity="regular" note="กริยา regular ผันเป็นอดีตด้วยการเติม -ed ท้ายคำเสมอ กฎเดียวใช้ได้กับทุกคำ">
        {regular.map((v) => (
          <button key={v.id} className="verb-chip en-text" onClick={() => speak(v.dict)}>
            {v.dict} 🔊
          </button>
        ))}
      </GroupCard>

      <h3 className="lesson-heading">🔤 Irregular verbs</h3>
      <GroupCard regularity="irregular" note="กริยา irregular ไม่ได้เติม -ed ในรูปอดีต ต้องจำรูปผันของแต่ละคำแยกกันไป">
        {irregular.map((v) => (
          <button key={v.id} className="verb-chip en-text" onClick={() => speak(v.dict)}>
            {v.dict} 🔊
          </button>
        ))}
      </GroupCard>

      <div className="time-note th-text">
        <span>💡</span> วิธีสังเกต: กริยาส่วนใหญ่ในภาษาอังกฤษเป็น regular (เติม -ed) แต่คำที่ใช้บ่อยที่สุดหลายคำ เช่น go, have,
        do, eat กลับเป็น irregular ดังนั้นควรท่องจำรูปอดีตของคำที่ใช้บ่อยเหล่านี้ไว้เป็นพิเศษ
      </div>
    </div>
  );
}
