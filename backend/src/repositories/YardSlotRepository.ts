import { seed } from "../seed";
import type { YardSlot } from "../models/YardSlot";
import { InMemoryRepository } from "./inMemoryRepository";

class YardSlotRepository extends InMemoryRepository<YardSlot> {
  save(row: YardSlot): YardSlot {
    return this.insert(row);
  }

  /** 箱位预留：仅当箱位仍为空时生效，返回 false 表示已被并发请求抢占 */
  reserve(id: number, planId: number): boolean {
    const slot = this.findById(id);
    if (!slot || slot.slot_status !== "EMPTY") return false;
    slot.slot_status = "RESERVED";
    slot.reserved_by_plan_id = planId;
    return true;
  }
}

export const yardSlotRepository = new YardSlotRepository(seed.yardSlot);
