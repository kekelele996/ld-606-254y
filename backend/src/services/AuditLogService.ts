import { db, nextId } from "../repositories/inMemoryDb";

export interface AuditLogEntry {
  id: number;
  actor: string;
  action: string;
  target_type: string;
  target_id: string;
  detail: string;
  created_at: string;
}

/** 所有写操作（计划提交/审批、箱位预留）统一落审计日志。 */
export function recordAuditLog(entry: Omit<AuditLogEntry, "id" | "created_at">): AuditLogEntry {
  const row: AuditLogEntry = {
    id: nextId(db.auditLog),
    created_at: new Date().toISOString(),
    ...entry
  };
  db.auditLog.push(row);
  console.info("audit", row.action, row.target_type + "#" + row.target_id, row.detail);
  return row;
}

export function listAuditLogs(): AuditLogEntry[] {
  return db.auditLog as AuditLogEntry[];
}
