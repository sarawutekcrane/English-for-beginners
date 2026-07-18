/** Pastel pill switch reused for shuffle / translation / annotation toggles across all modules. */
export default function Toggle({ label, checked, onChange, emoji }) {
  return (
    <label className="toggle-row th-text">
      <span className="toggle-label">
        {emoji ? `${emoji} ` : ""}
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle-switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-knob" />
      </button>
    </label>
  );
}
