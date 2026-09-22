import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import type { Vessel } from "../types/Vessel";
import type { BerthPlan } from "../types/BerthPlan";
import { vesselStore } from "../stores/VesselStore";
import { berthPlanStore } from "../stores/BerthPlanStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { formatDate } from "../utils/formatters";

/** 船舶预报页：船舶列表及其靠泊计划（含冲突标记） */
@Component({
  selector: "app-vessels-page",
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadge],
  template: `
    <section class="page-grid">
      <div class="panel wide">
        <h2>到港船舶预报（{{ vessels().length }}）</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>#</th><th>船名</th><th>IMO</th><th>船公司</th><th>船长/吃水</th><th>ETA ~ ETD</th><th>靠泊计划</th></tr></thead>
            <tbody>
              <tr *ngFor="let v of vessels()">
                <td>{{ v.id }}</td>
                <td>{{ v.vessel_name }}</td>
                <td>{{ v.imo_no }}</td>
                <td>{{ v.carrier }}</td>
                <td>{{ v.length_m }}m / {{ v.draft_m }}m</td>
                <td class="time">{{ formatDate(v.eta) }}<br />~ {{ formatDate(v.etd) }}</td>
                <td>
                  <ng-container *ngIf="plansOf(v.id).length; else none">
                    <span class="plan-chip" *ngFor="let p of plansOf(v.id)">
                      #{{ p.id }} 泊位 {{ p.berth_id }}
                      <app-status-badge kind="plan" [value]="p.status"></app-status-badge>
                    </span>
                  </ng-container>
                  <ng-template #none><span class="muted">未编排</span></ng-template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
})
export class VesselsPage implements OnInit {
  vessels = signal<Vessel[]>([]);
  plans = signal<BerthPlan[]>([]);
  formatDate = formatDate;

  async ngOnInit(): Promise<void> {
    const [vessels, plans] = await Promise.all([vesselStore.load(), berthPlanStore.load()]);
    this.vessels.set(vessels);
    this.plans.set(plans);
  }

  plansOf(vesselId: number): BerthPlan[] {
    return this.plans().filter((plan) => plan.vessel_id === vesselId);
  }
}
