export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  PLAN_NOT_FOUND: "靠泊计划不存在",
  VESSEL_NOT_FOUND: "船舶不存在",
  BERTH_NOT_FOUND: "泊位不存在",
  SLOT_NOT_FOUND: "堆场箱位不存在",
  INVALID_TIME_RANGE: "计划到港时间必须早于离港时间",
  VESSEL_BERTH_MISMATCH: "船舶长度或吃水超出泊位限制，审批已拒绝",
  SLOT_NOT_EMPTY: "箱位已非空，可能已被其他审批预留",
  PLAN_ALREADY_PROCESSED: "该计划已被处理，请勿重复审批"
};
