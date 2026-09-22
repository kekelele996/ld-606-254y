// 枚举在 types 与 constants 两处重复定义，保持一致（见 README 枚举清单）。
export const BerthPlanStatus = ["DRAFT", "CONFLICT", "APPROVED", "BERTHING", "DEPARTED", "CANCELLED"] as const;
export type BerthPlanStatus = (typeof BerthPlanStatus)[number];
export const BerthPlanStatusText: Record<BerthPlanStatus, string> = {
  DRAFT: "待提交",
  CONFLICT: "时间冲突",
  APPROVED: "已批准",
  BERTHING: "靠泊中",
  DEPARTED: "已离泊",
  CANCELLED: "已取消"
};
