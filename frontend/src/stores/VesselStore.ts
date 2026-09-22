import { Injectable, signal } from "@angular/core";
import { listVessel } from "../api/Vessel";
import type { Vessel } from "../types/Vessel";

@Injectable({ providedIn: "root" })
export class VesselStore {
  readonly vessels = signal<Vessel[]>([]);
  readonly loading = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.vessels.set(await listVessel());
    } finally {
      this.loading.set(false);
    }
  }
}
