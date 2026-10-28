/** Reveal no words while typing, including the word under the caret. */
export const CONTEXT_RADIUS_NONE = -2;

/** Reveal every word on the caret's line. */
export const CONTEXT_RADIUS_LINE = -1;

/** Context control order, from narrowest to the whole line. */
export const CONTEXT_RADIUS_STEPS = [CONTEXT_RADIUS_NONE, 0, 2, 5, 10, CONTEXT_RADIUS_LINE] as const;

export function stepContextRadius(current: number, direction: -1 | 1): number {
  const steps = CONTEXT_RADIUS_STEPS;
  let index = steps.indexOf(current as (typeof steps)[number]);
  if (index < 0) {
    index = 1;
  }
  const next = Math.min(steps.length - 1, Math.max(0, index + direction));
  return steps[next];
}
