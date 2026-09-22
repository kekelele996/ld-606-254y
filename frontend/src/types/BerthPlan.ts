export interface BerthPlan {
  id: number;
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority: string;
  status: string;
  dispatcher_id: number;
  /** 冲突原因：与同泊位已批准计划在港时间重叠时由后端写入 */
  conflict_reason: string | null;
  /** 全部冲突计划 id */
  conflict_plan_ids: number[];
  /** 审批通过时联动预留的堆场箱位 */
  yard_slot_id: number | null;
  approved_at: string | null;
}

/** 提交靠泊计划请求体（箱位在审批阶段才指定） */
export interface BerthPlanSubmitPayload {
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority?: string;
  dispatcher_id?: number;
}

/** 审批请求体：必须指定空箱位 */
export interface BerthPlanApprovePayload {
  yard_slot_id: number;
}

/** 提交/审批接口统一返回：当前计划 + 全部冲突计划 */
export interface BerthPlanResult {
  plan: BerthPlan;
  conflicts: BerthPlan[];
}
