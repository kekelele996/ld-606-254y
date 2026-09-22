import type { Berth } from "./models/Berth";
import type { BerthPlan } from "./models/BerthPlan";
import type { Vessel } from "./models/Vessel";
import type { YardSlot } from "./models/YardSlot";
import type { WorkTask } from "./models/WorkTask";

/**
 * 内存种子数据（本地数据库的运行时镜像，禁止接入第三方 API）。
 * 尺寸字段在表里是 TEXT，这里用可解析为米的字符串。
 */
export const seed: {
  vessel: Vessel[];
  berth: Berth[];
  berthPlan: BerthPlan[];
  yardSlot: YardSlot[];
  workTask: WorkTask[];
} = {
  vessel: [
    {
      id: 1,
      vessel_name: "海河轮",
      imo_no: "IMO 9123001",
      carrier: "华海航运",
      length_m: "180",
      draft_m: "9.5",
      eta: "2026-09-23T02:00:00Z",
      etd: "2026-09-24T06:00:00Z",
      status: "EXPECTED"
    },
    {
      id: 2,
      vessel_name: "甬江轮",
      imo_no: "IMO 9123002",
      carrier: "远洋集运",
      length_m: "220",
      draft_m: "11.5",
      eta: "2026-09-26T01:00:00Z",
      etd: "2026-09-28T03:00:00Z",
      status: "EXPECTED"
    },
    {
      id: 3,
      vessel_name: "新贝塘轮",
      imo_no: "IMO 9123003",
      carrier: "华海航运",
      length_m: "150",
      draft_m: "7.2",
      eta: "2026-09-23T08:00:00Z",
      etd: "2026-09-24T02:00:00Z",
      status: "EXPECTED"
    },
    {
      id: 4,
      vessel_name: "和平轮",
      imo_no: "IMO 9123004",
      carrier: "湾区驳运",
      length_m: "95",
      draft_m: "4.8",
      eta: "2026-09-29T00:00:00Z",
      etd: "2026-09-29T12:00:00Z",
      status: "EXPECTED"
    }
  ],
  berth: [
    {
      id: 1,
      berth_code: "B-01",
      length_m: "200",
      water_depth_m: "10.5",
      berth_type: "CONTAINER",
      current_status: "OCCUPIED",
      safety_note: "调头区夜间限速 4 节"
    },
    {
      id: 2,
      berth_code: "B-02",
      length_m: "260",
      water_depth_m: "13",
      berth_type: "CONTAINER",
      current_status: "FREE",
      safety_note: "大潮窗口期靠泊"
    },
    {
      id: 3,
      berth_code: "B-03",
      length_m: "120",
      water_depth_m: "6",
      berth_type: "FEEDER",
      current_status: "FREE",
      safety_note: "仅接纳支线驳船"
    }
  ],
  berthPlan: [
    {
      id: 1,
      vessel_id: 1,
      berth_id: 1,
      planned_arrival: "2026-09-23T02:00:00Z",
      planned_departure: "2026-09-24T06:00:00Z",
      priority: "HIGH",
      status: "APPROVED",
      dispatcher_id: 1,
      conflict_reason: null,
      conflict_plan_ids: [],
      yard_slot_id: 1,
      approved_at: "2026-09-20T03:10:00Z"
    },
    {
      id: 2,
      vessel_id: 2,
      berth_id: 2,
      planned_arrival: "2026-09-26T01:00:00Z",
      planned_departure: "2026-09-28T03:00:00Z",
      priority: "NORMAL",
      status: "DRAFT",
      dispatcher_id: 1,
      conflict_reason: null,
      conflict_plan_ids: [],
      yard_slot_id: null,
      approved_at: null
    },
    {
      id: 3,
      vessel_id: 3,
      berth_id: 1,
      planned_arrival: "2026-09-23T08:00:00Z",
      planned_departure: "2026-09-24T02:00:00Z",
      priority: "NORMAL",
      status: "CONFLICT",
      dispatcher_id: 1,
      conflict_reason:
        "与已批准计划 #1（泊位 B-01）在港时间重叠：2026-09-23T08:00:00Z~2026-09-24T02:00:00Z 与 2026-09-23T02:00:00Z~2026-09-24T06:00:00Z 重叠",
      conflict_plan_ids: [1],
      yard_slot_id: null,
      approved_at: null
    },
    {
      id: 4,
      vessel_id: 4,
      berth_id: 3,
      planned_arrival: "2026-09-29T00:00:00Z",
      planned_departure: "2026-09-29T12:00:00Z",
      priority: "LOW",
      status: "DRAFT",
      dispatcher_id: 1,
      conflict_reason: null,
      conflict_plan_ids: [],
      yard_slot_id: null,
      approved_at: null
    }
  ],
  yardSlot: [
    { id: 1, yard_area: "A区", row_no: "01", bay_no: "01", tier_no: "00", container_no: "", slot_status: "RESERVED", cargo_type: "GENERAL", reserved_by_plan_id: 1 },
    { id: 2, yard_area: "A区", row_no: "01", bay_no: "02", tier_no: "00", container_no: "", slot_status: "EMPTY", cargo_type: "GENERAL", reserved_by_plan_id: null },
    { id: 3, yard_area: "A区", row_no: "01", bay_no: "03", tier_no: "00", container_no: "", slot_status: "EMPTY", cargo_type: "REEFER", reserved_by_plan_id: null },
    { id: 4, yard_area: "A区", row_no: "02", bay_no: "01", tier_no: "00", container_no: "", slot_status: "EMPTY", cargo_type: "GENERAL", reserved_by_plan_id: null },
    { id: 5, yard_area: "A区", row_no: "02", bay_no: "02", tier_no: "00", container_no: "COSU1234567", slot_status: "OCCUPIED", cargo_type: "GENERAL", reserved_by_plan_id: null },
    { id: 6, yard_area: "A区", row_no: "02", bay_no: "03", tier_no: "00", container_no: "", slot_status: "EMPTY", cargo_type: "HAZMAT", reserved_by_plan_id: null },
    { id: 7, yard_area: "A区", row_no: "03", bay_no: "01", tier_no: "00", container_no: "", slot_status: "EMPTY", cargo_type: "GENERAL", reserved_by_plan_id: null },
    { id: 8, yard_area: "A区", row_no: "03", bay_no: "02", tier_no: "00", container_no: "", slot_status: "LOCKED", cargo_type: "GENERAL", reserved_by_plan_id: null },
    { id: 9, yard_area: "A区", row_no: "03", bay_no: "03", tier_no: "00", container_no: "", slot_status: "EMPTY", cargo_type: "GENERAL", reserved_by_plan_id: null }
  ],
  workTask: [
    {
      id: 1,
      berth_plan_id: 1,
      yard_slot_id: 1,
      task_type: "DISCHARGE",
      team_id: 1,
      status: "IN_PROGRESS",
      planned_start: "2026-09-23T03:00:00Z",
      finished_at: ""
    },
    {
      id: 2,
      berth_plan_id: 2,
      yard_slot_id: 2,
      task_type: "LOAD",
      team_id: 2,
      status: "PENDING",
      planned_start: "2026-09-26T03:00:00Z",
      finished_at: ""
    },
    {
      id: 3,
      berth_plan_id: 4,
      yard_slot_id: 3,
      task_type: "SHIFT",
      team_id: 3,
      status: "PENDING",
      planned_start: "2026-09-29T02:00:00Z",
      finished_at: ""
    }
  ]
};
