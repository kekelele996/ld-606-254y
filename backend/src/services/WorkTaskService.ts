import { workTaskRepository } from "../repositories/WorkTaskRepository";
import { nextId } from "../repositories/inMemoryDb";
import { createWorkTaskDto } from "../constructors/WorkTaskDtoFactory";

export const workTaskService = {
  list: () => workTaskRepository.findAll(),
  create: (row: Record<string, unknown>) =>
    workTaskRepository.insert(createWorkTaskDto({ ...(row as object), id: nextId(workTaskRepository.findAll()) }))
};
