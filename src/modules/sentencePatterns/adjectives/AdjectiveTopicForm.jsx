import { useSpeak } from "../../../hooks/useSpeech";
import { adjectives } from "../../../utils/adjectives";

function AdjectiveRow({ adj, speak }) {
  return (
    <div className="conj-example-row">
      <button type="button" className="en-text verb-chip" onClick={() => speak(adj.dict)}>
        {adj.dict} 🔊
      </button>
      <span className="conj-arrow">→</span>
      <button type="button" className="en-text verb-chip" onClick={() => speak(adj.forms.comparative.text)}>
        {adj.forms.comparative.text} 🔊
      </button>
      <span className="conj-arrow">→</span>
      <button type="button" className="en-text verb-chip" onClick={() => speak(adj.forms.superlative.text)}>
        {adj.forms.superlative.text} 🔊
      </button>
    </div>
  );
}

/** Shared renderer for one adjective rule group (er-est / more-most / irregular). */
export default function AdjectiveTopicForm({ ruleGroup, heading }) {
  const { speak } = useSpeak();
  const items = adjectives.filter((a) => a.ruleGroup === ruleGroup);

  return (
    <div className="lesson-card">
      {heading}
      <div className="conj-example-list">
        {items.map((adj) => (
          <AdjectiveRow key={adj.id} adj={adj} speak={speak} />
        ))}
      </div>
    </div>
  );
}
