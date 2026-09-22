/** 两个半开时间窗是否重叠：start < otherEnd && end > otherStart。 */
export function isTimeOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const aStart = Date.parse(startA);
  const aEnd = Date.parse(endA);
  const bStart = Date.parse(startB);
  const bEnd = Date.parse(endB);
  if ([aStart, aEnd, bStart, bEnd].some((value) => Number.isNaN(value))) return false;
  return aStart < bEnd && aEnd > bStart;
}

/** 把箱位坐标拼接成可展示编码，例如 A-R1-B1-T1。 */
export function formatSlotCode(slot: { yard_area: string; row_no: string; bay_no: string; tier_no: string }): string {
  return `${slot.yard_area}-${slot.row_no}-${slot.bay_no}-${slot.tier_no}`;
}
