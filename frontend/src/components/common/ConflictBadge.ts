import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * 冲突徽标：泊位页计划列表与时间轴共用。
 * reason 为后端在提交时落库保留的冲突原因（全部冲突计划拼接）。
 */
@Component({
  selector: "app-conflict-badge",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="conflict" *ngIf="reason" [title="reason">
      <span class="dot"></span>冲突 ×{{ count }}
    </span>
  `,
  styles: [
    `
      .conflict {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 2px 10px;
        border-radius: 999px;
        background: #f7e2de;
        color: #8c2f22;
        font-size: 12px;
        font-weight: 800;
        cursor: help;
      }
      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #c0392b;
      }
    `
  ]
})
export class ConflictBadge {
  @Input() reason: string | null = null;
  @Input() count = 1;
}
