import { berthPlanRepository, PROCESSED_PLAN_STATUSES } from "../repositories/BerthPlanRepository";
import { vesselRepository } from "../repositories/VesselRepository";
import { berthRepository } from "../repositories/BerthRepository";
import { yardSlotRepository } from "../repositories/YardSlotRepository";
import { runExclusive } from "../repositories/inMemoryRepository";
import { buildBerthPlan } from "../constructors/BerthPlanDtoFactory";
import type { BerthPlan } from "../models/BerthPlan";
import type { BerthPlanSubmitPayload, BerthPlanApprovePayload } from "../types/BerthPlanPayload";
import { AppError } from "../errors/AppError";
import { ERROR_CODES } from "../constants/errorCodes";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { toMetres, toId } from "../utils/numbers";
import { parsePlanTime, describeOverlap } from "../utils/timeOverlap";

export interface SubmitResult {
  plan: BerthPlan;
  /** 提交时发现的全部冲突计划（同泊位已批准且在港时间重叠） */
  conflicts: BerthPlan[];
}

export interface ApproveResult {
  plan: BerthPlan;
  conflicts: BerthPlan[];
}

const log = (template: string, detail: Record<string, unknown>) =>
  console.info(template, detail);

const validateSubmitPayload = (row: unknown): BerthPlanSubmitPayload => {
  const payload = (row ?? {}) as Record<string, unknown>;
  const arrival = parsePlanTime(payload.planned_arrival);
  const departure = parsePlanTime(payload.planned_departure);
  if (
    !arrival ||
    !departure ||
    arrival.getTime() >= departure.getTime() ||
    !Number.isInteger(Number(payload.vessel_id)) ||
    !Number.isInteger(Number(payload.berth_id))
  ) {
    throw new AppError(
      ERROR_CODES.VALIDATION_FAILED,
      400,
      arrival && departure && arrival.getTime() >= departure.getTime()
        ? "planned arrival must be earlier than planned departure"
        : undefined
    );
  }
  return {
    vessel_id: Number(payload.vessel_id),
    berth_id: Number(payload.berth_id),
    planned_arrival: payload.planned_arrival as string,
    planned_departure: payload.planned_departure as string,
    priority: payload.priority as string | undefined,
    dispatcher_id: Number.isInteger(Number(payload.dispatcher_id))
      ? Number(payload.dispatcher_id)
      : undefined
  };
};

export const berthPlanService = {
  list: (): BerthPlan[] => berthPlanRepository.findAll(),

  getById(planIdRaw: unknown): BerthPlan {
    const planId = toId(planIdRaw);
    const plan = Number.isInteger(planId) ? berthPlanRepository.findById(planId) : undefined;
    if (!plan) throw new AppError(ERROR_CODES.PLAN_NOT_FOUND, 404);
    return plan;
  },

  /**
   * 提交靠泊计划：
   * 记录始终保留；与同一泊位已批准计划在港时间重叠时标为 CONFLICT 并回填冲突原因，
   * 返回体携带全部冲突计划供泊位页展示。
   */
  submit(row: unknown, dispatcherId: number): SubmitResult {
    const payload = validateSubmitPayload(row);

    const vessel = vesselRepository.findById(payload.vessel_id);
    if (!vessel) throw new AppError(ERROR_CODES.VESSEL_NOT_FOUND, 404);
    const berth = berthRepository.findById(payload.berth_id);
    if (!berth) throw new AppError(ERROR_CODES.BERTH_NOT_FOUND, 404);

    const arrival = new Date(payload.planned_arrival);
    const departure = new Date(payload.planned_departure);

    const plan = buildBerthPlan(payload, dispatcherId);
    const conflicts = berthPlanRepository.findOverlappingApproved(
      payload.berth_id,
      arrival,
      departure
    );

    if (conflicts.length > 0) {
      const reason = conflicts
        .map((conflict) => {
          const start = new Date(conflict.planned_arrival);
          const end = new Date(conflict.planned_departure);
          return `与已批准计划 #${conflict.id}（泊位 ${berth.berth_code}）${describeOverlap(
            arrival,
            departure,
            start,
            end
          )}`;
        })
        .join("；");
      plan.status = "CONFLICT";
      plan.conflict_reason = reason;
      plan.conflict_plan_ids = conflicts.map((conflict) => conflict.id);
      log(LOG_TEMPLATES.BerthPlan[5], { planId: plan.id, conflicts: plan.conflict_plan_ids });
    } else {
      log(LOG_TEMPLATES.BerthPlan[4], { planId: plan.id });
    }

    berthPlanRepository.save(plan);
    return { plan, conflicts };
  },

  create(row: unknown, dispatcherId: number): SubmitResult {
    return berthPlanService.submit(row, dispatcherId);
  },

  /** 计划当前的全部冲突（即使冲突方计划后来变化，也以当前数据实时计算，并保留历史冲突原因） */
  conflictsOf(plan: BerthPlan): BerthPlan[] {
    return berthPlanRepository.findOverlappingApproved(
      plan.berth_id,
      new Date(plan.planned_arrival),
      new Date(plan.planned_departure),
      plan.id
    );
  },

  /**
   * 审批靠泊计划（指定空箱位）。
   * 以下任一情况整次拒绝、计划与箱位都不变化：
   *  - 计划不存在 / 已被处理（APPROVED、BERTHING、DEPARTED、CANCELLED）
   *  - 船舶长度或吃水不符泊位限制
   *  - 箱位不存在 / 已非空
   * 临界区内完成"再校验 + 双写"，重复或并发审批只有一次成功。
   */
  approve(planIdRaw: unknown, body: unknown): Promise<ApproveResult> {
    const planId = toId(planIdRaw);
    if (!Number.isInteger(planId)) {
      throw new AppError(ERROR_CODES.VALIDATION_FAILED, 400);
    }
    const payload = (body ?? {}) as BerthPlanApprovePayload;
    const slotId = toId(payload.yard_slot_id);
    if (!Number.isInteger(slotId)) {
      throw new AppError(
        ERROR_CODES.VALIDATION_FAILED,
        400,
        "approval request must specify yard_slot_id"
      );
    }

    return runExclusive(() => {
      const plan = berthPlanRepository.findById(planId);
      if (!plan) throw new AppError(ERROR_CODES.PLAN_NOT_FOUND, 404);
      if (PROCESSED_PLAN_STATUSES.includes(plan.status as (typeof PROCESSED_PLAN_STATUSES)[number])) {
        throw new AppError(ERROR_CODES.PLAN_ALREADY_PROCESSED, 409);
      }

      const vessel = vesselRepository.findById(plan.vessel_id);
      if (!vessel) throw new AppError(ERROR_CODES.VESSEL_NOT_FOUND, 404);
      const berth = berthRepository.findById(plan.berth_id);
      if (!berth) throw new AppError(ERROR_CODES.BERTH_NOT_FOUND, 404);

      // 船舶长度或吃水不符泊位限制：整次拒绝
      const vesselLength = toMetres(vessel.length_m);
      const vesselDraft = toMetres(vessel.draft_m);
      const berthLength = toMetres(berth.length_m);
      const berthDepth = toMetres(berth.water_depth_m);
      if (
        Number.isNaN(vesselLength) ||
        Number.isNaN(vesselDraft) ||
        Number.isNaN(berthLength) ||
        Number.isNaN(berthDepth) ||
        vesselLength > berthLength ||
        vesselDraft > berthDepth
      ) {
        throw new AppError(
          ERROR_CODES.VESSEL_BERTH_MISMATCH,
          422,
          `船舶 ${vessel.vessel_name}（长 ${vessel.length_m}m / 吃水 ${vessel.draft_m}m）不符泊位 ${berth.berth_code} 限制（长 ${berth.length_m}m / 水深 ${berth.water_depth_m}m）`
        );
      }

      const slot = yardSlotRepository.findById(slotId);
      if (!slot) throw new AppError(ERROR_CODES.SLOT_NOT_FOUND, 404);
      // 箱位已非空（含 RESERVED/OCCUPIED/LOCKED）：整次拒绝
      if (slot.slot_status !== "EMPTY") {
        throw new AppError(
          ERROR_CODES.SLOT_NOT_EMPTY,
          409,
          `箱位 #${slot.id}（${slot.yard_area} ${slot.row_no}-${slot.bay_no}-${slot.tier_no}）当前状态 ${slot.slot_status}，不再为空`
        );
      }

      // 双写：计划置为 APPROVED 与箱位置为 RESERVED 同时生效
      const approvedAt = new Date().toISOString();
      berthPlanRepository.update(planId, {
        status: "APPROVED",
        yard_slot_id: slotId,
        approved_at: approvedAt
      });
      const reserved = yardSlotRepository.reserve(slotId, planId);
      // 临界区内仍被抢占（理论上不可达，保留双保险保证两者绝不部分成功）
      if (!reserved) {
        throw new AppError(ERROR_CODES.SLOT_NOT_EMPTY, 409);
      }

      log(LOG_TEMPLATES.BerthPlan[6], { planId, yardSlotId: slotId });
      log(LOG_TEMPLATES.YardSlot[4], { yardSlotId: slotId, planId });

      const updated = berthPlanRepository.findById(planId) as BerthPlan;
      return { plan: updated, conflicts: berthPlanService.conflictsOf(updated) };
    });
  }
};
