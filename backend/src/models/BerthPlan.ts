import type { BerthPlanStatus } from "../constants/BerthPlanStatus";

export interface BerthPlan {
  id: number;
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority: string;
  status: BerthPlanStatus | string;
  dispatcher_id: number;
  /** 审批通过后联动预留的堆场箱位；未审批为 null。 */
  reserved_slot_id: number | null;
}
