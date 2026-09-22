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
