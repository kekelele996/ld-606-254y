import { db } from "./inMemoryDb";
import type { BerthPlan } from "../models/BerthPlan";

export const berthPlanRepository = {
  findAll(): BerthPlan[] {
    return db.berthPlan as BerthPlan[];
  },
  findById(id: number): BerthPlan | undefined {
    return (db.berthPlan as BerthPlan[]).find((row) => row.id === id);
  },
  insert(row: BerthPlan): BerthPlan {
    db.berthPlan.push(row);
    return row;
  },
  update(id: number, patch: Partial<BerthPlan>): BerthPlan {
    const row = this.findById(id);
    if (!row) throw Object.assign(new Error(`berth plan ${id} not found`), { status: 404, code: "PLAN_NOT_FOUND" });
    Object.assign(row, patch);
    return row;
  }
};
