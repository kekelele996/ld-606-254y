import type { YardSlot } from "../types/YardSlot";

/**
 * 堆场矩阵 hook：箱位占用结果的派生统计，堆场页与总览页共用。
 */
export function useYardMatrix(slots: YardSlot[] = []) {
  const countBy = (status: string) => slots.filter((slot) => slot.slot_status === status).length;
  return {
    total: slots.length,
    empty: countBy("EMPTY"),
    reserved: countBy("RESERVED"),
    occupied: countBy("OCCUPIED"),
    locked: countBy("LOCKED"),
    /** 审批面板可选的空箱位 */
    emptySlots: slots.filter((slot) => slot.slot_status === "EMPTY"),
    occupancyRate: slots.length === 0 ? 0 : Math.round(((slots.length - countBy("EMPTY")) / slots.length) * 100)
  };
}
