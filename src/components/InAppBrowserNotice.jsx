import { useState } from "react";
import { detectInAppBrowser } from "../utils/inAppBrowser";

/**
 * Dismissible notice shown only inside Speaking Practice for recognized
 * in-app browser WebViews (LINE, Facebook, Instagram) -- these commonly
 * don't support SpeechRecognition reliably. Deliberately not a blocking
 * modal: SpeechRecognition support is feature-detected independently
 * (see SpeakingPractice.jsx), so if it happens to work anyway despite the
 * WebView, the mic button underneath this notice is never disabled by it.
 */
export default function InAppBrowserNotice() {
  const browser = useState(() => detectInAppBrowser())[0];
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!browser || dismissed) return null;

  const openExternally = () => {
    const url = browser.getExternalBrowserUrl?.(window.location.href);
    if (url) window.location.href = url;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="inapp-browser-notice th-text">
      <button className="inapp-browser-notice-close" onClick={() => setDismissed(true)} aria-label="ปิด">
        ✕
      </button>
      <p>
        🎤 ฝึกพูดออกเสียงอาจใช้งานไม่ได้ในเบราว์เซอร์ของ {browser.label} กรุณาเปิดในเบราว์เซอร์ปกติ เช่น Chrome หรือ
        Safari เพื่อให้ไมโครโฟนทำงานได้ถูกต้อง
      </p>
      {browser.getExternalBrowserUrl ? (
        <button className="btn btn-outline btn-sm" onClick={openExternally}>
          🔗 เปิดในเบราว์เซอร์
        </button>
      ) : (
        <button className="btn btn-outline btn-sm" onClick={copyLink}>
          {copied ? "คัดลอกลิงก์แล้ว ✓" : "📋 คัดลอกลิงก์นี้"}
        </button>
      )}
    </div>
  );
}
