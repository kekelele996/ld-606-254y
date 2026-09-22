import { listBerth } from "../api/Berth";
import type { Berth } from "../types/Berth";

export class BerthStore {
  rows: Berth[] = [];
  loading = false;

  async load(): Promise<Berth[]> {
    this.loading = true;
    try {
      this.rows = await listBerth();
      return this.rows;
    } finally {
      this.loading = false;
    }
  }
}

export const berthStore = new BerthStore();
