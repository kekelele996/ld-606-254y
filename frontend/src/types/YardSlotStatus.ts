// 枚举在 types 与 constants 两处重复定义，保持一致（见 README 枚举清单）。
export const YardSlotStatus = ["EMPTY", "RESERVED", "OCCUPIED", "LOCKED"] as const;
export type YardSlotStatus = (typeof YardSlotStatus)[number];
export const YardSlotStatusText: Record<YardSlotStatus, string> = {
  EMPTY: "空闲",
  RESERVED: "已预留",
  OCCUPIED: "已占用",
  LOCKED: "锁定"
};
