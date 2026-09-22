import type { Vessel } from "../models/Vessel";

export const createVesselDto = (overrides: Partial<Vessel> = {}): Vessel => ({
  id: 1,
  vessel_name: "远洋先锋",
  imo_no: "IMO-9472816",
  carrier: "中远海运",
  length_m: 220,
  draft_m: 11.5,
  eta: "2026-09-22T06:00:00.000Z",
  etd: "2026-09-22T20:00:00.000Z",
  status: "EXPECTED",
  ...overrides
});
