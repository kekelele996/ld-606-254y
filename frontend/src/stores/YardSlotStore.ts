import { Injectable, computed, signal } from "@angular/core";
import { listYardSlot } from "../api/YardSlot";
import type { YardSlotView } from "../types/YardSlot";

/** 堆场箱位 store：展示审批联动后的占用结果。 */
@Injectable({ providedIn: "root" })
export class YardSlotStore {
  readonly slots = signal<YardSlotView[]>([]);
  readonly loading = signal(false);

  readonly emptyCount = computed(() => this.slots().filter((slot) => slot.slot_status === "EMPTY").length);
  readonly reservedCount = computed(() => this.slots().filter((slot) => slot.slot_status === "RESERVED").length);
  readonly occupiedCount = computed(() => this.slots().filter((slot) => slot.slot_status === "OCCUPIED").length);
  readonly lockedCount = computed(() => this.slots().filter((slot) => slot.slot_status === "LOCKED").length);

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.slots.set(await listYardSlot());
    } finally {
      this.loading.set(false);
    }
  }

  /** 审批对话框只能选择当前仍为空的箱位。 */
  emptySlots(): YardSlotView[] {
    return this.slots().filter((slot) => slot.slot_status === "EMPTY");
  }
}
