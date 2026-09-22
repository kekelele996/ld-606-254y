import { listVessel } from "../api/Vessel";
import type { Vessel } from "../types/Vessel";

export class VesselStore {
  rows: Vessel[] = [];
  loading = false;

  async load(): Promise<Vessel[]> {
    this.loading = true;
    try {
      this.rows = await listVessel();
      return this.rows;
    } finally {
      this.loading = false;
    }
  }
}

export const vesselStore = new VesselStore();
