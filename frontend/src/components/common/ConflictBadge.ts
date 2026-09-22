import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { BerthPlanConflict } from "../../types/BerthPlan";

/**
 * 冲突徽标：泊位页在 CONFLICT 计划上显示。
 * 悬浮/展开后列出全部冲突原因（同泊位已批准、时间窗重叠的计划）。
 */
@Component({
  selector: "app-conflict-badge",
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="conflicts.length > 0; else noConflict">
      <button type="button" class="conflict-flag" (click)="open = !open" [attr.aria-expanded]="open">
        ⚠ 冲突 ×{{ conflicts.length }}
      </button>
      <ul class="conflict-list" *ngIf="open">
        <li *ngFor="let item of conflicts">{{ item.conflict_reason }}</li>
      </ul>
    </ng-container>
    <ng-template #noConflict><span class="conflict-none" *ngIf="showOk">无冲突</span></ng-template>
  `,
  styles: [
    `
      .conflict-flag {
        border: 0;
        border-radius: 999px;
        background: #f7dcd4;
        color: #9a3412;
        font-weight: 700;
        font-size: 12px;
        padding: 3px 12px;
        cursor: pointer;
      }
      .conflict-list {
        margin: 8px 0 0;
        padding: 10px 12px 10px 28px;
        border-left: 3px solid #d08a72;
        background: #fdf4f1;
        border-radius: 6px;
        color: #7c3517;
        font-size: 12.5px;
        line-height: 1.7;
        max-width: 560px;
      }
      .conflict-none { color: #8b9186; font-size: 12px; }
    `
  ]
})
export class ConflictBadge {
  @Input() conflicts: BerthPlanConflict[] = [];
  @Input() showOk = false;
  open = false;
}
