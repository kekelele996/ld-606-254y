import { mockData } from "../mocks/seedData";
import type {
  BerthPlan,
  BerthPlanSubmitPayload,
  BerthPlanApprovePayload,
  BerthPlanResult
} from "../types/BerthPlan";

const endpoint = "/api/berth-plan";

/** 统一请求封装：非 2xx 时抛出带后端 code/message 的错误供页面整次拒绝提示 */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.message ?? `请求失败（${res.status}）`) as Error & {
      code?: string;
      status?: number;
    };
    err.code = body?.code;
    err.status = res.status;
    throw err;
  }
  return body as T;
}

export async function listBerthPlan(): Promise<BerthPlan[]> {
  try {
    return await request<BerthPlan[]>(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return [...mockData.berthPlan];
  }
}

/** 提交靠泊计划：重叠时后端保留记录并标为 CONFLICT，返回计划与全部冲突计划 */
export function submitBerthPlan(payload: BerthPlanSubmitPayload): Promise<BerthPlanResult> {
  return request<BerthPlanResult>(endpoint, { method: "POST", body: JSON.stringify(payload) });
}

export const saveBerthPlan = submitBerthPlan;

/** 审批：必须指定空箱位；成功后计划批准与箱位预留同时生效 */
export function approveBerthPlan(
  id: number,
  payload: BerthPlanApprovePayload
): Promise<BerthPlanResult> {
  return request<BerthPlanResult>(`${endpoint}/${id}/approve`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
