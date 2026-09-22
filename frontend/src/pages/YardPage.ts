import { Component, OnInit, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import type { YardSlot } from "../types/YardSlot";
import type { BerthPlan } from "../types/BerthPlan";
import { yardSlotStore } from "../stores/YardSlotStore";
import { berthPlanStore } from "../stores/BerthPlanStore";
import { useYardMatrix } from "../hooks/useYardMatrix";
import { YardGrid } from "../components/common/YardGrid";
import { StatusBadge } from "../components/common/StatusBadge";

/** 堆场箱位页：审批联动后箱位矩阵实时呈现预留/占用结果，支持箱号搜索与状态筛选 */
@Component({
  selector: "app-yard-page",
  standalone: true,
  imports: [CommonModule, FormsModule, YardGrid, StatusBadge],
  templateUrl: "./yard-page.html"
})
export class YardPage implements OnInit {
  slots = signal<YardSlot[]>([]);
  plans = signal<BerthPlan[]>([]);
  keyword = signal("");
  statusFilter = signal("ALL");

  async ngOnInit(): Promise<void> {
    const [slots, plans] = await Promise.all([yardSlotStore.load(), berthPlanStore.load()]);
    this.slots.set(slots);
    this.plans.set(plans);
  }

  async refresh(): Promise<void> {
    this.slots.set(await yardSlotStore.reload());
    this.plans.set(await berthPlanStore.load());
  }

  get matrix() {
    return useYardMatrix(this.slots());
  }

  filteredSlots = computed<YardSlot[]>(() => {
    const word = this.keyword().trim().toLowerCase();
    const status = this.statusFilter();
    return this.slots().filter((slot) => {
      if (status !== "ALL" && slot.slot_status !== status) return false;
      if (!word) return true;
      return (
        slot.container_no.toLowerCase().includes(word) ||
        String(slot.reserved_by_plan_id ?? "").includes(word) ||
        `${slot.yard_area}${slot.row_no}${slot.bay_no}${slot.tier_no}`.toLowerCase().includes(word)
      );
    });
  });

  reservedSlots = computed(() =>
    this.slots()
      .filter((slot) => slot.reserved_by_plan_id !== null)
      .map((slot) => ({ slot, plan: this.plans().find((p) => p.id === slot.reserved_by_plan_id) ?? null }))
  );
}
