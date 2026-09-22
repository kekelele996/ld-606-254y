import { seed } from "../seed";
import type { Vessel } from "../models/Vessel";
import { InMemoryRepository } from "./inMemoryRepository";

class VesselRepository extends InMemoryRepository<Vessel> {
  save(row: Vessel): Vessel {
    return this.insert(row);
  }
}

export const vesselRepository = new VesselRepository(seed.vessel);
