import { Injectable, signal } from "@angular/core";
import { listBerth } from "../api/Berth";
import { listVessel } from "../api/Vessel";
import type { Berth } from "../types/Berth";
import type { Vessel } from "../types/Vessel";

/** 泊位页共享的泊位 + 船舶基础数据。 */
@Injectable({ providedIn: "root" })
export class BerthStore {
  readonly berths = signal<Berth[]>([]);
  readonly vessels = signal<Vessel[]>([]);
  readonly loading = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const [berths, vessels] = await Promise.all([listBerth(), listVessel()]);
      this.berths.set(berths);
      this.vessels.set(vessels);
    } finally {
      this.loading.set(false);
    }
  }

  berthById(id: number | null | undefined): Berth | undefined {
    return this.berths().find((berth) => berth.id === id);
  }

  vesselById(id: number | null | undefined): Vessel | undefined {
    return this.vessels().find((vessel) => vessel.id === id);
  }
}
