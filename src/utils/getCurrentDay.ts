const enforceDayRegexResult = /forceday=([0-9]+)/.exec(window.location.search);
export const enforceDay = enforceDayRegexResult ? Number(enforceDayRegexResult[1]) : null;

/**
 * Returns a number that is the day difference between now and 2021.12.01
 * Negative number means it's not december yet, positive means the day in december or after
 * Uses force parameter as well
 */
export function getCurrentDay(): number {
  const dayInDecember = Math.floor((Date.now() - Number(new Date('2021.12.01'))) / 1000 * 60 * 60 * 24);
  return enforceDay !== null ? enforceDay : dayInDecember;
}