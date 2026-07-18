import { useEffect, useState } from "react";
import { shuffle } from "./content";

const MIN_GAP = 3;
const MAX_GAP = 5;

function buildQueue(items) {
  return shuffle(items);
}

/** Reinserts a missed item 3-5 slots ahead, never immediately next and never as the very last item (unless the queue is too short to allow it). */
function requeueMissed(queueAfterCurrent, missedItem) {
  const gap = MIN_GAP + Math.floor(Math.random() * (MAX_GAP - MIN_GAP + 1));
  const maxPos = Math.max(0, queueAfterCurrent.length - 1);
  const pos = Math.min(gap, maxPos);
  const next = [...queueAfterCurrent];
  next.splice(pos, 0, missedItem);
  return next;
}

/**
 * Drives a no-immediate-repeat review session over a fixed item set: a
 * shuffled queue that never repeats an item answered correctly, and
 * re-inserts missed items a few slots ahead so they resurface after a
 * short delay rather than right away. Rebuilds the queue whenever `items`
 * changes reference.
 */
export function useReviewQueue(items) {
  const [queue, setQueue] = useState(() => buildQueue(items));

  useEffect(() => {
    setQueue(buildQueue(items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const submit = (isCorrect) => {
    setQueue((q) => {
      const [current, ...rest] = q;
      return isCorrect ? rest : requeueMissed(rest, current);
    });
  };

  const restart = () => setQueue(buildQueue(items));

  return {
    current: queue[0] ?? null,
    remainingCount: queue.length,
    totalCount: items.length,
    finished: items.length > 0 && queue.length === 0,
    submit,
    restart,
  };
}
