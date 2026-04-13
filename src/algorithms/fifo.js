/**
 * FIFO (First-In, First-Out) Page Replacement Algorithm
 *
 * Strategy: Replace the page that has been in memory the longest.
 * Maintains a queue; when a fault occurs and frames are full, the
 * front of the queue (oldest page) is evicted and the new page is
 * enqueued at the back.
 *
 * @param {number[]} pages  - Sequence of page requests
 * @param {number}   frames - Number of available memory frames
 * @returns {Object}        - steps[], totalFaults, totalHits, hitRatio
 */
export function runFIFO(pages, frames) {
  const steps = [];       // History of each memory state
  let frameState = [];    // Current pages loaded in memory
  const queue = [];       // Insertion-order queue (oldest at index 0)
  let totalFaults = 0;
  let totalHits = 0;

  pages.forEach((page, i) => {
    const isHit = frameState.includes(page);

    if (isHit) {
      // ── Hit: page is already in memory ──────────────────────────
      totalHits++;
      steps.push({
        step: i + 1,
        page,
        frames: [...frameState],
        isHit: true,
        evicted: null,
      });
    } else {
      // ── Fault: page is NOT in memory ────────────────────────────
      totalFaults++;
      let evicted = null;

      if (frameState.length < frames) {
        // Frames not full yet — just add the page
        frameState = [...frameState, page];
        queue.push(page);
      } else {
        // Frames full — evict the oldest page (front of the FIFO queue)
        evicted = queue.shift();            // Remove oldest
        queue.push(page);                   // Enqueue new page
        frameState = frameState.map((p) => (p === evicted ? page : p));
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
