import type { BerthPlan } from "../models/BerthPlan";
import type { BerthPlanSubmitPayload } from "../types/BerthPlanPayload";
import { berthPlanRepository } from "../repositories/BerthPlanRepository";

/** 默认响应 DTO（保留给测试/种子构造使用） */
export const createBerthPlanDto = (overrides: Partial<BerthPlan> = {}): BerthPlan => ({
  id: 1,
  vessel_id: 1,
  berth_id: 1,
  planned_arrival: "2026-09-23T02:00:00Z",
  planned_departure: "2026-09-24T06:00:00Z",
  priority: "NORMAL",
  status: "DRAFT",
  dispatcher_id: 1,
  conflict_reason: null,
  conflict_plan_ids: [],
  yard_slot_id: null,
  approved_at: null,
  ...overrides
});

/** 由提交请求构造待落库的计划记录，默认 DRAFT，冲突标记由 service 决定 */
export const buildBerthPlan = (
  payload: BerthPlanSubmitPayload,
  dispatcherId: number
): BerthPlan => ({
  ...createBerthPlanDto(),
  id: berthPlanRepository.nextId(),
  vessel_id: Number(payload.vessel_id),
  berth_id: Number(payload.berth_id),
  planned_arrival: new Date(payload.planned_arrival).toISOString(),
  planned_departure: new Date(payload.planned_departure).toISOString(),
  priority: payload.priority ?? "NORMAL",
  dispatcher_id: payload.dispatcher_id ?? dispatcherId
});
