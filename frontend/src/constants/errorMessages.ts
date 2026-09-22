import { ERROR_CODES } from "./errorCodes";

export const ERROR_MESSAGES: Record<keyof typeof ERROR_CODES, string> = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  PLAN_NOT_FOUND: "靠泊计划不存在或已被删除",
  BERTH_NOT_FOUND: "泊位不存在",
  VESSEL_NOT_FOUND: "船舶不存在",
  SLOT_NOT_FOUND: "堆场箱位不存在",
  BERTH_LENGTH_EXCEEDED: "审批被拒绝：船舶总长超过泊位长度限制",
  BERTH_DRAFT_EXCEEDED: "审批被拒绝：船舶吃水超过泊位水深限制",
  SLOT_NOT_EMPTY: "审批被拒绝：所选箱位已不是空闲状态",
  PLAN_ALREADY_PROCESSED: "审批被拒绝：该计划已被处理，请勿重复审批",
  SLOT_REQUIRED: "审批请求必须指定一个空箱位",
  INVALID_TIME_RANGE: "离港时间必须晚于到港时间",
  CONCURRENT_UPDATE: "计划正在被其他请求处理，请刷新后重试"
};

/** 按后端返回的错误码解析中文提示，兜底显示后端原文。 */
export function resolveErrorMessage(code: string | undefined, fallback: string): string {
  if (code && Object.prototype.hasOwnProperty.call(ERROR_MESSAGES, code)) {
    return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
  }
  return fallback;
}
