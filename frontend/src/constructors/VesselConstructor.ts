import type { Vessel } from "../types/Vessel";

export const createDefaultVessel = (overrides: Partial<Vessel> = {}): Vessel => ({
  id: 0,
  vessel_name: "",
  imo_no: "",
  carrier: "",
  length_m: 0,
  draft_m: 0,
  eta: "",
  etd: "",
  status: "EXPECTED",
  ...overrides
});

export const createVesselForm = createDefaultVessel;
export const createVesselResponse = createDefaultVessel;
