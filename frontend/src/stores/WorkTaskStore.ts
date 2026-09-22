import { listWorkTask } from "../api/WorkTask";
import type { WorkTask } from "../types/WorkTask";

export class WorkTaskStore {
  rows: WorkTask[] = [];
  loading = false;

  async load(): Promise<WorkTask[]> {
    this.loading = true;
    try {
      this.rows = await listWorkTask();
      return this.rows;
    } finally {
      this.loading = false;
    }
  }
}

export const workTaskStore = new WorkTaskStore();
