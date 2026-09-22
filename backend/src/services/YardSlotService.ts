import { yardSlotRepository } from "../repositories/YardSlotRepository";
import type { YardSlot } from "../models/YardSlot";

export const yardSlotService = {
  list: () => yardSlotRepository.findAll(),
  create: (row: unknown) => yardSlotRepository.save(row as YardSlot)
};
