import { berthRepository } from "../repositories/BerthRepository";
import type { Berth } from "../models/Berth";

export const berthService = {
  list: () => berthRepository.findAll(),
  create: (row: unknown) => berthRepository.save(row as Berth)
};
