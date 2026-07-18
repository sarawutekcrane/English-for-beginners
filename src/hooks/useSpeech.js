import { useCallback, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";

let cachedVoice = null;

// Default to US English; the source app defaulted to a single locale (ja-JP)
// the same way, so we pick one sensible default rather than letting the
// learner's target accent vary by device. British English speakers can swap
// this for "en-GB" without touching any other file.
const TARGET_LANG_PREFIX = "en";
const PREFERRED_LOCALE = "en-US";

/** Higher score = clearer/more natural-sounding voice, based on name hints and service type. */
function voiceQualityScore(voice) {
  const name = voice.name?.toLowerCase() || "";
  let score = 0;
  if (voice.lang?.toLowerCase() === PREFERRED_LOCALE.toLowerCase()) score += 4;
  if (/google/.test(name)) score += 3;
  if (/natural|neural|premium|enhanced/.test(name)) score += 2;
  if (!voice.localService) score += 1; // network voices are usually higher fidelity
  return score;
}

function pickEnglishVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() || [];
  const enVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith(TARGET_LANG_PREFIX));
  if (enVoices.length === 0) return null;
  cachedVoice = enVoices.reduce((best, v) => (voiceQualityScore(v) > voiceQualityScore(best) ? v : best));
  return cachedVoice;
}

/** Speaks English text aloud using the Web Speech API (speechSynthesis). No audio files needed. */
export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  const { speechRate } = useSettings();
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    // Voice lists load async in some browsers.
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = null;
      pickEnglishVoice();
    };
    pickEnglishVoice();
  }, [supported]);

  const speak = useCallback(
    (text, { rate = speechRate } = {}) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = PREFERRED_LOCALE;
      utter.rate = rate;
      const voice = pickEnglishVoice();
      if (voice) utter.voice = voice;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [supported, speechRate]
  );

  return { speak, speaking, supported };
}
