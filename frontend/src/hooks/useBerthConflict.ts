import type { BerthPlanView } from "../types/BerthPlan";
import type { Berth } from "../types/Berth";
import { isTimeOverlap } from "../utils/timeRange";

export interface BerthConflictSummary {
  /** 指定泊位上与给定时间窗冲突的已批准计划。 */
  overlaps: BerthPlanView[];
  hasConflict: boolean;
  /** 当前处于 CONFLICT 状态、等待调度处理的计划数。 */
  pendingConflictCount: number;
}

/**
 * 泊位冲突检测 hook（纯函数，便于组件与甘特图复用）：
 * 仅与同一泊位“已批准”计划的在港时间窗比较。
 */
export function useBerthConflict(
  plans: BerthPlanView[],
  berths: Berth[],
  filter: { berthId?: number | null; arrival?: string; departure?: string } = {}
): BerthConflictSummary {
  const approved = plans.filter((plan) => plan.status === "APPROVED");
  const sameBerth = filter.berthId ? approved.filter((plan) => plan.berth_id === filter.berthId) : approved;
  const overlaps =
    filter.arrival && filter.departure
      ? sameBerth.filter((plan) => isTimeOverlap(filter.arrival!, filter.departure!, plan.planned_arrival, plan.planned_departure))
      : sameBerth;

  return {
    overlaps,
    hasConflict: overlaps.length > 0,
    pendingConflictCount: plans.filter((plan) => plan.status === "CONFLICT").length
  };
}

export function berthCode(berths: Berth[], id: number): string {
  return berths.find((berth) => berth.id === id)?.berth_code ?? `#${id}`;
}
