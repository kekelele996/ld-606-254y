import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BerthPlanStore } from "../stores/BerthPlanStore";
import { BerthStore } from "../stores/BerthStore";
import { YardSlotStore } from "../stores/YardSlotStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { ConflictBadge } from "../components/common/ConflictBadge";
import { BerthTimeline } from "../components/common/BerthTimeline";
import { YardGrid } from "../components/common/YardGrid";
import { BerthPlanStatusText } from "../constants/BerthPlanStatus";
import { resolveErrorMessage } from "../constants/errorMessages";
import { createBerthPlanApproveForm, createBerthPlanForm } from "../constructors/BerthPlanConstructor";
import { formatDate } from "../utils/formatters";
import type { ApiError } from "../api/http";
import type { BerthPlanApproveForm, BerthPlanSubmitForm, BerthPlanView } from "../types/BerthPlan";
import type { YardSlotView } from "../types/YardSlot";

@Component({
  selector: "app-berths-page",
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadge, ConflictBadge, BerthTimeline, YardGrid],
  templateUrl: "./berths-page.html"
})
export class BerthsPage implements OnInit {
  protected readonly planStore;
  protected readonly berthStore;
  protected readonly slotStore;

  /** 提交计划表单 */
  submitForm: BerthPlanSubmitForm = createBerthPlanForm();
  submitFeedback = signal<{ ok: boolean; text: string } | null>(null);

  /** 审批对话框 */
  approveTarget = signal<BerthPlanView | null>(null);
  approveForm: BerthPlanApproveForm = createBerthPlanApproveForm();
  approveError = signal("");
  approveSuccess = signal("");

  constructor(planStore: BerthPlanStore, berthStore: BerthStore, slotStore: YardSlotStore) {
    this.planStore = planStore;
    this.berthStore = berthStore;
    this.slotStore = slotStore;
  }

  ngOnInit() {
    void this.refresh();
  }

  async refresh() {
    await Promise.all([this.planStore.load(), this.berthStore.load(), this.slotStore.load()]);
    // CONFLICT 计划进入页面即拉取冲突原因
    await Promise.all(
      this.planStore
        .plans()
        .filter((plan) => plan.status === "CONFLICT")
        .map((plan) => this.planStore.loadConflicts(plan.id))
    );
  }

  statusText(value: string) {
    return (BerthPlanStatusText as Record<string, string>)[value] ?? value;
  }
  formatDate = formatDate;

  conflictsOf(planId: number) {
    return this.planStore.conflictReasons()[planId] ?? [];
  }

  canApprove(status: string) {
    return status === "DRAFT" || status === "CONFLICT";
  }

  /** 提交计划：冲突时记录保留且标 CONFLICT，并提示全部冲突计划。 */
  async onSubmit() {
    this.submitFeedback.set(null);
    if (!this.submitForm.vessel_id || !this.submitForm.berth_id || !this.submitForm.planned_arrival || !this.submitForm.planned_departure) {
      this.submitFeedback.set({ ok: false, text: "请完整填写船舶、泊位与在港时间" });
      return;
    }
    try {
      const result = await this.planStore.submit({ ...this.submitForm });
      if (result.has_conflict) {
        const reasons = result.conflicts.map((item) => item.conflict_reason).join("；");
        this.submitFeedback.set({ ok: false, text: `计划已保存并标记为“时间冲突”，共 ${result.conflicts.length} 个冲突：${reasons}` });
        await this.planStore.loadConflicts(result.plan.id);
      } else {
        this.submitFeedback.set({ ok: true, text: `计划 #${result.plan.id} 已提交，当前无时间冲突，等待审批。` });
      }
      this.submitForm = createBerthPlanForm();
      await this.slotStore.load();
    } catch (error) {
      this.submitFeedback.set({ ok: false, text: this.messageOf(error) });
    }
  }

  /** 打开审批对话框：必须指定一个空箱位。 */
  openApprove(plan: BerthPlanView) {
    this.approveTarget.set(plan);
    this.approveForm = createBerthPlanApproveForm();
    this.approveError.set("");
    this.approveSuccess.set("");
  }

  closeApprove() {
    this.approveTarget.set(null);
  }

  pickSlot(slot: YardSlotView) {
    this.approveForm.yard_slot_id = slot.id;
    this.approveError.set("");
  }

  /** 审批：成功后计划状态与箱位预留同时生效；任何拒绝都保持两者不变。 */
  async onApprove() {
    const target = this.approveTarget();
    if (!target) return;
    this.approveError.set("");
    this.approveSuccess.set("");
    if (!this.approveForm.yard_slot_id) {
      this.approveError.set(resolveErrorMessage("SLOT_REQUIRED", "请选择一个空箱位"));
      return;
    }
    try {
      const result = await this.planStore.approve(target.id, { ...this.approveForm });
      this.approveSuccess.set(
        `审批通过：计划 #${result.plan.id} 已批准，箱位 ${result.slot?.slot_code ?? ""} 同步预留成功。`
      );
      await this.slotStore.load();
      setTimeout(() => this.closeApprove(), 1200);
    } catch (error) {
      // 整次拒绝：计划与箱位都未变化
      this.approveError.set(this.messageOf(error));
      await Promise.all([this.planStore.load(), this.slotStore.load()]);
    }
  }

  private messageOf(error: unknown): string {
    const apiError = error as ApiError;
    return resolveErrorMessage(apiError.code, apiError.message ?? "操作失败");
  }
}
