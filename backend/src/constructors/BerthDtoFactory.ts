import type { Berth } from "../models/Berth";

export const createBerthDto = (overrides: Partial<Berth> = {}): Berth => ({
  id: 1,
  berth_code: "B-01",
  length_m: 300,
  water_depth_m: 15,
  berth_type: "CONTAINER",
  current_status: "AVAILABLE",
  safety_note: "",
  ...overrides
});
