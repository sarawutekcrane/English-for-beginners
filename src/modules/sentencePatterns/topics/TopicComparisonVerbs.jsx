import { useSpeak } from "../../../hooks/useSpeech";
import { verbs, regularityLabel, verbFieldValue } from "../../../utils/grammar";

const COLUMNS = [
  { field: "present", label: "Present" },
  { field: "past", label: "Past" },
  { field: "presentParticiple", label: "-ing" },
  { field: "negative", label: "Negative" },
];

const SAMPLE_IDS = ["play", "watch", "eat", "go"];

export default function TopicComparisonVerbs() {
  const { speak } = useSpeak();
  const sampleVerbs = SAMPLE_IDS.map((id) => verbs.find((v) => v.id === id)).filter(Boolean);

  return (
    <div className="lesson-card">
      <h3 className="lesson-heading">📊 ตารางเปรียบเทียบทุกรูป</h3>
      <p className="th-text group-rule-explanation">แตะคำในตารางเพื่อฟังเสียง</p>

      <div className="scroll-x-safe">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="en-text">base</th>
              {COLUMNS.map((c) => (
                <th key={c.field} className="en-text">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleVerbs.map((verb) => (
              <tr key={verb.id}>
                <td>
                  <span className="en-text comparison-dict">{verb.dict}</span>
                  <span className="th-text comparison-group">{regularityLabel(verb.regularity)}</span>
                </td>
                {COLUMNS.map((c) => (
                  <td
                    key={c.field}
                    className="en-text comparison-cell"
                    onClick={() => speak(verbFieldValue(verb, c.field))}
                    role="button"
                    tabIndex={0}
                  >
                    {verbFieldValue(verb, c.field)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
