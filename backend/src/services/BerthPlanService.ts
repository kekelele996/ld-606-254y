import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import { berthRepository } from "../repositories/BerthRepository";
import { vesselRepository } from "../repositories/VesselRepository";
import { yardSlotRepository } from "../repositories/YardSlotRepository";
import { nextId, runInLock } from "../repositories/inMemoryDb";
import { BerthPlanStatus } from "../constants/BerthPlanStatus";
import { YardSlotStatus } from "../constants/YardSlotStatus";
import { ServiceError } from "../utils/ServiceError";
import { isTimeOverlap } from "../utils/conflict";
import {
  createBerthPlanConflictDto,
  createBerthPlanDto,
  createBerthPlanViewDto,
  type BerthPlanConflictDto,
  type BerthPlanViewDto
} from "../constructors/BerthPlanDtoFactory";
import { recordAuditLog } from "./AuditLogService";
import type { BerthPlanSubmitPayload, BerthPlanApprovePayload } from "../types/BerthPlanPayload";
import type { BerthPlan } from "../models/BerthPlan";
import type { Vessel } from "../models/Vessel";
import type { Berth } from "../models/Berth";

/** 已被处理、不再允许审批的计划状态。 */
const PROCESSED_STATUSES = new Set<string>([
  BerthPlanStatus[2], // APPROVED
  BerthPlanStatus[3], // BERTHING
  BerthPlanStatus[4], // DEPARTED
  BerthPlanStatus[5] // CANCELLED
]);

function buildConflictReason(plan: BerthPlan, vessel: Vessel | undefined, berth: Berth | undefined): string {
  return `与同泊位 ${berth?.berth_code ?? "#" + plan.berth_id} 已批准计划 #${plan.id}（${
    vessel?.vessel_name ?? "船舶#" + plan.vessel_id
  }，${plan.planned_arrival} ~ ${plan.planned_departure}）在港时间重叠`;
}

export interface SubmitResult {
  plan: BerthPlanViewDto;
  has_conflict: boolean;
  conflicts: BerthPlanConflictDto[];
}

export interface ApproveResult {
  plan: BerthPlanViewDto;
  slot: ReturnType<typeof createSlotSummary>;
}

function createSlotSummary(slotId: number) {
  const slot = yardSlotRepository.findById(slotId);
  if (!slot) return null;
  return {
    id: slot.id,
    slot_code: `${slot.yard_area}-${slot.row_no}-${slot.bay_no}-${slot.tier_no}`,
    slot_status: slot.slot_status,
    occupied_by_plan: slot.reserved_by_plan
  };
}

export const berthPlanService = {
  list(): BerthPlanViewDto[] {
    return berthPlanRepository.findAll().map((plan) =>
      createBerthPlanViewDto(
        plan,
        vesselRepository.findById(plan.vessel_id),
        berthRepository.findById(plan.berth_id),
        plan.reserved_slot_id == null ? undefined : yardSlotRepository.findById(plan.reserved_slot_id)
      )
    );
  },

  /**
   * 提交靠泊计划。
   * 与同泊位已批准（APPROVED）计划的在港时间窗重叠时，记录照常保留，
   * 但状态标记为 CONFLICT，并在响应中返回全部冲突的已批准计划。
   */
  submit(payload: BerthPlanSubmitPayload): SubmitResult {
    const vesselId = Number(payload.vessel_id);
    const berthId = Number(payload.berth_id);
    const arrival = String(payload.planned_arrival ?? "");
    const departure = String(payload.planned_departure ?? "");

    const vessel = vesselRepository.findById(vesselId);
    if (!vessel) throw new ServiceError("VESSEL_NOT_FOUND", 404, `vessel ${vesselId}`);
    const berth = berthRepository.findById(berthId);
    if (!berth) throw new ServiceError("BERTH_NOT_FOUND", 404, `berth ${berthId}`);
    if (!arrival || !departure || Date.parse(departure) <= Date.parse(arrival)) {
      throw new ServiceError("INVALID_TIME_RANGE", 400);
    }

    const conflicts = this.findApprovedOverlaps(berthId, arrival, departure);
    const status = conflicts.length > 0 ? BerthPlanStatus[1] : BerthPlanStatus[0];

    const saved = berthPlanRepository.insert(
      createBerthPlanDto({
        id: nextId(berthPlanRepository.findAll()),
        vessel_id: vesselId,
        berth_id: berthId,
        planned_arrival: new Date(arrival).toISOString(),
        planned_departure: new Date(departure).toISOString(),
        priority: payload.priority ?? "NORMAL",
        status,
        dispatcher_id: payload.dispatcher_id ?? 1,
        reserved_slot_id: null
      })
    );

    recordAuditLog({
      actor: `dispatcher#${saved.dispatcher_id}`,
      action: conflicts.length > 0 ? "BerthPlan.conflict" : "BerthPlan.submit",
      target_type: "BerthPlan",
      target_id: String(saved.id),
      detail: `berth=${berth.berth_code}; conflicts=${conflicts.map((row) => row.id).join(",") || "none"}`
    });

    return {
      plan: createBerthPlanViewDto(
        saved,
        vessel,
        berth,
        saved.reserved_slot_id == null ? undefined : yardSlotRepository.findById(saved.reserved_slot_id)
      ),
      has_conflict: conflicts.length > 0,
      conflicts: conflicts.map((row) =>
        createBerthPlanConflictDto(
          row,
          vesselRepository.findById(row.vessel_id),
          berthRepository.findById(row.berth_id),
          buildConflictReason(row, vesselRepository.findById(row.vessel_id), berthRepository.findById(row.berth_id))
        )
      )
    };
  },

  /** 返回与给定时间窗（同泊位）重叠的全部已批准计划。 */
  findApprovedOverlaps(berthId: number, arrival: string, departure: string, excludePlanId?: number): BerthPlan[] {
    return berthPlanRepository.findAll().filter(
      (plan) =>
        plan.berth_id === berthId &&
        plan.id !== excludePlanId &&
        plan.status === BerthPlanStatus[2] &&
        isTimeOverlap(arrival, departure, plan.planned_arrival, plan.planned_departure)
    );
  },

  /** 泊位页查询某个计划当前需要展示的冲突原因。 */
  describeConflicts(planId: number): BerthPlanConflictDto[] {
    const plan = berthPlanRepository.findById(planId);
    if (!plan) throw new ServiceError("PLAN_NOT_FOUND", 404, `plan ${planId}`);
    return this.findApprovedOverlaps(plan.berth_id, plan.planned_arrival, plan.planned_departure, plan.id).map((row) =>
      createBerthPlanConflictDto(
        row,
        vesselRepository.findById(row.vessel_id),
        berthRepository.findById(row.berth_id),
        buildConflictReason(row, vesselRepository.findById(row.vessel_id), berthRepository.findById(row.berth_id))
      )
    );
  },

  /**
   * 审批靠泊计划并联动预留箱位。
   * 以下任一条件不满足则整次拒绝，计划与箱位都不发生变化：
   *  - 请求必须指定空箱位；
   *  - 船舶长度 / 吃水必须符合泊位限制；
   *  - 箱位此刻仍为 EMPTY；
   *  - 计划尚未被处理（DRAFT / CONFLICT 才可审批）。
   * 通过后计划置 APPROVED 且箱位置 RESERVED，二者在同一个锁内同时生效；
   * 重复提交或并发审批只有一个请求能成功。
   */
  approve(planId: number, payload: BerthPlanApprovePayload): ApproveResult {
    const slotId = Number(payload?.yard_slot_id);
    if (!Number.isFinite(slotId) || slotId <= 0) {
      throw new ServiceError("SLOT_REQUIRED", 400);
    }

    return runInLock(`berth-plan:${planId}`, () => {
      const plan = berthPlanRepository.findById(planId);
      if (!plan) throw new ServiceError("PLAN_NOT_FOUND", 404, `plan ${planId}`);
      if (PROCESSED_STATUSES.has(plan.status)) {
        throw new ServiceError("PLAN_ALREADY_PROCESSED", 409, `status=${plan.status}`);
      }

      const vessel = vesselRepository.findById(plan.vessel_id);
      if (!vessel) throw new ServiceError("VESSEL_NOT_FOUND", 404, `vessel ${plan.vessel_id}`);
      const berth = berthRepository.findById(plan.berth_id);
      if (!berth) throw new ServiceError("BERTH_NOT_FOUND", 404, `berth ${plan.berth_id}`);

      // 泊位物理限制：超长 / 超吃水整次拒绝。
      if (Number(vessel.length_m) > Number(berth.length_m)) {
        throw new ServiceError("BERTH_LENGTH_EXCEEDED", 422, `vessel=${vessel.length_m}m > berth=${berth.length_m}m`);
      }
      if (Number(vessel.draft_m) > Number(berth.water_depth_m)) {
        throw new ServiceError("BERTH_DRAFT_EXCEEDED", 422, `draft=${vessel.draft_m}m > depth=${berth.water_depth_m}m`);
      }

      const slot = yardSlotRepository.findById(slotId);
      if (!slot) throw new ServiceError("SLOT_NOT_FOUND", 404, `slot ${slotId}`);
      if (slot.slot_status !== YardSlotStatus[0]) {
        throw new ServiceError("SLOT_NOT_EMPTY", 409, `slot=${slotId}; status=${slot.slot_status}`);
      }

      // 校验全部通过后才写入：计划与箱位同时生效，任一前置失败都不会到达这里。
      yardSlotRepository.update(slotId, {
        slot_status: YardSlotStatus[1], // RESERVED
        reserved_by_plan: planId
      });
      const updatedPlan = berthPlanRepository.update(planId, {
        status: BerthPlanStatus[2], // APPROVED
        reserved_slot_id: slotId
      });

      recordAuditLog({
        actor: `dispatcher#${payload.dispatcher_id ?? updatedPlan.dispatcher_id}`,
        action: "BerthPlan.approve",
        target_type: "BerthPlan",
        target_id: String(planId),
        detail: `slot=${slot.yard_area}-${slot.row_no}-${slot.bay_no}-${slot.tier_no}`
      });
      recordAuditLog({
        actor: `dispatcher#${payload.dispatcher_id ?? updatedPlan.dispatcher_id}`,
        action: "YardSlot.reserve",
        target_type: "YardSlot",
        target_id: String(slotId),
        detail: `plan=#${planId}`
      });

      return {
        plan: createBerthPlanViewDto(updatedPlan, vessel, berth, yardSlotRepository.findById(slotId)),
        slot: createSlotSummary(slotId)
      };
    });
  }
};
