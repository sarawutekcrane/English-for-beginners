import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "efb-settings-v1";

export const SPEECH_RATE_MIN = 0.75;
export const SPEECH_RATE_MAX = 1;
export const SPEECH_RATE_STEP = 0.05;

const DEFAULT_SPEECH_RATE = 0.85;

function clampSpeechRate(rate) {
  const clamped = Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, rate));
  return Math.round(clamped * 100) / 100;
}

function loadSpeechRate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SPEECH_RATE;
    const parsed = JSON.parse(raw);
    return clampSpeechRate(parsed.speechRate ?? DEFAULT_SPEECH_RATE);
  } catch {
    return DEFAULT_SPEECH_RATE;
  }
}

const SettingsContext = createContext(null);

/**
 * The only piece of app state allowed to touch localStorage is speechRate.
 * showAlternateScript/showAnnotation reset to their defaults on every
 * reload by design (matches the source app's "no unwanted persistence"
 * rule); every other toggle lives as local useState inside module
 * components and must never be lifted here.
 */
export function SettingsProvider({ children }) {
  const [showAlternateScript, setShowAlternateScript] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [speechRate, setSpeechRateRaw] = useState(loadSpeechRate);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ speechRate }));
  }, [speechRate]);

  const setSpeechRate = (rate) => setSpeechRateRaw(clampSpeechRate(rate));

  return (
    <SettingsContext.Provider
      value={{
        showAlternateScript,
        setShowAlternateScript,
        showAnnotation,
        setShowAnnotation,
        speechRate,
        setSpeechRate,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
