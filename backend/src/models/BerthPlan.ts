export interface BerthPlan {
  id: number;
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority: string;
  status: string;
  dispatcher_id: number;
  /** 冲突原因：提交时与同泊位已批准计划的在港时间重叠时写入，审批后保留作为历史痕迹 */
  conflict_reason: string | null;
  /** 全部冲突的已批准计划 id */
  conflict_plan_ids: number[];
  /** 审批通过时联动预留的堆场箱位 */
  yard_slot_id: number | null;
  approved_at: string | null;
}
