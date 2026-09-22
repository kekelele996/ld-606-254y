import { seed } from "../seed";
import type { BerthPlan } from "../models/BerthPlan";
import { InMemoryRepository } from "./inMemoryRepository";

/** 在港期间视为"占用泊位"的计划状态：已批准、靠泊中 */
export const ACTIVE_PLAN_STATUSES = ["APPROVED", "BERTHING"] as const;

/** 已被处理、不可再次审批的状态 */
export const PROCESSED_PLAN_STATUSES = ["APPROVED", "BERTHING", "DEPARTED", "CANCELLED"] as const;

class BerthPlanRepository extends InMemoryRepository<BerthPlan> {
  save(row: BerthPlan): BerthPlan {
    return this.insert(row);
  }

  /** 同一泊位上、在港时间与给定区间重叠的已批准（含靠泊中）计划 */
  findOverlappingApproved(
    berthId: number,
    arrival: Date,
    departure: Date,
    excludePlanId?: number
  ): BerthPlan[] {
    return this.findAll().filter((plan) => {
      if (plan.berth_id !== berthId || plan.id === excludePlanId) return false;
      if (!ACTIVE_PLAN_STATUSES.includes(plan.status as (typeof ACTIVE_PLAN_STATUSES)[number])) {
        return false;
      }
      const start = new Date(plan.planned_arrival);
      const end = new Date(plan.planned_departure);
      return start.getTime() < departure.getTime() && arrival.getTime() < end.getTime();
    });
  }

  update(id: number, patch: Partial<BerthPlan>): BerthPlan | undefined {
    const plan = this.findById(id);
    if (!plan) return undefined;
    Object.assign(plan, patch);
    return plan;
  }
}

export const berthPlanRepository = new BerthPlanRepository(seed.berthPlan);
