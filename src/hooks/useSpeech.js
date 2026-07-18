import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { ALT_TRANSCRIPTIONS } from "../data/altTranscriptions";

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

function normalizeEn(str = "") {
  return str
    .normalize("NFKC")
    .replace(/[\s.,!?'";:()-]/g, "")
    .toLowerCase();
}

/**
 * Forgiving match, not exact-string equality: normalized strings equal, or
 * either one contains the other (handles filler words the recognizer adds,
 * or the target being a substring of a longer utterance). Falls back to a
 * small alternate-transcription table for known homophone/near-homophone
 * confusions when the direct match fails. Deliberately has no script-folding
 * step (the source app's katakana-to-hiragana equivalent) -- English has a
 * single script, so there's nothing to fold.
 */
export function matchesEnglish(transcript, target) {
  const a = normalizeEn(transcript);
  const b = normalizeEn(target);
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const alts = ALT_TRANSCRIPTIONS[target];
  if (alts) {
    return alts.some((alt) => {
      const n = normalizeEn(alt);
      return a === n || a.includes(n) || n.includes(a);
    });
  }
  return false;
}

const SpeechRecognitionCtor =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;

const RECOGNITION_TIMEOUT_MS = 8000;

/** Wraps the Web Speech API's SpeechRecognition for English speaking practice. */
export function useSpeechRecognition() {
  const supported = !!SpeechRecognitionCtor;
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const settledRef = useRef(false);

  const start = useCallback(
    ({ onResult, onError, onEnd } = {}) => {
      if (!supported) return;
      recognitionRef.current?.abort();
      clearTimeout(timeoutRef.current);
      settledRef.current = false;

      const recognition = new SpeechRecognitionCtor();
      recognition.lang = PREFERRED_LOCALE;
      recognition.interimResults = false;
      recognition.maxAlternatives = 5;

      const finish = () => {
        clearTimeout(timeoutRef.current);
        settledRef.current = true;
      };

      recognition.onstart = () => setListening(true);
      recognition.onresult = (event) => {
        finish();
        const results = event.results?.[0];
        const alternatives = results ? Array.from(results).map((alt) => alt.transcript) : [];
        onResult?.(alternatives[0] || "", alternatives);
      };
      recognition.onerror = (event) => {
        finish();
        onError?.(event.error);
      };
      recognition.onend = () => {
        setListening(false);
        clearTimeout(timeoutRef.current);
        // Some browsers end the session without ever firing onresult/onerror
        // (e.g. permission hiccups). Without this, the UI looks "frozen".
        if (!settledRef.current) {
          settledRef.current = true;
          onError?.("no-speech");
        }
        onEnd?.();
      };
      recognitionRef.current = recognition;
      recognition.start();

      // Defensive timeout in case no browser event ever fires.
      timeoutRef.current = setTimeout(() => {
        if (settledRef.current) return;
        settledRef.current = true;
        recognition.abort();
        onError?.("timeout");
      }, RECOGNITION_TIMEOUT_MS);
    },
    [supported]
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
      recognitionRef.current?.abort();
    },
    []
  );

  return { supported, listening, start, stop };
}
