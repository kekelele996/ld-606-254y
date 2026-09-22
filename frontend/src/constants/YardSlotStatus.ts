export const YardSlotStatus = ["EMPTY", "RESERVED", "OCCUPIED", "LOCKED"] as const;
export type YardSlotStatus = (typeof YardSlotStatus)[number];

export const YardSlotStatusText: Record<YardSlotStatus, string> = {
  EMPTY: "空闲",
  RESERVED: "已预留",
  OCCUPIED: "已占用",
  LOCKED: "锁定"
};
