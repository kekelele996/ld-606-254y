import type { YardSlot } from "../models/YardSlot";

export const createYardSlotDto = (overrides: Partial<YardSlot> = {}): YardSlot => ({
  id: 1,
  yard_area: "A区",
  row_no: "01",
  bay_no: "01",
  tier_no: "00",
  container_no: "",
  slot_status: "EMPTY",
  cargo_type: "GENERAL",
  reserved_by_plan_id: null,
  ...overrides
});
