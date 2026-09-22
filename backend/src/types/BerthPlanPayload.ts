/** 提交靠泊计划请求体。 */
export interface BerthPlanSubmitPayload {
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority?: string;
  dispatcher_id?: number;
}

/** 审批靠泊计划请求体，必须显式指定一个箱位。 */
export interface BerthPlanApprovePayload {
  yard_slot_id: number;
  dispatcher_id?: number;
}

export type BerthPlanPayload = BerthPlanSubmitPayload | BerthPlanApprovePayload | Record<string, unknown>;
