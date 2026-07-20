/**
 * Detects common in-app browser WebViews (LINE, Facebook, Instagram) that
 * are known to not reliably support the Web Speech API's SpeechRecognition
 * -- this only matters for Speaking Practice's microphone feature, so
 * detection lives here as a standalone check the caller opts into, rather
 * than anything that runs globally.
 *
 * Each entry is self-contained (id, label, UA test, and an optional
 * external-browser escape hatch) so adding a new WebView later is just
 * another array entry, not a change to the detection or UI logic.
 */

/**
 * LINE's in-app browser opens the SAME url with `openExternalBrowser=1`
 * (or `&openExternalBrowser=1` if the URL already has query params) in the
 * device's default system browser instead of LINE's own WebView. This is
 * long-standing, widely-documented LINE behavior used by many sites, but
 * it is NOT part of LINE's official developers.line.biz API reference --
 * that only documents the LIFF-specific `withLoginOnExternalBrowser`
 * mechanism for LIFF mini-apps (a different, narrower feature). Verified
 * against several independent, mutually-consistent third-party writeups of
 * this exact parameter and its `?`/`&` joining rule; could not find it in
 * LINE's own official docs, so treat it as commonly-known behavior rather
 * than a guaranteed-stable public API.
 */
function lineExternalBrowserUrl(currentUrl) {
  const url = new URL(currentUrl);
  url.searchParams.set("openExternalBrowser", "1");
  return url.toString();
}

const IN_APP_BROWSERS = [
  {
    id: "line",
    label: "LINE",
    test: (ua) => /\bLine\//i.test(ua),
    getExternalBrowserUrl: lineExternalBrowserUrl,
  },
  {
    id: "facebook",
    label: "Facebook",
    test: (ua) => /FBAN|FBAV/.test(ua),
    getExternalBrowserUrl: null,
  },
  {
    id: "instagram",
    label: "Instagram",
    test: (ua) => /Instagram/i.test(ua),
    getExternalBrowserUrl: null,
  },
];

/** Returns the matching in-app-browser entry for this UA, or null if none match. */
export function detectInAppBrowser(userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "") {
  return IN_APP_BROWSERS.find((b) => b.test(userAgent)) || null;
}
