import { useSettings, SPEECH_RATE_MIN, SPEECH_RATE_MAX, SPEECH_RATE_STEP } from "../context/SettingsContext";

export default function SettingsPanel({ onClose }) {
  const { speechRate, setSpeechRate } = useSettings();

  return (
    <div className="settings-overlay" data-swipe-exempt onClick={onClose} role="presentation">
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-panel-header">
          <h3 className="th-text">⚙️ ตั้งค่า</h3>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            ปิด
          </button>
        </div>

        <div className="speed-control">
          <span className="toggle-label">🔊 ความเร็วเสียงพูด (Speech Speed)</span>
          <div className="speed-stepper">
            <button
              type="button"
              className="speed-btn"
              onClick={() => setSpeechRate(speechRate - SPEECH_RATE_STEP)}
              disabled={speechRate <= SPEECH_RATE_MIN}
              aria-label="ลดความเร็ว"
            >
              −
            </button>
            <span className="speed-value">
              {speechRate.toFixed(2)}x{speechRate >= SPEECH_RATE_MAX ? " (ปกติ)" : ""}
            </span>
            <button
              type="button"
              className="speed-btn"
              onClick={() => setSpeechRate(speechRate + SPEECH_RATE_STEP)}
              disabled={speechRate >= SPEECH_RATE_MAX}
              aria-label="เพิ่มความเร็ว"
            >
              +
            </button>
          </div>
        </div>

        <p className="th-text settings-note">
          ปรับความเร็วเสียงพูดที่ใช้ทั่วทั้งแอป ตั้งแต่ 0.75x (ช้า เหมาะกับผู้เริ่มต้น) ถึง 1.00x
          (ความเร็วปกติที่เจ้าของภาษาอังกฤษใช้สื่อสารกัน) ทีละ 0.05
        </p>
      </div>
    </div>
  );
}
