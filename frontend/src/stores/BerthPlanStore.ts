import { Injectable, signal } from "@angular/core";
import {
  approveBerthPlan,
  listBerthPlan,
  listBerthPlanConflicts,
  submitBerthPlan
} from "../api/BerthPlan";
import type {
  BerthPlanApproveForm,
  BerthPlanConflict,
  BerthPlanSubmitForm,
  BerthPlanSubmitResult,
  BerthPlanView
} from "../types/BerthPlan";

/**
 * 靠泊计划 store：维护计划列表、按计划缓存的冲突原因，
 * 并封装“提交（冲突检测）”和“审批（箱位联动）”两个写动作。
 */
@Injectable({ providedIn: "root" })
export class BerthPlanStore {
  readonly plans = signal<BerthPlanView[]>([]);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly approvingId = signal<number | null>(null);
  /** planId -> 冲突原因列表（泊位页展示）。 */
  readonly conflictReasons = signal<Record<number, BerthPlanConflict[]>>({});
  /** 最近一次提交返回的冲突（提交表单反馈用）。 */
  readonly lastSubmitResult = signal<BerthPlanSubmitResult | null>(null);

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.plans.set(await listBerthPlan());
    } finally {
      this.loading.set(false);
    }
  }

  /** 提交计划；无论是否冲突记录都会保留，冲突计划随响应返回。 */
  async submit(form: BerthPlanSubmitForm): Promise<BerthPlanSubmitResult> {
    this.submitting.set(true);
    try {
      const result = await submitBerthPlan(form);
      this.lastSubmitResult.set(result);
      await this.load();
      return result;
    } finally {
      this.submitting.set(false);
    }
  }

  /** 拉取并缓存某计划的冲突原因，供泊位页 ConflictBadge 展示。 */
  async loadConflicts(planId: number): Promise<BerthPlanConflict[]> {
    const rows = await listBerthPlanConflicts(planId);
    this.conflictReasons.update((map) => ({ ...map, [planId]: rows }));
    return rows;
  }

  /** 审批计划；成功后刷新列表与箱位占用（由 YardSlotStore 在页面侧联动刷新）。 */
  async approve(planId: number, form: BerthPlanApproveForm) {
    this.approvingId.set(planId);
    try {
      const result = await approveBerthPlan(planId, form);
      await this.load();
      if (this.conflictReasons()[planId]) {
        this.conflictReasons.update((map) => {
          const next = { ...map };
          delete next[planId];
          return next;
        });
      }
      return result;
    } finally {
      this.approvingId.set(null);
    }
  }
}
