import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import type { BerthPlan } from "../types/BerthPlan";
import type { Berth } from "../types/Berth";
import type { Vessel } from "../types/Vessel";
import type { YardSlot } from "../types/YardSlot";
import { berthPlanStore } from "../stores/BerthPlanStore";
import { berthStore } from "../stores/BerthStore";
import { vesselStore } from "../stores/VesselStore";
import { yardSlotStore } from "../stores/YardSlotStore";
import { createBerthPlanForm } from "../constructors/BerthPlanConstructor";
import { useBerthConflict } from "../hooks/useBerthConflict";
import { useYardMatrix } from "../hooks/useYardMatrix";
import { formatDate, localInputToIso } from "../utils/formatters";
import { BerthPlanStatusLabel } from "../constants/BerthPlanStatus";
import { YardSlotStatusLabel } from "../constants/YardSlotStatus";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { StatusBadge } from "../components/common/StatusBadge";
import { ConflictBadge } from "../components/common/ConflictBadge";
import { BerthTimeline } from "../components/common/BerthTimeline";
import { YardGrid } from "../components/common/YardGrid";

/**
 * 泊位计划页：
 * - 提交计划时后端做同泊位已批准计划的在港时间重叠检测，冲突也保留并标记，响应返回全部冲突计划；
 * - 对未处理计划发起审批时必须指定空箱位，船型超限/箱位非空/重复并发审批由后端整次拒绝；
 * - 审批成功后刷新计划与箱位，时间轴与堆场矩阵同时反映结果。
 */
@Component({
  selector: "app-berths-page",
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadge, ConflictBadge, BerthTimeline, YardGrid],
  templateUrl: "./berths-page.html"
})
export class BerthsPage implements OnInit {
  plans = signal<BerthPlan[]>([]);
  berths = signal<Berth[]>([]);
  vessels = signal<Vessel[]>([]);
  slots = signal<YardSlot[]>([]);

  form = createBerthPlanForm();
  submitting = false;
  submitMessage = "";
  submitConflictIds: number[] = [];

  approvingPlan: BerthPlan | null = null;
  chosenSlotId: number | null = null;
  approving = false;
  approveError = "";

  formatDate = formatDate;
  localInputToIso = localInputToIso;
  planLabel = BerthPlanStatusLabel;
  slotLabel = YardSlotStatusLabel;

  async ngOnInit(): Promise<void> {
    await this.refreshAll();
  }

  get conflictView() {
    return useBerthConflict(this.plans());
  }

  get matrix() {
    return useYardMatrix(this.slots());
  }

  vesselName(id: number): string {
    return this.vessels().find((v) => v.id === id)?.vessel_name ?? `船舶 #${id}`;
  }

  berthCode(id: number): string {
    return this.berths().find((b) => b.id === id)?.berth_code ?? `泊位 #${id}`;
  }

  planLabelOf(status: string): string {
    return this.planLabel[status as keyof typeof this.planLabel] ?? status;
  }

  reasonOf(plan: BerthPlan): string {
    return plan.conflict_reason ?? "";
  }

  canApprove(plan: BerthPlan): boolean {
    return plan.status === "DRAFT" || plan.status === "CONFLICT";
  }

  async refreshAll(): Promise<void> {
    const [plans, berths, vessels, slots] = await Promise.all([
      berthPlanStore.load(),
      berthStore.load(),
      vesselStore.load(),
      yardSlotStore.load()
    ]);
    this.plans.set(plans);
    this.berths.set(berths);
    this.vessels.set(vessels);
    this.slots.set(slots);
  }

  async onSubmit(): Promise<void> {
    this.submitting = true;
    this.submitMessage = "";
    this.submitConflictIds = [];
    try {
      const result = await berthPlanStore.submit({
        ...this.form,
        vessel_id: Number(this.form.vessel_id),
        berth_id: Number(this.form.berth_id),
        planned_arrival: localInputToIso(this.form.planned_arrival),
        planned_departure: localInputToIso(this.form.planned_departure)
      });
      this.submitConflictIds = result.conflicts.map((plan) => plan.id);
      this.submitMessage =
        result.conflicts.length > 0
          ? `计划 #${result.plan.id} 已保存但标记为冲突，与 ${result.conflicts.length} 条已批准计划在港时间重叠，等待调度处理。`
          : `计划 #${result.plan.id} 已提交，等待审批。`;
      this.form = createBerthPlanForm();
      await this.refreshPlans();
    } catch (err) {
      this.submitMessage = `提交失败：${err instanceof Error ? err.message : String(err)}`;
    } finally {
      this.submitting = false;
    }
  }

  async refreshPlans(): Promise<void> {
    this.plans.set(await berthPlanStore.load());
  }

  openApprove(plan: BerthPlan): void {
    this.approvingPlan = plan;
    this.chosenSlotId = null;
    this.approveError = "";
  }

  closeApprove(): void {
    if (this.approving) return;
    this.approvingPlan = null;
    this.chosenSlotId = null;
    this.approveError = "";
  }

  pickSlot(slot: YardSlot): void {
    this.chosenSlotId = slot.id;
    this.approveError = "";
  }

  /** 审批：计划批准与箱位预留由后端在同一临界区完成，任何校验失败两者都不变化 */
  async onApprove(): Promise<void> {
    if (!this.approvingPlan || this.chosenSlotId === null) {
      this.approveError = "请先在箱位矩阵中点选一个空箱位。";
      return;
    }
    this.approving = true;
    this.approveError = "";
    const planId = this.approvingPlan.id;
    const slotId = this.chosenSlotId;
    try {
      await berthPlanStore.approve(planId, slotId);
      this.approvingPlan = null;
      this.chosenSlotId = null;
      await this.refreshAll();
    } catch (err) {
      const code = (err as { code?: string }).code;
      const known = code ? ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] : "";
      const detail = err instanceof Error ? err.message : String(err);
      this.approveError = `审批被拒绝：${known ?? ERROR_MESSAGES.VALIDATION_FAILED}（${detail}）`;
      // 失败后重新拉取，确保重复/并发审批场景下界面与后端一致（两者都不变化）
      await this.refreshAll();
    } finally {
      this.approving = false;
    }
  }
}
