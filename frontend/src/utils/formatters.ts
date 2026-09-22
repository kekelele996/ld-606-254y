import { BerthPlanStatusText } from "../constants/BerthPlanStatus";
import { YardSlotStatusText } from "../constants/YardSlotStatus";

export const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("zh-CN", { hour12: false });
};

/** <input type="datetime-local"> 使用的值（无时区后缀）。 */
export const toDatetimeLocal = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatStatus = (value: string) =>
  (BerthPlanStatusText as Record<string, string>)[value] ??
  (YardSlotStatusText as Record<string, string>)[value] ??
  value.replace(/_/g, " ");

export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);

export const formatRisk = (value: string) =>
  ({ LOW: "低", NORMAL: "普通", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);

export const formatSlotCode = (slot: { yard_area: string; row_no: string; bay_no: string; tier_no: string }): string =>
  `${slot.yard_area}-${slot.row_no}-${slot.bay_no}-${slot.tier_no}`;
