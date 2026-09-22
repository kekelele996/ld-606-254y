export const YardSlotStatus = ["EMPTY","RESERVED","OCCUPIED","LOCKED"] as const;
export type YardSlotStatus = (typeof YardSlotStatus)[number];
export const YardSlotStatusText: Record<YardSlotStatus, string> = Object.fromEntries(YardSlotStatus.map((value) => [value, value.replace(/_/g, " ")])) as Record<YardSlotStatus, string>;

/** 堆场箱位中文状态文案（箱位矩阵/筛选器共用） */
export const YardSlotStatusLabel: Record<YardSlotStatus, string> = {
  EMPTY: "空箱位",
  RESERVED: "已预留",
  OCCUPIED: "已占用",
  LOCKED: "已锁定"
};

/** 箱位状态对应的色块色调，YardGrid 与 StatusBadge 共用 */
export const YardSlotStatusTone: Record<YardSlotStatus, string> = {
  EMPTY: "empty",
  RESERVED: "reserved",
  OCCUPIED: "occupied",
  LOCKED: "locked"
};
