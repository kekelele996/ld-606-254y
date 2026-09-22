import { ERROR_CODES } from "./errorCodes";

export const ERROR_MESSAGES: Record<keyof typeof ERROR_CODES, string> = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  PLAN_NOT_FOUND: "berth plan not found",
  BERTH_NOT_FOUND: "berth not found",
  VESSEL_NOT_FOUND: "vessel not found",
  SLOT_NOT_FOUND: "yard slot not found",
  BERTH_LENGTH_EXCEEDED: "vessel length exceeds berth length limit",
  BERTH_DRAFT_EXCEEDED: "vessel draft exceeds berth water depth",
  SLOT_NOT_EMPTY: "yard slot is no longer empty",
  PLAN_ALREADY_PROCESSED: "berth plan has already been processed",
  SLOT_REQUIRED: "an empty yard slot must be specified for approval",
  INVALID_TIME_RANGE: "planned departure must be after planned arrival",
  CONCURRENT_UPDATE: "the plan is being processed by another request"
};
