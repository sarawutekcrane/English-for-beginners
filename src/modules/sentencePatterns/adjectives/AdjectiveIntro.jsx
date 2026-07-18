import { useSpeak } from "../../../hooks/useSpeech";
import { adjectives, ruleGroupLabel } from "../../../utils/adjectives";

const NOTES = {
  "er-est": "คำคุณศัพท์สั้น (1 พยางค์ หรือ 2 พยางค์ที่ลงท้ายด้วย y) เติม -er/-est ท้ายคำ",
  "more-most": "คำคุณศัพท์ยาว (2 พยางค์ขึ้นไป) ใช้ more/most นำหน้าแทนการเติมท้ายคำ",
  irregular: "คำยกเว้นพิเศษที่ไม่ได้ตามกฎทั้งสองแบบข้างต้น ต้องจำแยกไว้เป็นพิเศษ",
};

function GroupCard({ ruleGroup, children }) {
  return (
    <div className="group-rule-card">
      <span className="verb-group th-text">{ruleGroupLabel(ruleGroup)}</span>
      <p className="th-text group-rule-explanation">{NOTES[ruleGroup]}</p>
      <div className="verb-chip-row">{children}</div>
    </div>
  );
}

export default function AdjectiveIntro() {
  const { speak } = useSpeak();
  const groups = ["er-est", "more-most", "irregular"];

  return (
    <div className="lesson-card">
      <h3 className="lesson-heading">💡 3 กลุ่มการผันคำคุณศัพท์เปรียบเทียบ</h3>
      {groups.map((g) => (
        <GroupCard key={g} ruleGroup={g}>
          {adjectives
            .filter((a) => a.ruleGroup === g)
            .slice(0, 4)
            .map((a) => (
              <button key={a.id} className="verb-chip en-text" onClick={() => speak(a.dict)}>
                {a.dict} 🔊
              </button>
            ))}
        </GroupCard>
      ))}
    </div>
  );
}
