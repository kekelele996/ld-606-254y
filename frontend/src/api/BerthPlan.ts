import { mockData } from "../mocks/seedData";
import { request } from "./http";
import type {
  BerthPlanApproveForm,
  BerthPlanApproveResult,
  BerthPlanConflict,
  BerthPlanSubmitForm,
  BerthPlanSubmitResult,
  BerthPlanView
} from "../types/BerthPlan";

const endpoint = "/api/berth-plan";

export async function listBerthPlan(): Promise<BerthPlanView[]> {
  try {
    return await request<BerthPlanView[]>(endpoint);
  } catch (error) {
    console.warn("listBerthPlan fallback to mock", error);
    return [...(mockData.berthPlan as unknown as BerthPlanView[])];
  }
}

/** 提交计划：返回保存的计划与全部冲突计划。 */
export function submitBerthPlan(form: BerthPlanSubmitForm): Promise<BerthPlanSubmitResult> {
  return request<BerthPlanSubmitResult>(endpoint, {
    method: "POST",
    body: JSON.stringify(form)
  });
}

/** 查询某计划当前的冲突原因。 */
export function listBerthPlanConflicts(planId: number): Promise<BerthPlanConflict[]> {
  return request<BerthPlanConflict[]>(`${endpoint}/${planId}/conflicts`);
}

/** 审批计划：必须指定空箱位，成功后计划与箱位预留同时生效。 */
export function approveBerthPlan(planId: number, form: BerthPlanApproveForm): Promise<BerthPlanApproveResult> {
  return request<BerthPlanApproveResult>(`${endpoint}/${planId}/approve`, {
    method: "POST",
    body: JSON.stringify(form)
  });
}
