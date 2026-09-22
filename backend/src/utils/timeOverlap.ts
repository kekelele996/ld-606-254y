/** 半开区间重叠判断：[arrival, departure)，端点相接（前船离=后船到）不算冲突 */
export const isTimeOverlap = (
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean => startA.getTime() < endB.getTime() && startB.getTime() < endA.getTime();

export const parsePlanTime = (value: unknown): Date | null => {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const time = new Date(value);
  return Number.isNaN(time.getTime()) ? null : time;
};

export const describeOverlap = (
  arrival: Date,
  departure: Date,
  otherArrival: Date,
  otherDeparture: Date
): string =>
  `在港时间 ${arrival.toISOString()}~${departure.toISOString()} 与已批准计划 ${otherArrival.toISOString()}~${otherDeparture.toISOString()} 重叠`;
