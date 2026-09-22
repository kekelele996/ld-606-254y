import { Injectable, signal } from "@angular/core";
import { listWorkTask } from "../api/WorkTask";
import type { WorkTask } from "../types/WorkTask";

@Injectable({ providedIn: "root" })
export class WorkTaskStore {
  readonly tasks = signal<WorkTask[]>([]);
  readonly loading = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.tasks.set(await listWorkTask());
    } finally {
      this.loading.set(false);
    }
  }
}
