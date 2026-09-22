import type { BerthPlan } from "../types/BerthPlan";

/**
 * 泊位冲突视图 hook：从计划列表派生冲突计划、计划 -> 冲突原因映射与统计。
 * 冲突原因以后端提交时落库的 conflict_reason / conflict_plan_ids 为准。
 */
export function useBerthConflict(plans: BerthPlan[] = []) {
  const conflictPlans = plans.filter((plan) => plan.status === "CONFLICT");
  const reasonMap = new Map<number, string>(
    conflictPlans.map((plan) => [plan.id, plan.conflict_reason ?? "在港时间与已批准计划重叠"])
  );
  return {
    conflictPlans,
    totalConflict: conflictPlans.length,
    reasonOf: (plan: BerthPlan): string => reasonMap.get(plan.id) ?? "",
    hasConflict: (plan: BerthPlan): boolean => plan.status === "CONFLICT" || plan.conflict_plan_ids.length > 0
  };
}
