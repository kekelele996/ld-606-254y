import type { YardSlotStatus } from "../constants/YardSlotStatus";

export interface YardSlot {
  id: number;
  yard_area: string;
  row_no: string;
  bay_no: string;
  tier_no: string;
  container_no: string;
  slot_status: YardSlotStatus | string;
  cargo_type: string;
  /** 占用/预留该箱位的靠泊计划 id；空闲为 null。 */
  reserved_by_plan: number | null;
}
