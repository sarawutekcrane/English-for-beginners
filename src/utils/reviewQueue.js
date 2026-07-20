import { useEffect, useState } from "react";
import { shuffle } from "./content";

function buildOrder(items, shuffleOn) {
  return shuffleOn ? shuffle(items) : items;
}

function emptyScore() {
  return { correct: 0, total: 0 };
}

/**
 * Drives a single-pass scored session over a fixed item set: every item is
 * presented exactly once, in either randomized order (shuffleOn) or the
 * original/fixed order (shuffleOn false) -- chosen once when the session
 * (re)starts. The Shuffle toggle controls ONLY this ordering; it does not
 * gate whether scoring/progress/the results screen apply at all -- both
 * modes always track a correct/total score and end with a results screen
 * after the last item.
 *
 * Tracks which items were answered wrong so the caller can offer a
 * "retry wrong answers only" round after the results screen -- itself just
 * another single-pass session (via `retryWrongOnly`), this time over the
 * missed subset, ordered by whatever the Shuffle toggle is set to AT THE
 * MOMENT retryWrongOnly() is called. A wrong answer in a retry round can
 * itself chain into a further retry round the same way.
 */
export function useSinglePassSession(items, shuffleOn) {
  const [sessionItems, setSessionItems] = useState(items);
  const [order, setOrder] = useState(() => buildOrder(items, shuffleOn));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(emptyScore);
  const [wrongItems, setWrongItems] = useState([]);

  // A new item set (e.g. a different category/pattern) always starts a
  // fresh full session, discarding any in-progress retry-wrong chain.
  useEffect(() => {
    setSessionItems(items);
    setOrder(buildOrder(items, shuffleOn));
    setIndex(0);
    setScore(emptyScore());
    setWrongItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Toggling Shuffle re-orders (and restarts progress on) the CURRENT
  // session's items -- the full set, or an in-progress retry-wrong subset,
  // whichever is active -- rather than jumping back to the full item set.
  useEffect(() => {
    setOrder(buildOrder(sessionItems, shuffleOn));
    setIndex(0);
    setScore(emptyScore());
    setWrongItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleOn]);

  const submit = (isCorrect) => {
    const current = order[index];
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    if (!isCorrect && current) setWrongItems((w) => [...w, current]);
    setIndex((i) => i + 1);
  };

  const retryWrongOnly = () => {
    setSessionItems(wrongItems);
    setOrder(buildOrder(wrongItems, shuffleOn));
    setIndex(0);
    setScore(emptyScore());
    setWrongItems([]);
  };

  const restart = () => {
    setSessionItems(items);
    setOrder(buildOrder(items, shuffleOn));
    setIndex(0);
    setScore(emptyScore());
    setWrongItems([]);
  };

  return {
    current: order[index] ?? null,
    total: order.length,
    score,
    finished: order.length > 0 && index >= order.length,
    wrongCount: wrongItems.length,
    submit,
    retryWrongOnly,
    restart,
  };
}
