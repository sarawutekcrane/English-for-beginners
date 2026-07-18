import { useMemo } from "react";
import { getVocab, toCard } from "../utils/content";
import { useSettings } from "../context/SettingsContext";
import { useSpeak } from "../hooks/useSpeech";
import AnnotatedText from "./AnnotatedText";
import Toggle from "./Toggle";
import Illustration from "../illustrations";

/**
 * Phase 0 validation view: proves the data pipeline (vocabulary.json ->
 * toCard), AnnotatedText, useSpeak (TTS), and the SettingsContext toggle
 * all work end-to-end. Not a real learning module — later phases replace
 * this with Flashcards, Listening Quiz, etc.
 */
export default function ScaffoldingPreview() {
  const card = useMemo(() => toCard(getVocab("greetings")[0]), []);
  const { showAlternateScript, setShowAlternateScript } = useSettings();
  const { speak, speaking, supported } = useSpeak();

  return (
    <div className="flashcards-view">
      <p className="progress-label th-text">ทดสอบโครงสร้างระบบ (Phase 0)</p>
      <div className="flashcard">
        <div className="flashcard-illustration">
          <Illustration item={card} />
        </div>
        <AnnotatedText
          as="p"
          className="flashcard-text en-text"
          plain={card.display}
          segments={card.segments}
        />
        <p className="flashcard-romaji">{card.reading}</p>
        <span className="flashcard-thai th-text">{card.thai}</span>
        <button className="btn" onClick={() => speak(card.audioText)} disabled={!supported}>
          {speaking ? "🔊 กำลังเล่น..." : "🔊 ฟังเสียง"}
        </button>
        {!supported && <p className="flashcard-hint th-text">เบราว์เซอร์นี้ไม่รองรับ Web Speech API</p>}
      </div>
      <Toggle
        label="แสดงอักษรทางเลือก (Context)"
        checked={showAlternateScript}
        onChange={setShowAlternateScript}
      />
    </div>
  );
}
