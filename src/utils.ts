/**
 * Decide duration unit.
 *
 * @param {number} duration
 */
export function formatDuration(duration: number) {
  if (duration <= 1000) {
    return durationToMS(duration);
  } else if (duration <= 120000) {
    return durationToSec(duration);
  } else {
    return durationToMin(duration);
  } 
}

/**
 * Get duration in milliseconds.
 *
 * @param {number} duration
 */
function durationToMS(duration: number) {
  return `${Math.trunc(duration)} ms`;
}

/**
 * Get duration in seconds.
 *
 * @param {number} duration
 */
function durationToSec(duration: number) {
  return `${Math.trunc(duration / 1000)} s`;
}

/**
 * Get duration in minutes.
 *
 * @param {number} duration
 */
function durationToMin(duration: number) {
  return `${Math.trunc(duration / 60000)} min`;
}
