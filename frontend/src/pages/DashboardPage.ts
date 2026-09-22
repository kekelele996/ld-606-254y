import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { Vessel } from "../types/Vessel";
import type { Berth } from "../types/Berth";
import type { BerthPlan } from "../types/BerthPlan";
import type { WorkTask } from "../types/WorkTask";
import { vesselStore } from "../stores/VesselStore";
import { berthStore } from "../stores/BerthStore";
import { berthPlanStore } from "../stores/BerthPlanStore";
import { workTaskStore } from "../stores/WorkTaskStore";
import { useBerthConflict } from "../hooks/useBerthConflict";
import { BerthTimeline } from "../components/common/BerthTimeline";
import { StatusBadge } from "../components/common/StatusBadge";
import { formatDate } from "../utils/formatters";

/** 港口运行总览：到港船舶、泊位计划时间轴、异常任务 */
@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [CommonModule, BerthTimeline, StatusBadge],
  template: `
    <section class="page-grid">
      <div class="metrics">
        <div class="stat"><span>到港船舶</span><strong>{{ vessels().length }}</strong></div>
        <div class="stat"><span>靠泊计划</span><strong>{{ plans().length }}</strong></div>
        <div class="stat"><span>时间冲突计划</span><strong class="danger-text">{{ conflicts.totalConflict }}</strong></div>
        <div class="stat"><span>异常/待处理任务</span><strong>{{ pendingTasks }}</strong></div>
      </div>

      <div class="panel wide">
        <h2>泊位占用时间轴</h2>
        <app-berth-timeline [plans]="plans()" [berths]="berths()"></app-berth-timeline>
      </div>

      <div class="panel">
        <h2>冲突计划</h2>
        <p class="hint" *ngIf="conflicts.conflictPlans.length === 0">暂无冲突计划。</p>
        <div class="row conflict-item" *ngFor="let p of conflicts.conflictPlans">
          <strong>#{{ p.id }} 船舶 {{ p.vessel_id }} / 泊位 {{ p.berth_id }}</strong>
          <app-status-badge kind="plan" [value]="p.status"></app-status-badge>
          <span class="reason-text">{{ formatDate(p.planned_arrival) }} ~ {{ formatDate(p.planned_departure) }}</span>
        </div>
      </div>
    </section>
  `
})
export class DashboardPage implements OnInit {
  vessels = signal<Vessel[]>([]);
  berths = signal<Berth[]>([]);
  plans = signal<BerthPlan[]>([]);
  tasks = signal<WorkTask[]>([]);
  formatDate = formatDate;

  async ngOnInit(): Promise<void> {
    const [vessels, berths, plans, tasks] = await Promise.all([
      vesselStore.load(),
      berthStore.load(),
      berthPlanStore.load(),
      workTaskStore.load()
    ]);
    this.vessels.set(vessels);
    this.berths.set(berths);
    this.plans.set(plans);
    this.tasks.set(tasks);
  }

  get conflicts() {
    return useBerthConflict(this.plans());
  }

  get pendingTasks(): number {
    return this.tasks().filter((task) => task.status === "PENDING" || task.status === "IN_PROGRESS").length;
  }
}
