import { db } from "./inMemoryDb";
import type { Berth } from "../models/Berth";

export const berthRepository = {
  findAll(): Berth[] {
    return db.berth as Berth[];
  },
  findById(id: number): Berth | undefined {
    return (db.berth as Berth[]).find((row) => row.id === id);
  },
  insert(row: Berth): Berth {
    db.berth.push(row);
    return row;
  }
};
