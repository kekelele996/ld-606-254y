import { Component, EventEmitter, Input, Output, OnChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { YardSlot } from "../../types/YardSlot";
import { YardSlotStatusLabel } from "../../constants/YardSlotStatus";

interface YardRow {
  rowNo: string;
  cells: YardSlot[];
}

/**
 * 堆场箱位矩阵（堆场页主组件）：
 * 按箱区/排分组，色块直接呈现 EMPTY/RESERVED/OCCUPIED/LOCKED 占用结果；
 * 审批面板开启 selectable 时只能点选空箱位。
 */
@Component({
  selector: "app-yard-grid",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="yard">
      <div class="row" *ngFor="let row of rows">
        <span class="row-label">{{ row.rowNo }} 排</span>
        <button
          *ngFor="let cell of row.cells"
          class="cell"
          [class]="'cell ' + cell.slot_status.toLowerCase()"
          [class.selectable]="selectable && cell.slot_status === 'EMPTY'"
          [disabled]="selectable && cell.slot_status !== 'EMPTY'"
          [title]="titleOf(cell)"
          (click)="cell.slot_status === 'EMPTY' && pick.emit(cell)"
        >
          <span class="bay">{{ cell.bay_no }}-{{ cell.tier_no }}</span>
          <span class="state">{{ label(cell.slot_status) }}</span>
          <span class="ref" *ngIf="cell.reserved_by_plan_id">计划 #{{ cell.reserved_by_plan_id }}</span>
          <span class="ref" *ngIf="cell.container_no">{{ cell.container_no }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .yard { display: grid; gap: 10px; }
      .row { display: grid; grid-template-columns: 70px repeat(auto-fit, minmax(112px, 1fr)); gap: 8px; align-items: stretch; }
      .row-label { display: grid; place-items: center; font-weight: 800; color: #596257; font-size: 13px; }
      .cell { border: 1px solid #cfd2c4; border-radius: 8px; padding: 10px 8px; min-height: 74px; display: grid; gap: 3px; text-align: left; cursor: default; color: #20211d; }
      .cell.empty { background: #eef3ea; }
      .cell.reserved { background: #f6ecd9; border-color: #d9b47a; }
      .cell.occupied { background: #efe2f4; border-color: #c8a5d8; }
      .cell.locked { background: #e2e0db; color: #6f6c61; }
      .cell.selectable { cursor: pointer; box-shadow: inset 0 0 0 2px transparent; }
      .cell.selectable:hover { box-shadow: inset 0 0 0 2px #2f7d4f; }
      .cell:disabled { opacity: 1; }
      .bay { font-weight: 800; font-size: 13px; }
      .state { font-size: 12px; font-weight: 700; }
      .ref { font-size: 11px; color: #6f6c61; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    `
  ]
})
export class YardGrid implements OnChanges {
  @Input() slots: YardSlot[] = [];
  @Input() selectable = false;
  @Output() pick = new EventEmitter<YardSlot>();

  rows: YardRow[] = [];

  ngOnChanges(): void {
    const grouped = new Map<string, YardSlot[]>();
    [...this.slots]
      .sort((a, b) => a.row_no.localeCompare(b.row_no) || a.bay_no.localeCompare(b.bay_no))
      .forEach((slot) => {
        const list = grouped.get(slot.row_no) ?? [];
        list.push(slot);
        grouped.set(slot.row_no, list);
      });
    this.rows = [...grouped.entries()].map(([rowNo, cells]) => ({ rowNo, cells }));
  }

  label(status: string): string {
    return YardSlotStatusLabel[status as keyof typeof YardSlotStatusLabel] ?? status;
  }

  titleOf(cell: YardSlot): string {
    const parts = [
      `${cell.yard_area} ${cell.row_no}-${cell.bay_no}-${cell.tier_no}`,
      this.label(cell.slot_status),
      cell.cargo_type
    ];
    if (cell.reserved_by_plan_id) parts.push(`预留：靠泊计划 #${cell.reserved_by_plan_id}`);
    if (cell.container_no) parts.push(`箱号：${cell.container_no}`);
    return parts.join("\n");
  }
}
