import { seed } from "../seed";
import type { WorkTask } from "../models/WorkTask";
import { InMemoryRepository } from "./inMemoryRepository";

class WorkTaskRepository extends InMemoryRepository<WorkTask> {
  save(row: WorkTask): WorkTask {
    return this.insert(row);
  }
}

export const workTaskRepository = new WorkTaskRepository(seed.workTask);
