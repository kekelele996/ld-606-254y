import { db } from "./inMemoryDb";
import type { WorkTask } from "../models/WorkTask";

export const workTaskRepository = {
  findAll(): WorkTask[] {
    return db.workTask as WorkTask[];
  },
  findById(id: number): WorkTask | undefined {
    return (db.workTask as WorkTask[]).find((row) => row.id === id);
  },
  insert(row: WorkTask): WorkTask {
    db.workTask.push(row);
    return row;
  }
};
