import { vesselRepository } from "../repositories/VesselRepository";
import { nextId } from "../repositories/inMemoryDb";
import { createVesselDto } from "../constructors/VesselDtoFactory";
import { recordAuditLog } from "./AuditLogService";

export const vesselService = {
  list: () => vesselRepository.findAll(),
  create: (row: Record<string, unknown>) => {
    const saved = vesselRepository.insert(createVesselDto({ ...(row as object), id: nextId(vesselRepository.findAll()) }));
    recordAuditLog({ actor: "dispatcher#1", action: "Vessel.create", target_type: "Vessel", target_id: String(saved.id), detail: saved.vessel_name });
    return saved;
  }
};
