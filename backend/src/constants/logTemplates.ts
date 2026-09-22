export const LOG_TEMPLATES = {
  Vessel: ["Vessel.create", "Vessel.update", "Vessel.status", "Vessel.export"],
  Berth: ["Berth.create", "Berth.update", "Berth.status", "Berth.export"],
  BerthPlan: [
    "BerthPlan.create",
    "BerthPlan.update",
    "BerthPlan.status",
    "BerthPlan.export",
    "BerthPlan.submit",
    "BerthPlan.conflict",
    "BerthPlan.approve",
    "BerthPlan.reject"
  ],
  YardSlot: [
    "YardSlot.create",
    "YardSlot.update",
    "YardSlot.status",
    "YardSlot.export",
    "YardSlot.reserve",
    "YardSlot.release"
  ],
  WorkTask: ["WorkTask.create", "WorkTask.update", "WorkTask.status", "WorkTask.export"]
};
