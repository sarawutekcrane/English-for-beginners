import { useSpeak } from "../../../hooks/useSpeech";
import { getGroupExamplesList, regularityLabel } from "../../../utils/grammar";
import ConjugatedWord from "../ConjugatedWord";

/** Shared renderer for a single conjugation field, grouped by regular vs irregular. */
export default function TopicForm({ field, heading }) {
  const { speak } = useSpeak();
  const groups = getGroupExamplesList(field, 4);

  return (
    <div className="lesson-card">
      {heading}
      {groups.map(({ regularity, items }) => (
        <div key={regularity} className="group-rule-card">
          <span className="verb-group th-text">{regularityLabel(regularity)}</span>
          <div className="conj-example-list">
            {items.map(({ verb, conjugated, explanation }, i) => (
              <div key={verb.id} className="conj-example-row" onClick={() => speak(conjugated)} role="button" tabIndex={0}>
                <ConjugatedWord dict={verb.dict} conjugated={conjugated} />
                <span className="example-play">🔊</span>
                {i === 0 && <p className="th-text group-rule-explanation">{explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
