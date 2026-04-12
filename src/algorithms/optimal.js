/**
 * Optimal Page Replacement Algorithm (Bélády's Algorithm)
 *
 * Strategy: Replace the page that will NOT be used for the longest
 * period of time in the future. This is theoretically optimal (fewest
 * possible page faults) but requires future knowledge — used as a
 * benchmark to compare real algorithms.
 *
 * @param {number[]} pages  - Sequence of page requests
 * @param {number}   frames - Number of available memory frames
 * @returns {Object}        - steps[], totalFaults, totalHits, hitRatio
 */
export function runOptimal(pages, frames) {
  const steps = [];
  let frameState = [];
  let totalFaults = 0;
  let totalHits = 0;

  pages.forEach((page, i) => {
    const isHit = frameState.includes(page);

    if (isHit) {
      // ── Hit ──────────────────────────────────────────────────────
      totalHits++;
      steps.push({
        step: i + 1,
        page,
        frames: [...frameState],
        isHit: true,
        evicted: null,
      });
    } else {
      // ── Fault ────────────────────────────────────────────────────
      totalFaults++;
      let evicted = null;

      if (frameState.length < frames) {
        // Frames not full yet — just add the page
        frameState = [...frameState, page];
      } else {
        // Frames full — find the page used farthest in the future
        // For each frame page, find its next use after index i
        const futureUseAt = frameState.map((p) => {
          const nextUse = pages.indexOf(p, i + 1);
          return nextUse === -1 ? Infinity : nextUse; // Infinity = never used again
        });

        // Evict the page with the largest (farthest) future use index
        const maxIdx = futureUseAt.indexOf(Math.max(...futureUseAt));
        evicted = frameState[maxIdx];
        frameState = frameState.map((p, idx) => (idx === maxIdx ? page : p));
      }

      steps.push({
        step: i + 1,
        page,
        frames: [...frameState],
        isHit: false,
        evicted,
      });
    }
  });

  const hitRatio = pages.length > 0 ? (totalHits / pages.length) * 100 : 0;

  return { steps, totalFaults, totalHits, hitRatio: hitRatio.toFixed(1) };
}
