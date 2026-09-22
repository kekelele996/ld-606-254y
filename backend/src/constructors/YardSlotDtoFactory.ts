import type { YardSlot } from "../models/YardSlot";

export const createYardSlotDto = (overrides: Partial<YardSlot> = {}): YardSlot => ({
  id: 1,
  yard_area: "A",
  row_no: "R1",
  bay_no: "B1",
  tier_no: "T1",
  container_no: "",
  slot_status: "EMPTY",
  cargo_type: "EMPTY",
  reserved_by_plan: null,
  ...overrides
});

/** 堆场页展示对象：补充占用计划编号，方便页面显示“被哪个计划占用”。 */
export interface YardSlotViewDto extends YardSlot {
  slot_code: string;
  occupied_by_plan: number | null;
}

export function createYardSlotViewDto(slot: YardSlot): YardSlotViewDto {
  return {
    ...createYardSlotDto(slot),
    slot_code: `${slot.yard_area}-${slot.row_no}-${slot.bay_no}-${slot.tier_no}`,
    occupied_by_plan: slot.reserved_by_plan
  };
}
