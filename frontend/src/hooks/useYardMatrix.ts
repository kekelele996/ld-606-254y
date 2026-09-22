import type { YardSlotView } from "../types/YardSlot";

export type YardMatrix = Record<string, YardSlotView[]>;

/** 堆场矩阵 hook（纯函数）：按堆场区分组，供 YardGrid 渲染。 */
export function useYardMatrix(slots: YardSlotView[]): { matrix: YardMatrix; areas: string[]; total: number } {
  const matrix: YardMatrix = {};
  for (const slot of slots) {
    (matrix[slot.yard_area] ??= []).push(slot);
  }
  for (const area of Object.keys(matrix)) {
    matrix[area].sort((a, b) => a.slot_code.localeCompare(b.slot_code));
  }
  return { matrix, areas: Object.keys(matrix).sort(), total: slots.length };
}

export function occupancyRate(slots: YardSlotView[]): number {
  if (slots.length === 0) return 0;
  const used = slots.filter((slot) => slot.slot_status !== "EMPTY").length;
  return Math.round((used / slots.length) * 100);
}
