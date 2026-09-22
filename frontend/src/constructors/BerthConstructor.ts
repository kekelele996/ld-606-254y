import type { Berth } from "../types/Berth";

export const createDefaultBerth = (overrides: Partial<Berth> = {}): Berth => ({
  id: 0,
  berth_code: "B-01",
  length_m: 300,
  water_depth_m: 15,
  berth_type: "CONTAINER",
  current_status: "AVAILABLE",
  safety_note: "",
  ...overrides
});

export const createBerthForm = createDefaultBerth;
export const createBerthResponse = createDefaultBerth;
