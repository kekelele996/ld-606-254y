export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  PLAN_NOT_FOUND: "berth plan not found",
  VESSEL_NOT_FOUND: "vessel not found",
  BERTH_NOT_FOUND: "berth not found",
  SLOT_NOT_FOUND: "yard slot not found",
  INVALID_TIME_RANGE: "planned arrival must be parseable and earlier than planned departure",
  VESSEL_BERTH_MISMATCH: "vessel length or draft exceeds berth limits",
  SLOT_NOT_EMPTY: "yard slot is no longer empty",
  PLAN_ALREADY_PROCESSED: "berth plan has already been processed"
};
