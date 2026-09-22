import { vesselRepository } from "../repositories/VesselRepository";
import type { Vessel } from "../models/Vessel";

export const vesselService = {
  list: () => vesselRepository.findAll(),
  create: (row: unknown) => vesselRepository.save(row as Vessel)
};
