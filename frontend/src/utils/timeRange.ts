/** 两个半开时间窗是否重叠：start < otherEnd && end > otherStart。 */
export function isTimeOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const aStart = Date.parse(startA);
  const aEnd = Date.parse(endA);
  const bStart = Date.parse(startB);
  const bEnd = Date.parse(endB);
  if ([aStart, aEnd, bStart, bEnd].some((value) => Number.isNaN(value))) return false;
  return aStart < bEnd && aEnd > bStart;
}
