import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * 通用状态徽标：泊位计划状态 / 箱位状态 / 任务状态共用。
 * 通过 kind 切换配色（plan | slot | task）。
 */
@Component({
  selector: "app-status-badge",
  standalone: true,
  imports: [CommonModule],
  template: `<span class="status-badge" [class]="'status-badge--' + kind + ' status-badge--' + tone">{{ label }}</span>`,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 2px 10px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
      }
      .status-badge--neutral { background: #eceae1; color: #5b6156; }
      .status-badge--conflict, .status-badge--danger, .status-badge--locked { background: #f7dcd4; color: #9a3412; }
      .status-badge--ok, .status-badge--approved, .status-badge--occupied { background: #dbeade; color: #1e5631; }
      .status-badge--info, .status-badge--reserved, .status-badge--berthing { background: #d8e6f2; color: #1d4f7a; }
      .status-badge--muted, .status-badge--empty, .status-badge--draft, .status-badge--departed, .status-badge--cancelled {
        background: #eceae1;
        color: #6b7167;
      }
    `
  ]
})
export class StatusBadge {
  @Input() value = "";
  @Input() label = "";
  @Input() kind: "plan" | "slot" | "task" = "plan";

  get tone(): string {
    const map: Record<string, string> = {
      DRAFT: "draft",
      CONFLICT: "conflict",
      APPROVED: "approved",
      BERTHING: "berthing",
      DEPARTED: "departed",
      CANCELLED: "cancelled",
      EMPTY: "empty",
      RESERVED: "reserved",
      OCCUPIED: "occupied",
      LOCKED: "locked",
      PLANNED: "info",
      DONE: "ok"
    };
    return map[this.value] ?? "neutral";
  }
}
