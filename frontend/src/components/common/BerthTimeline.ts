import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { BerthPlan } from "../../types/BerthPlan";
import type { Berth } from "../../types/Berth";
import { formatDate } from "../../utils/formatters";

interface Bar {
  plan: BerthPlan;
  left: number;
  width: number;
  cls: string;
}

/**
 * 泊位时间轴（总览页与泊位计划页共用）：
 * 每个泊位一行，计划条按在港时间映射到统一时间尺；
 * CONFLICT 计划以红条警示，点击条目发出 select 供页面打开审批面板。
 */
@Component({
  selector: "app-berth-timeline",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline">
      <div class="scale">
        <span>{{ rangeStartText }}</span>
        <span>{{ rangeEndText }}</span>
      </div>
      <div class="lane" *ngFor="let lane of lanes">
        <div class="lane-name">
          <strong>{{ lane.berth.berth_code }}</strong>
          <small>{{ lane.berth.length_m }}m / {{ lane.berth.water_depth_m }}m</small>
        </div>
        <div class="track">
          <ng-container *ngIf="lane.bars.length === 0"><span class="empty-lane">暂无计划</span></ng-container>
          <button
            *ngFor="let bar of lane.bars"
            class="bar"
            [class]="bar.cls"
            [style.left.%]="bar.left"
            [style.width.%]="bar.width"
            [title]="titleOf(bar.plan)"
            (click)="select.emit(bar.plan)"
          >
            #{{ bar.plan.id }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .timeline { display: grid; gap: 10px; }
      .scale { display: flex; justify-content: space-between; font-size: 12px; color: #7a7d72; }
      .lane { display: grid; grid-template-columns: 150px 1fr; gap: 12px; align-items: center; }
      .lane-name { display: grid; gap: 2px; }
      .lane-name small { color: #7a7d72; }
      .track { position: relative; height: 38px; border-radius: 8px; background: repeating-linear-gradient(90deg, #f1efe6 0 2px, transparent 2px 48px); border: 1px solid #e0ddcf; }
      .empty-lane { position: absolute; inset: 0; display: grid; place-items: center; color: #a5a294; font-size: 12px; }
      .bar { position: absolute; top: 5px; height: 28px; border: 0; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; overflow: hidden; color: #fff; padding: 0 8px; }
      .bar.approved, .bar.berthing { background: #2f7d4f; }
      .bar.conflict { background: repeating-linear-gradient(45deg, #c0392b 0 8px, #a33225 8px 16px); }
      .bar.draft { background: #8b897b; }
      .bar.departed, .bar.cancelled { background: #b7b4a6; }
    `
  ]
})
export class BerthTimeline implements OnInit, OnChanges {
  @Input() plans: BerthPlan[] = [];
  @Input() berths: Berth[] = [];
  @Output() select = new EventEmitter<BerthPlan>();

  rangeStart = 0;
  rangeEnd = 1;
  lanes: { berth: Berth; bars: Bar[] }[] = [];

  ngOnInit(): void {
    this.rebuild();
  }

  ngOnChanges(): void {
    this.rebuild();
  }

  formatDate = formatDate;

  get rangeStartText(): string {
    return formatDate(new Date(this.rangeStart).toISOString());
  }

  get rangeEndText(): string {
    return formatDate(new Date(this.rangeEnd).toISOString());
  }

  titleOf(plan: BerthPlan): string {
    return `#${plan.id} ${formatDate(plan.planned_arrival)} ~ ${formatDate(plan.planned_departure)}${
      plan.conflict_reason ? `\n${plan.conflict_reason}` : ""
    }`;
  }

  private rebuild(): void {
    if (this.plans.length === 0) {
      this.rangeStart = Date.now();
      this.rangeEnd = this.rangeStart + 3_600_000;
    } else {
      this.rangeStart = Math.min(...this.plans.map((p) => new Date(p.planned_arrival).getTime()));
      this.rangeEnd = Math.max(...this.plans.map((p) => new Date(p.planned_departure).getTime()));
    }
    if (this.rangeEnd <= this.rangeStart) this.rangeEnd = this.rangeStart + 3_600_000;
    const span = this.rangeEnd - this.rangeStart;

    this.lanes = this.berths.map((berth) => ({
      berth,
      bars: this.plans
        .filter((plan) => plan.berth_id === berth.id)
        .map((plan) => {
          const start = new Date(plan.planned_arrival).getTime();
          const end = new Date(plan.planned_departure).getTime();
          return {
            plan,
            left: ((start - this.rangeStart) / span) * 100,
            width: Math.max(((end - start) / span) * 100, 4),
            cls: plan.status.toLowerCase()
          };
        })
    }));
  }
}
