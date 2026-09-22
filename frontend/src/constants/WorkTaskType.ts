export const WorkTaskType = ["LOAD", "DISCHARGE", "SHIFT", "INSPECTION"] as const;
export type WorkTaskType = (typeof WorkTaskType)[number];

export const WorkTaskTypeText: Record<WorkTaskType, string> = {
  LOAD: "装船",
  DISCHARGE: "卸船",
  SHIFT: "移箱",
  INSPECTION: "查验"
};
