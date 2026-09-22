import { seed } from "../seed";
import type { Berth } from "../models/Berth";
import { InMemoryRepository } from "./inMemoryRepository";

class BerthRepository extends InMemoryRepository<Berth> {
  save(row: Berth): Berth {
    return this.insert(row);
  }
}

export const berthRepository = new BerthRepository(seed.berth);
