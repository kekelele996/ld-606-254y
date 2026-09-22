import { berthRepository } from "../repositories/BerthRepository";
import { nextId } from "../repositories/inMemoryDb";
import { createBerthDto } from "../constructors/BerthDtoFactory";
import { recordAuditLog } from "./AuditLogService";

export const berthService = {
  list: () => berthRepository.findAll(),
  create: (row: Record<string, unknown>) => {
    const saved = berthRepository.insert(createBerthDto({ ...(row as object), id: nextId(berthRepository.findAll()) }));
    recordAuditLog({ actor: "dispatcher#1", action: "Berth.create", target_type: "Berth", target_id: String(saved.id), detail: saved.berth_code });
    return saved;
  }
};
