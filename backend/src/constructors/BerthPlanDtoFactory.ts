import type { BerthPlan } from "../models/BerthPlan";
import type { Vessel } from "../models/Vessel";
import type { Berth } from "../models/Berth";
import type { YardSlot } from "../models/YardSlot";

export const createBerthPlanDto = (overrides: Partial<BerthPlan> = {}): BerthPlan => ({
  id: 1,
  vessel_id: 1,
  berth_id: 1,
  planned_arrival: "2026-09-22T08:00:00.000Z",
  planned_departure: "2026-09-22T18:00:00.000Z",
  priority: "NORMAL",
  status: "DRAFT",
  dispatcher_id: 1,
  reserved_slot_id: null,
  ...overrides
});

/** 提交计划后随冲突列表一起返回的冲突计划详情（附带船舶/泊位名称与冲突原因）。 */
export interface BerthPlanConflictDto extends BerthPlan {
  vessel_name: string;
  berth_code: string;
  conflict_reason: string;
}

export function createBerthPlanConflictDto(
  plan: BerthPlan,
  vessel: Vessel | undefined,
  berth: Berth | undefined,
  reason: string
): BerthPlanConflictDto {
  return {
    ...createBerthPlanDto(plan),
    vessel_name: vessel?.vessel_name ?? `#${plan.vessel_id}`,
    berth_code: berth?.berth_code ?? `#${plan.berth_id}`,
    conflict_reason: reason
  };
}

/** 列表/详情响应：联表补齐船舶、泊位和预留箱位的展示字段。 */
export interface BerthPlanViewDto extends BerthPlan {
  vessel_name: string;
  berth_code: string;
  reserved_slot_code: string | null;
}

export function createBerthPlanViewDto(
  plan: BerthPlan,
  vessel: Vessel | undefined,
  berth: Berth | undefined,
  slot: YardSlot | undefined
): BerthPlanViewDto {
  return {
    ...createBerthPlanDto(plan),
    vessel_name: vessel?.vessel_name ?? `#${plan.vessel_id}`,
    berth_code: berth?.berth_code ?? `#${plan.berth_id}`,
    reserved_slot_code: slot ? `${slot.yard_area}-${slot.row_no}-${slot.bay_no}-${slot.tier_no}` : null
  };
}
