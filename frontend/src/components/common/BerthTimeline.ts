import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { BerthPlanView } from "../../types/BerthPlan";
import type { Berth } from "../../types/Berth";
import { StatusBadge } from "./StatusBadge";
import { BerthPlanStatusText } from "../../constants/BerthPlanStatus";
import { formatDate } from "../../utils/formatters";

interface TimelineRow {
  berth: Berth;
  plans: BerthPlanView[];
}

/**
 * 泊位时间线（甘特视图）：dashboard 与泊位计划页共享。
 * 按泊位分行展示计划时间窗，CONFLICT 计划高亮红条。
 */
@Component({
  selector: "app-berth-timeline",
  standalone: true,
  imports: [CommonModule, StatusBadge],
  template: `
    <div class="timeline" *ngIf="rows.length > 0; else empty">
      <div class="timeline-row" *ngFor="let row of rows">
        <div class="timeline-berth">
          <strong>{{ row.berth.berth_code }}</strong>
          <span>{{ row.berth.length_m }}m / {{ row.berth.water_depth_m }}m</span>
        </div>
        <div class="timeline-track">
          <div
            class="timeline-bar"
            *ngFor="let plan of row.plans"
            [class.conflict]="plan.status === 'CONFLICT'"
            [class.approved]="plan.status === 'APPROVED'"
            [class.draft]="plan.status === 'DRAFT'"
            [title]="plan.vessel_name + ' ' + plan.planned_arrival + ' ~ ' + plan.planned_departure"
          >
            <span class="timeline-vessel">{{ plan.vessel_name }}</span>
            <span class="timeline-time">{{ formatDate(plan.planned_arrival) }} - {{ formatDate(plan.planned_departure) }}</span>
            <app-status-badge [value]="plan.status" [label]="statusText(plan.status)" kind="plan" />
            <span class="timeline-slot" *ngIf="plan.reserved_slot_code">箱位 {{ plan.reserved_slot_code }}</span>
          </div>
          <span class="timeline-empty" *ngIf="row.plans.length === 0">暂无在港计划</span>
        </div>
      </div>
    </div>
    <ng-template #empty><div class="timeline-placeholder">暂无泊位计划</div></ng-template>
  `,
  styles: [
    `
      .timeline { display: grid; gap: 14px; }
      .timeline-row { display: grid; grid-template-columns: 150px 1fr; gap: 12px; align-items: start; }
      .timeline-berth { display: grid; gap: 2px; padding-top: 8px; }
      .timeline-berth span { color: #7c8278; font-size: 12px; }
      .timeline-track { display: grid; gap: 8px; border-left: 2px dashed #d2d7cd; padding-left: 14px; }
      .timeline-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 8px;
        border-left-width: 4px;
        border-left-style: solid;
        background: #f4f3ea;
        border-left-color: #b9b49c;
      }
      .timeline-bar.approved { background: #e8f1e8; border-left-color: #2f7d4f; }
      .timeline-bar.conflict { background: #fbeae4; border-left-color: #c2541f; }
      .timeline-vessel { font-weight: 700; }
      .timeline-time { color: #5d6358; font-size: 12.5px; }
      .timeline-slot { color: #1d4f7a; font-size: 12px; font-weight: 700; }
      .timeline-empty, .timeline-placeholder { color: #9aa095; font-size: 13px; }
    `
  ]
})
export class BerthTimeline {
  @Input() plans: BerthPlanView[] = [];
  @Input() berths: Berth[] = [];

  formatDate = formatDate;
  statusText = (value: string) => (BerthPlanStatusText as Record<string, string>)[value] ?? value;

  get rows(): TimelineRow[] {
    return this.berths.map((berth) => ({
      berth,
      plans: this.plans
        .filter((plan) => plan.berth_id === berth.id)
        .sort((a, b) => a.planned_arrival.localeCompare(b.planned_arrival))
    }));
  }
}
