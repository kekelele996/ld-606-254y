import { Component, OnInit, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { VesselStore } from "../stores/VesselStore";
import { BerthPlanStore } from "../stores/BerthPlanStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { usePagination } from "../hooks/usePagination";
import { formatDate } from "../utils/formatters";
import { BerthPlanStatusText } from "../constants/BerthPlanStatus";

@Component({
  selector: "app-vessels-page",
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadge],
  template: `
    <div class="page">
      <section class="page-head">
        <div>
          <p class="eyebrow">vessel forecast</p>
          <h1>船舶预报与靠泊历史</h1>
        </div>
        <button class="btn" (click)="load()">刷新</button>
      </section>

      <section class="panel">
        <div class="toolbar">
          <h2>船舶列表</h2>
          <input class="search" type="search" placeholder="搜索船名 / IMO" [(ngModel)]="keyword" />
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>船名</th><th>IMO</th><th>承运人</th><th>船长(m)</th><th>吃水(m)</th><th>ETA</th><th>ETD</th><th>靠泊计划</th></tr></thead>
            <tbody>
              <tr *ngFor="let vessel of pagination.pagedRows()">
                <td>{{ vessel.vessel_name }}</td>
                <td>{{ vessel.imo_no }}</td>
                <td>{{ vessel.carrier }}</td>
                <td>{{ vessel.length_m }}</td>
                <td>{{ vessel.draft_m }}</td>
                <td>{{ formatDate(vessel.eta) }}</td>
                <td>{{ formatDate(vessel.etd) }}</td>
                <td>
                  <ng-container *ngFor="let plan of plansOf(vessel.id)">
                    <app-status-badge [value]="plan.status" [label]="statusText(plan.status)" kind="plan" />
                    <span class="muted">#{{ plan.id }} · {{ plan.berth_code }}</span>
                  </ng-container>
                  <span class="muted" *ngIf="plansOf(vessel.id).length === 0">暂无</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pager">
          <button class="btn btn-small" (click)="pagination.prev()" [disabled]="pagination.page() === 1">上一页</button>
          <span>第 {{ pagination.page() }} / {{ pagination.pageCount() }} 页</span>
          <button class="btn btn-small" (click)="pagination.next()" [disabled]="pagination.page() === pagination.pageCount()">下一页</button>
        </div>
      </section>
    </div>
  `,
  styles: [`.muted { color: #7c8278; font-size: 12px; margin: 0 6px; }`]
})
export class VesselsPage implements OnInit {
  keyword = "";

  constructor(protected readonly vesselStore: VesselStore, protected readonly planStore: BerthPlanStore) {}

  ngOnInit() {
    this.load();
  }

  load() {
    void Promise.all([this.vesselStore.load(), this.planStore.load()]);
  }

  formatDate = formatDate;
  statusText = (value: string) => (BerthPlanStatusText as Record<string, string>)[value] ?? value;

  private readonly filtered = computed(() => {
    const word = this.keyword.trim().toLowerCase();
    if (!word) return this.vesselStore.vessels();
    return this.vesselStore.vessels().filter(
      (vessel) => vessel.vessel_name.toLowerCase().includes(word) || vessel.imo_no.toLowerCase().includes(word)
    );
  });

  pagination = usePagination(this.filtered, 8);

  plansOf(vesselId: number) {
    return this.planStore.plans().filter((plan) => plan.vessel_id === vesselId);
  }
}
