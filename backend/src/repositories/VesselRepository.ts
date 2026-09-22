import { db } from "./inMemoryDb";
import type { Vessel } from "../models/Vessel";

export const vesselRepository = {
  findAll(): Vessel[] {
    return db.vessel as Vessel[];
  },
  findById(id: number): Vessel | undefined {
    return (db.vessel as Vessel[]).find((row) => row.id === id);
  },
  insert(row: Vessel): Vessel {
    db.vessel.push(row);
    return row;
  }
};
