import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { YardSlotView } from "../../types/YardSlot";
import { useYardMatrix } from "../../hooks/useYardMatrix";
import { StatusBadge } from "./StatusBadge";
import { YardSlotStatusText } from "../../constants/YardSlotStatus";

/**
 * 堆场箱位矩阵：泊位页与堆场页共享。
 * - 只读模式展示占用结果；
 * - selectable 模式下仅可点击 EMPTY 箱位，供审批对话框选择预留箱位。
 */
@Component({
  selector: "app-yard-grid",
  standalone: true,
  imports: [CommonModule, StatusBadge],
  template: `
    <section class="yard-area" *ngFor="let area of areas">
      <h3>{{ area }} 区</h3>
      <div class="yard-grid">
        <button
          type="button"
          class="yard-cell"
          *ngFor="let slot of matrix[area]"
          [class]="'yard-cell--' + slot.slot_status.toLowerCase()"
          [class.selectable]="selectable && slot.slot_status === 'EMPTY'"
          [class.selected]="selectedId === slot.id"
          [disabled]="selectable && slot.slot_status !== 'EMPTY'"
          [title]="titleOf(slot)"
          (click)="select(slot)"
        >
          <span class="yard-cell-code">{{ slot.slot_code }}</span>
          <app-status-badge [value]="slot.slot_status" [label]="statusText(slot.slot_status)" kind="slot" />
          <span class="yard-cell-plan" *ngIf="slot.occupied_by_plan">计划 #{{ slot.occupied_by_plan }}</span>
          <span class="yard-cell-container" *ngIf="slot.container_no">{{ slot.container_no }}</span>
        </button>
      </div>
    </section>
  `,
  styles: [
    `
      h3 { margin: 0 0 10px; font-size: 15px; }
      .yard-area + .yard-area { margin-top: 20px; }
      .yard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
      .yard-cell {
        display: grid;
        gap: 6px;
        justify-items: start;
        text-align: left;
        border: 1px solid #d7d4c6;
        border-radius: 8px;
        padding: 10px 12px;
        background: #fbfaf4;
        cursor: default;
      }
      .yard-cell--empty { background: #f4f6f1; }
      .yard-cell--reserved { background: #e4eef7; border-color: #a9c6df; }
      .yard-cell--occupied { background: #e8f1e8; border-color: #a9cdb4; }
      .yard-cell--locked { background: #f3e7e3; border-color: #d8b0a2; }
      .yard-cell.selectable { cursor: pointer; }
      .yard-cell.selectable:hover { outline: 2px solid #2f7d4f; }
      .yard-cell.selected { outline: 3px solid #1e5631; }
      .yard-cell:disabled { opacity: 0.92; }
      .yard-cell-code { font-weight: 800; font-size: 13px; }
      .yard-cell-plan { color: #1d4f7a; font-size: 12px; font-weight: 700; }
      .yard-cell-container { color: #6b7167; font-size: 11px; }
    `
  ]
})
export class YardGrid {
  @Input() slots: YardSlotView[] = [];
  @Input() selectable = false;
  @Input() selectedId: number | null = null;
  @Output() selected = new EventEmitter<YardSlotView>();

  get matrix() {
    return useYardMatrix(this.slots).matrix;
  }
  get areas() {
    return useYardMatrix(this.slots).areas;
  }

  statusText(value: string) {
    return (YardSlotStatusText as Record<string, string>)[value] ?? value;
  }

  titleOf(slot: YardSlotView): string {
    const parts = [slot.slot_code, this.statusText(slot.slot_status)];
    if (slot.container_no) parts.push(`箱号 ${slot.container_no}`);
    if (slot.occupied_by_plan) parts.push(`占用计划 #${slot.occupied_by_plan}`);
    return parts.join(" · ");
  }

  select(slot: YardSlotView) {
    if (this.selectable && slot.slot_status === "EMPTY") this.selected.emit(slot);
  }
}
