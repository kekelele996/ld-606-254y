import { Component, OnInit, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BerthPlanStore } from "../stores/BerthPlanStore";
import { BerthStore } from "../stores/BerthStore";
import { VesselStore } from "../stores/VesselStore";
import { WorkTaskStore } from "../stores/WorkTaskStore";
import { BerthTimeline } from "../components/common/BerthTimeline";
import { formatDate } from "../utils/formatters";

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [CommonModule, BerthTimeline],
  template: `
    <div class="page">
      <section class="page-head">
        <div>
          <p class="eyebrow">port overview</p>
          <h1>港口运行总览</h1>
        </div>
        <button class="btn" (click)="load()">刷新</button>
      </section>

      <section class="metrics">
        <div class="stat"><span>在港/预报船舶</span><strong>{{ vesselStore.vessels().length }}</strong></div>
        <div class="stat"><span>待审批计划</span><strong>{{ pendingCount() }}</strong></div>
        <div class="stat"><span>冲突计划</span><strong>{{ conflictCount() }}</strong></div>
        <div class="stat"><span>已批准计划</span><strong>{{ approvedCount() }}</strong></div>
        <div class="stat"><span>作业任务</span><strong>{{ taskStore.tasks().length }}</strong></div>
      </section>

      <section class="panel">
        <h2>泊位占用时间线</h2>
        <app-berth-timeline [plans]="planStore.plans()" [berths]="berthStore.berths()" />
      </section>

      <section class="panel">
        <h2>近期到港船舶</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>船名</th><th>IMO</th><th>承运人</th><th>船长/吃水</th><th>ETA</th><th>ETD</th></tr></thead>
            <tbody>
              <tr *ngFor="let vessel of vesselStore.vessels()">
                <td>{{ vessel.vessel_name }}</td>
                <td>{{ vessel.imo_no }}</td>
                <td>{{ vessel.carrier }}</td>
                <td>{{ vessel.length_m }}m / {{ vessel.draft_m }}m</td>
                <td>{{ formatDate(vessel.eta) }}</td>
                <td>{{ formatDate(vessel.etd) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
})
export class DashboardPage implements OnInit {
  constructor(
    protected readonly planStore: BerthPlanStore,
    protected readonly berthStore: BerthStore,
    protected readonly vesselStore: VesselStore,
    protected readonly taskStore: WorkTaskStore
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    void Promise.all([this.planStore.load(), this.berthStore.load(), this.vesselStore.load(), this.taskStore.load()]);
  }

  formatDate = formatDate;
  pendingCount = computed(() => this.planStore.plans().filter((plan) => plan.status === "DRAFT").length);
  conflictCount = computed(() => this.planStore.plans().filter((plan) => plan.status === "CONFLICT").length);
  approvedCount = computed(() => this.planStore.plans().filter((plan) => plan.status === "APPROVED").length);
}
