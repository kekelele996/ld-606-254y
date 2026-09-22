export type BerthPlanStatusValue = "DRAFT" | "CONFLICT" | "APPROVED" | "BERTHING" | "DEPARTED" | "CANCELLED";

export interface BerthPlan {
  id: number;
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority: string;
  status: BerthPlanStatusValue | string;
  dispatcher_id: number;
  /** 审批联动预留的箱位 id。 */
  reserved_slot_id: number | null;
}

/** 后端列表/详情返回的联表视图对象。 */
export interface BerthPlanView extends BerthPlan {
  vessel_name: string;
  berth_code: string;
  reserved_slot_code: string | null;
}

/** 冲突计划详情。 */
export interface BerthPlanConflict extends BerthPlan {
  vessel_name: string;
  berth_code: string;
  conflict_reason: string;
}

/** POST /api/berth-plan 的提交结果。 */
export interface BerthPlanSubmitResult {
  plan: BerthPlanView;
  has_conflict: boolean;
  conflicts: BerthPlanConflict[];
}

/** POST /api/berth-plan/:id/approve 的审批结果。 */
export interface BerthPlanApproveResult {
  plan: BerthPlanView;
  slot: {
    id: number;
    slot_code: string;
    slot_status: string;
    occupied_by_plan: number | null;
  } | null;
}

export interface BerthPlanSubmitForm {
  vessel_id: number | null;
  berth_id: number | null;
  planned_arrival: string;
  planned_departure: string;
  priority: string;
}

export interface BerthPlanApproveForm {
  yard_slot_id: number | null;
}
