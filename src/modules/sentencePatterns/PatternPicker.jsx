import { patterns } from "../../utils/grammar";
import { useSwipeBack } from "../../hooks/useSwipeBack";

const orderedPatterns = [...patterns].sort((a, b) => a.order - b.order);

function PatternButton({ pattern, onPick }) {
  return (
    <button className="pattern-list-btn" onClick={() => onPick(pattern.id)}>
      <span className="pattern-list-order">{pattern.order}</span>
      <span className="pattern-list-titles">
        <span className="pattern-list-title en-text">{pattern.title}</span>
        <span className="pattern-list-title-th th-text">{pattern.titleTh}</span>
      </span>
    </button>
  );
}

export default function PatternPicker({ onPick, onBack }) {
  useSwipeBack(onBack);
  return (
    <div className="picker">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <section className="picker-section">
        <h3 className="picker-heading">📐 แพทเทิร์นประโยค</h3>
        <div className="pattern-list">
          {orderedPatterns.map((p) => (
            <PatternButton key={p.id} pattern={p} onPick={onPick} />
          ))}
        </div>
      </section>
    </div>
  );
}
