export type YardSlotStatusValue = "EMPTY" | "RESERVED" | "OCCUPIED" | "LOCKED";

export interface YardSlot {
  id: number;
  yard_area: string;
  row_no: string;
  bay_no: string;
  tier_no: string;
  container_no: string;
  slot_status: YardSlotStatusValue | string;
  cargo_type: string;
  reserved_by_plan: number | null;
}

/** 后端堆场视图对象。 */
export interface YardSlotView extends YardSlot {
  slot_code: string;
  occupied_by_plan: number | null;
}
