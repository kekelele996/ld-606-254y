import type { BerthPlan, BerthPlanSubmitPayload } from "../types/BerthPlan";

export const createDefaultBerthPlan = (overrides: Partial<BerthPlan> = {}): BerthPlan => ({
  id: 0,
  vessel_id: 0,
  berth_id: 0,
  planned_arrival: "",
  planned_departure: "",
  priority: "NORMAL",
  status: "DRAFT",
  dispatcher_id: 1,
  conflict_reason: null,
  conflict_plan_ids: [],
  yard_slot_id: null,
  approved_at: null,
  ...overrides
});

/** 提交表单默认结构（页面/store 不得散写） */
export const createBerthPlanForm = (
  overrides: Partial<BerthPlanSubmitPayload> = {}
): BerthPlanSubmitPayload => ({
  vessel_id: 0,
  berth_id: 0,
  planned_arrival: "",
  planned_departure: "",
  priority: "NORMAL",
  ...overrides
});

export const createBerthPlanResponse = createDefaultBerthPlan;
