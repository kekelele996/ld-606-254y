import type { YardSlot } from "../types/YardSlot";

export const createDefaultYardSlot = (overrides: Partial<YardSlot> = {}): YardSlot => ({
  id: 0,
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

export const createYardSlotForm = createDefaultYardSlot;
export const createYardSlotResponse = createDefaultYardSlot;
