import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  BerthPlanStatusLabel,
  BerthPlanStatusTone
} from "../../constants/BerthPlanStatus";
import {
  YardSlotStatusLabel,
  YardSlotStatusTone
} from "../../constants/YardSlotStatus";

/**
 * 通用状态徽标：泊位计划与堆场箱位共用，
 * 文案/色调分别来自 constants 中的枚举映射，禁止在页面散写。
 */
@Component({
  selector: "app-status-badge",
  standalone: true,
  imports: [CommonModule],
  template: `<span class="status-badge" [class]="'tone-' + tone">{{ label }}</span>`,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        min-height: 24px;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
      }
      .tone-success { background: #e4efe4; color: #244b31; }
      .tone-danger { background: #f7e2de; color: #8c2f22; }
      .tone-info { background: #e2ebf6; color: #21446f; }
      .tone-muted { background: #e7e5db; color: #6b6a5e; }
      .tone-empty { background: #eef3ea; color: #4a6450; }
      .tone-reserved { background: #f6ecd9; color: #7d4d18; }
      .tone-occupied { background: #efe2f4; color: #5d2b70; }
      .tone-locked { background: #e2e0db; color: #55524a; }
    `
  ]
})
export class StatusBadge {
  @Input() kind: "plan" | "slot" = "plan";
  @Input({ required: true }) value = "";

  get label(): string {
    if (this.kind === "slot") {
      return YardSlotStatusLabel[this.value as keyof typeof YardSlotStatusLabel] ?? this.value;
    }
    return BerthPlanStatusLabel[this.value as keyof typeof BerthPlanStatusLabel] ?? this.value;
  }

  get tone(): string {
    if (this.kind === "slot") {
      return YardSlotStatusTone[this.value as keyof typeof YardSlotStatusTone] ?? "muted";
    }
    return BerthPlanStatusTone[this.value as keyof typeof BerthPlanStatusTone] ?? "muted";
  }
}
