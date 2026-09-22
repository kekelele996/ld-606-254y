import { listBerthPlan, submitBerthPlan, approveBerthPlan } from "../api/BerthPlan";
import type {
  BerthPlan,
  BerthPlanSubmitPayload,
  BerthPlanResult
} from "../types/BerthPlan";

/** 靠泊计划 store：页面只与 store 交互，冲突标记与箱位预留以后端返回为准 */
export class BerthPlanStore {
  rows: BerthPlan[] = [];
  loading = false;
  lastError = "";

  async load(): Promise<BerthPlan[]> {
    this.loading = true;
    this.lastError = "";
    try {
      this.rows = await listBerthPlan();
      return this.rows;
    } catch (err) {
      this.lastError = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async submit(payload: BerthPlanSubmitPayload): Promise<BerthPlanResult> {
    const result = await submitBerthPlan(payload);
    this.upsert(result.plan);
    return result;
  }

  async approve(id: number, yardSlotId: number): Promise<BerthPlanResult> {
    const result = await approveBerthPlan(id, { yard_slot_id: yardSlotId });
    this.upsert(result.plan);
    return result;
  }

  private upsert(plan: BerthPlan): void {
    const index = this.rows.findIndex((row) => row.id === plan.id);
    if (index >= 0) this.rows[index] = plan;
    else this.rows = [...this.rows, plan];
  }
}

export const berthPlanStore = new BerthPlanStore();
