import { useSpeak } from "../../../hooks/useSpeech";
import { adjectives, ruleGroupLabel } from "../../../utils/adjectives";

const SAMPLE_IDS = ["big", "happy", "beautiful", "good", "far"];

export default function AdjectiveComparisonTable() {
  const { speak } = useSpeak();
  const sample = SAMPLE_IDS.map((id) => adjectives.find((a) => a.id === id)).filter(Boolean);

  return (
    <div className="lesson-card">
      <h3 className="lesson-heading">📊 ตารางเปรียบเทียบทุกรูป</h3>
      <p className="th-text group-rule-explanation">แตะคำในตารางเพื่อฟังเสียง</p>

      <div className="scroll-x-safe">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="en-text">base</th>
              <th className="en-text">comparative</th>
              <th className="en-text">superlative</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((adj) => (
              <tr key={adj.id}>
                <td>
                  <span className="en-text comparison-dict">{adj.dict}</span>
                  <span className="th-text comparison-group">{ruleGroupLabel(adj.ruleGroup)}</span>
                </td>
                <td
                  className="en-text comparison-cell"
                  onClick={() => speak(adj.forms.comparative.text)}
                  role="button"
                  tabIndex={0}
                >
                  {adj.forms.comparative.text}
                </td>
                <td
                  className="en-text comparison-cell"
                  onClick={() => speak(adj.forms.superlative.text)}
                  role="button"
                  tabIndex={0}
                >
                  {adj.forms.superlative.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
