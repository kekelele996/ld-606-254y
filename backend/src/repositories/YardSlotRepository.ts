import { db } from "./inMemoryDb";
import type { YardSlot } from "../models/YardSlot";

export const yardSlotRepository = {
  findAll(): YardSlot[] {
    return db.yardSlot as YardSlot[];
  },
  findById(id: number): YardSlot | undefined {
    return (db.yardSlot as YardSlot[]).find((row) => row.id === id);
  },
  insert(row: YardSlot): YardSlot {
    db.yardSlot.push(row);
    return row;
  },
  update(id: number, patch: Partial<YardSlot>): YardSlot {
    const row = this.findById(id);
    if (!row) throw Object.assign(new Error(`yard slot ${id} not found`), { status: 404, code: "SLOT_NOT_FOUND" });
    Object.assign(row, patch);
    return row;
  }
};
