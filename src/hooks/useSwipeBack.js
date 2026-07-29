import { useEffect, useRef } from "react";

// Every screen in this app that shows a back button is the ONLY such screen
// mounted at that moment -- each nested picker/view unmounts its parent when
// it mounts (plain conditional rendering, no persisted route stack) -- so
// tracking "the current back handler" is just a mount/unmount-ordered stack,
// not real routing state. The stack lives at module scope (a singleton, like
// the app itself) rather than in React context, since the gesture listener
// below only ever needs synchronous read access to its top entry at
// touchend, never a re-render when it changes.
const backStack = [];

// Call from any component that renders a back button, passing the exact
// same handler the button's onClick already uses. Registers it as the
// active swipe-back target while mounted; does nothing if onBack is falsy
// (e.g. HomeMenu, which has no "back" target).
export function useSwipeBack(onBack) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!onBack) return undefined;
    const entry = () => onBackRef.current?.();
    backStack.push(entry);
    return () => {
      const i = backStack.lastIndexOf(entry);
      if (i !== -1) backStack.splice(i, 1);
    };
    // Only re-register on a present/absent transition -- onBackRef always
    // holds the latest closure, so an identity change on every render
    // (e.g. an inline arrow function) doesn't need to re-run this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!onBack]);
}

// A touch's start position falls in one of these and the whole gesture is
// left alone -- WordOrderPractice's answer-slot/chunk-pool (long-press-to-
// drag reordering), any horizontally-scrollable container (already marked
// `scroll-x-safe` app-wide, e.g. conversation history, comparison tables),
// and text inputs (VocabularyRecall's typed-answer field, which has its
// own native drag-to-select-text behavior) all already have their own
// horizontal touch handling that a competing swipe-back listener must
// never intercept.
const EXEMPT_SELECTOR = "[data-swipe-exempt], .scroll-x-safe, input, textarea";

const MIN_DISTANCE_PX = 70;
// deltaX must be at least this many times deltaY for a touch to count as a
// horizontal swipe rather than a (possibly diagonal) vertical scroll. This
// is deliberately stricter than an edge-only implementation would need,
// since the gesture competes with ordinary scrolling everywhere on screen.
const MIN_RATIO = 2;
// Small early-movement threshold before committing to "this is a
// horizontal swipe" and calling preventDefault on touchmove -- keeps a
// slow, still-ambiguous drag from locking out vertical scroll prematurely.
const INTENT_PX = 12;

// Call once, at the app root. Owns the actual touch listeners; on a
// qualifying left-to-right swipe outside an exempt zone, invokes whatever
// handler useSwipeBack most recently registered -- the exact same action
// the visible back button for the current screen already triggers.
export function useSwipeBackGesture() {
  useEffect(() => {
    let touch = null; // { startX, startY, exempt, claimed } | null

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) {
        touch = null;
        return;
      }
      const t = e.touches[0];
      touch = {
        startX: t.clientX,
        startY: t.clientY,
        exempt: !!e.target.closest?.(EXEMPT_SELECTOR),
        claimed: false,
      };
    };

    const onTouchMove = (e) => {
      if (!touch || touch.exempt) return;
      const t = e.touches[0];
      const deltaX = t.clientX - touch.startX;
      const deltaY = t.clientY - touch.startY;

      if (!touch.claimed) {
        if (deltaX > INTENT_PX && deltaX > Math.abs(deltaY) * MIN_RATIO) {
          touch.claimed = true;
        } else if (Math.abs(deltaY) > INTENT_PX || deltaX < -INTENT_PX) {
          // Vertical scroll (or a leftward drag, which this gesture has no
          // action for) won out -- stop tracking; let the page scroll
          // normally for the rest of this touch.
          touch = null;
          return;
        }
      }

      if (touch.claimed) {
        // Stops the page scrolling under a deliberate horizontal drag, and
        // is the standard signal that this touch is claimed by page JS
        // rather than left for the browser's own gesture handling.
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (!touch || touch.exempt) {
        touch = null;
        return;
      }
      const t = e.changedTouches[0];
      const deltaX = t.clientX - touch.startX;
      const deltaY = t.clientY - touch.startY;
      touch = null;
      if (deltaX >= MIN_DISTANCE_PX && deltaX >= Math.abs(deltaY) * MIN_RATIO) {
        const top = backStack[backStack.length - 1];
        top?.();
      }
    };

    const onTouchCancel = () => {
      touch = null;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchCancel, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchCancel);
    };
  }, []);
}
