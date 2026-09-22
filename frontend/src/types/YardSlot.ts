export interface YardSlot {
  id: number;
  yard_area: string;
  row_no: string;
  bay_no: string;
  tier_no: string;
  container_no: string;
  slot_status: string;
  cargo_type: string;
  /** 预留该箱位的靠泊计划，与 BerthPlan.yard_slot_id 互为镜像 */
  reserved_by_plan_id: number | null;
}
