export const BerthPlanStatus = ["DRAFT","CONFLICT","APPROVED","BERTHING","DEPARTED","CANCELLED"] as const;
export type BerthPlanStatus = (typeof BerthPlanStatus)[number];
export const BerthPlanStatusText: Record<BerthPlanStatus, string> = Object.fromEntries(BerthPlanStatus.map((value) => [value, value.replace(/_/g, " ")])) as Record<BerthPlanStatus, string>;

/** 泊位计划中文状态文案（展示组件/筛选器共用） */
export const BerthPlanStatusLabel: Record<BerthPlanStatus, string> = {
  DRAFT: "待审批",
  CONFLICT: "时间冲突",
  APPROVED: "已批准",
  BERTHING: "靠泊中",
  DEPARTED: "已离泊",
  CANCELLED: "已取消"
};

/** 状态对应的徽标色调，StatusBadge 与冲突标记共用 */
export const BerthPlanStatusTone: Record<BerthPlanStatus, string> = {
  DRAFT: "muted",
  CONFLICT: "danger",
  APPROVED: "success",
  BERTHING: "info",
  DEPARTED: "muted",
  CANCELLED: "muted"
};
