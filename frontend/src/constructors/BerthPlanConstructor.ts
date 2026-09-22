import type { BerthPlan, BerthPlanSubmitForm, BerthPlanApproveForm } from "../types/BerthPlan";

export const createDefaultBerthPlan = (overrides: Partial<BerthPlan> = {}): BerthPlan => ({
  id: 0,
  vessel_id: 0,
  berth_id: 0,
  planned_arrival: "",
  planned_departure: "",
  priority: "NORMAL",
  status: "DRAFT",
  dispatcher_id: 1,
  reserved_slot_id: null,
  ...overrides
});

/** 泊位页“提交计划”表单默认对象。 */
export const createBerthPlanForm = (overrides: Partial<BerthPlanSubmitForm> = {}): BerthPlanSubmitForm => ({
  vessel_id: null,
  berth_id: null,
  planned_arrival: "",
  planned_departure: "",
  priority: "NORMAL",
  ...overrides
});

/** 审批对话框表单：必须显式选择一个空箱位。 */
export const createBerthPlanApproveForm = (overrides: Partial<BerthPlanApproveForm> = {}): BerthPlanApproveForm => ({
  yard_slot_id: null,
  ...overrides
});

export const createBerthPlanResponse = createDefaultBerthPlan;
