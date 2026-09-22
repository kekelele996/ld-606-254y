import { workTaskRepository } from "../repositories/WorkTaskRepository";
import type { WorkTask } from "../models/WorkTask";

export const workTaskService = {
  list: () => workTaskRepository.findAll(),
  create: (row: unknown) => workTaskRepository.save(row as WorkTask)
};
