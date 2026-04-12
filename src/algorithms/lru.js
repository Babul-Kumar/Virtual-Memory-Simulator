/**
 * LRU (Least Recently Used) Page Replacement Algorithm
 *
 * Strategy: Replace the page that was least recently used.
 * When a page fault occurs, find the page in frames whose last use
 * was furthest in the past.
 *
 * @param {number[]} pages  - Sequence of page requests
 * @param {number}   frames - Number of available memory frames
 * @returns {Object}        - steps[], totalFaults, totalHits, hitRatio
 */
export function runLRU(pages, frames) {
  const steps = [];          // History of each memory state
  let frameState = [];       // Current pages loaded in memory
  let totalFaults = 0;
  let totalHits = 0;
  const recentUse = {};      // page → index of last use

  pages.forEach((page, i) => {
    const isHit = frameState.includes(page);

    if (isHit) {
      // ── Hit: page is already in memory ──────────────────────────
      totalHits++;
      recentUse[page] = i; // Update last-used time
    } else {
      // ── Fault: page is NOT in memory ────────────────────────────
      totalFaults++;
      let evicted = null;

      if (frameState.length < frames) {
        // Frames not full yet — just add the page
        frameState = [...frameState, page];
      } else {
        // Frames full — evict the LRU page
        // Find the page in frames with the smallest recentUse index
        let lruPage = frameState[0];
        let lruTime = recentUse[lruPage] ?? -1;

        frameState.forEach((p) => {
          const t = recentUse[p] ?? -1;
          if (t < lruTime) {
            lruTime = t;
            lruPage = p;
          }
        });

        evicted = lruPage;
        frameState = frameState.map((p) => (p === lruPage ? page : p));
      }

      recentUse[page] = i;

      steps.push({
        step: i + 1,
        page,
        frames: [...frameState],
        isHit: false,
        evicted,
      });
      return; // already pushed, skip the push below
    }

    steps.push({
      step: i + 1,
      page,
      frames: [...frameState],
      isHit: true,
      evicted: null,
    });
  });

  const hitRatio = pages.length > 0 ? (totalHits / pages.length) * 100 : 0;

  return { steps, totalFaults, totalHits, hitRatio: hitRatio.toFixed(1) };
}
