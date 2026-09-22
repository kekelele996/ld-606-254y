import { listYardSlot } from "../api/YardSlot";
import type { YardSlot } from "../types/YardSlot";

export class YardSlotStore {
  rows: YardSlot[] = [];
  loading = false;

  async load(): Promise<YardSlot[]> {
    this.loading = true;
    try {
      this.rows = await listYardSlot();
      return this.rows;
    } finally {
      this.loading = false;
    }
  }

  /** 审批联动后刷新占用结果：RESERVED 行带 reserved_by_plan_id */
  async reload(): Promise<YardSlot[]> {
    return this.load();
  }
}

export const yardSlotStore = new YardSlotStore();
