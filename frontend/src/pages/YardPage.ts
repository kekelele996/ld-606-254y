import { Component, OnInit, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { YardSlotStore } from "../stores/YardSlotStore";
import { BerthPlanStore } from "../stores/BerthPlanStore";
import { YardGrid } from "../components/common/YardGrid";
import { StatusBadge } from "../components/common/StatusBadge";
import { occupancyRate, useYardMatrix } from "../hooks/useYardMatrix";
import { usePagination } from "../hooks/usePagination";
import { YardSlotStatusText } from "../constants/YardSlotStatus";

@Component({
  selector: "app-yard-page",
  standalone: true,
  imports: [CommonModule, FormsModule, YardGrid, StatusBadge],
  templateUrl: "./yard-page.html"
})
export class YardPage implements OnInit {
  protected readonly slotStore;
  protected readonly planStore;

  keyword = "";

  constructor(slotStore: YardSlotStore, planStore: BerthPlanStore) {
    this.slotStore = slotStore;
    this.planStore = planStore;
  }

  ngOnInit() {
    void Promise.all([this.slotStore.load(), this.planStore.load()]);
  }

  matrixOf = useYardMatrix;

  readonly filteredSlots = computed(() => {
    const word = this.keyword.trim().toLowerCase();
    const slots = this.slotStore.slots();
    if (!word) return slots;
    return slots.filter(
      (slot) =>
        slot.slot_code.toLowerCase().includes(word) ||
        slot.container_no.toLowerCase().includes(word) ||
        (slot.occupied_by_plan != null && String(slot.occupied_by_plan).includes(word))
    );
  });

  readonly pagination = usePagination(this.filteredSlots, 12);
  readonly occupancy = computed(() => occupancyRate(this.slotStore.slots()));

  statusText(value: string) {
    return (YardSlotStatusText as Record<string, string>)[value] ?? value;
  }

  refresh() {
    void Promise.all([this.slotStore.load(), this.planStore.load()]);
  }
}
