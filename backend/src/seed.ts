import { BerthPlanStatus } from "./constants/BerthPlanStatus";
import { YardSlotStatus } from "./constants/YardSlotStatus";

/**
 * 本地内存数据库种子。
 * 仓库层对该结构进行深拷贝，保证运行期写入不会污染种子，且重启后回到初始状态。
 * 时间以 2026-09-22（当日）为锚点，便于直接演示冲突与审批联动。
 */
export const seed = {
  vessel: [
    {
      id: 1,
      vessel_name: "远洋先锋",
      imo_no: "IMO-9472816",
      carrier: "中远海运",
      length_m: 220,
      draft_m: 11.5,
      eta: "2026-09-22T06:00:00.000Z",
      etd: "2026-09-22T20:00:00.000Z",
      status: "EXPECTED"
    },
    {
      id: 2,
      vessel_name: "南海明珠",
      imo_no: "IMO-9288719",
      carrier: "招商轮船",
      length_m: 180,
      draft_m: 9.2,
      eta: "2026-09-23T02:00:00.000Z",
      etd: "2026-09-23T16:00:00.000Z",
      status: "EXPECTED"
    },
    {
      id: 3,
      vessel_name: "东方海湾",
      imo_no: "IMO-9655271",
      carrier: "海丰国际",
      length_m: 260,
      draft_m: 13.8,
      eta: "2026-09-24T00:00:00.000Z",
      etd: "2026-09-24T18:00:00.000Z",
      status: "EXPECTED"
    },
    {
      id: 4,
      vessel_name: "华海快航",
      imo_no: "IMO-9119994",
      carrier: "中谷物流",
      length_m: 150,
      draft_m: 7.6,
      eta: "2026-09-22T10:00:00.000Z",
      etd: "2026-09-23T02:00:00.000Z",
      status: "EXPECTED"
    }
  ],
  berth: [
    {
      id: 1,
      berth_code: "B-01",
      length_m: 300,
      water_depth_m: 15,
      berth_type: "CONTAINER",
      current_status: "AVAILABLE",
      safety_note: "主航道侧，注意强风流"
    },
    {
      id: 2,
      berth_code: "B-02",
      length_m: 200,
      water_depth_m: 10,
      berth_type: "CONTAINER",
      current_status: "AVAILABLE",
      safety_note: "夜间限制作业"
    },
    {
      id: 3,
      berth_code: "B-03",
      length_m: 180,
      water_depth_m: 9,
      berth_type: "BULK",
      current_status: "AVAILABLE",
      safety_note: "散货泊位，龙门吊检修中"
    }
  ],
  berthPlan: [
    {
      id: 1,
      vessel_id: 1,
      berth_id: 1,
      planned_arrival: "2026-09-22T08:00:00.000Z",
      planned_departure: "2026-09-22T18:00:00.000Z",
      priority: "HIGH",
      status: BerthPlanStatus[2], // APPROVED
      dispatcher_id: 1,
      reserved_slot_id: 11
    },
    {
      id: 2,
      vessel_id: 2,
      berth_id: 2,
      planned_arrival: "2026-09-23T04:00:00.000Z",
      planned_departure: "2026-09-23T14:00:00.000Z",
      priority: "NORMAL",
      status: BerthPlanStatus[0], // DRAFT
      dispatcher_id: 1,
      reserved_slot_id: null
    },
    {
      id: 3,
      vessel_id: 3,
      berth_id: 2,
      planned_arrival: "2026-09-23T08:00:00.000Z",
      planned_departure: "2026-09-23T20:00:00.000Z",
      priority: "NORMAL",
      status: BerthPlanStatus[1], // CONFLICT（与计划 2 时间窗重叠，演示用）
      dispatcher_id: 1,
      reserved_slot_id: null
    },
    {
      id: 4,
      vessel_id: 4,
      berth_id: 3,
      planned_arrival: "2026-09-22T12:00:00.000Z",
      planned_departure: "2026-09-23T00:00:00.000Z",
      priority: "LOW",
      status: BerthPlanStatus[0], // DRAFT
      dispatcher_id: 1,
      reserved_slot_id: null
    }
  ],
  yardSlot: [
    // A 区：计划 1 已预留 11 号位
    { id: 11, yard_area: "A", row_no: "R1", bay_no: "B1", tier_no: "T1", container_no: "", slot_status: YardSlotStatus[1], cargo_type: "EMPTY", reserved_by_plan: 1 },
    { id: 12, yard_area: "A", row_no: "R1", bay_no: "B1", tier_no: "T2", container_no: "", slot_status: YardSlotStatus[0], cargo_type: "EMPTY", reserved_by_plan: null },
    { id: 13, yard_area: "A", row_no: "R1", bay_no: "B2", tier_no: "T1", container_no: "CBHU8821104", slot_status: YardSlotStatus[2], cargo_type: "FULL", reserved_by_plan: null },
    { id: 14, yard_area: "A", row_no: "R2", bay_no: "B1", tier_no: "T1", container_no: "", slot_status: YardSlotStatus[0], cargo_type: "EMPTY", reserved_by_plan: null },
    { id: 15, yard_area: "A", row_no: "R2", bay_no: "B2", tier_no: "T1", container_no: "", slot_status: YardSlotStatus[0], cargo_type: "EMPTY", reserved_by_plan: null },
    { id: 16, yard_area: "A", row_no: "R2", bay_no: "B3", tier_no: "T1", container_no: "MSCU7712039", slot_status: YardSlotStatus[3], cargo_type: "FULL", reserved_by_plan: null },
    // B 区：可用于审批计划 2/4
    { id: 21, yard_area: "B", row_no: "R1", bay_no: "B1", tier_no: "T1", container_no: "", slot_status: YardSlotStatus[0], cargo_type: "EMPTY", reserved_by_plan: null },
    { id: 22, yard_area: "B", row_no: "R1", bay_no: "B1", tier_no: "T2", container_no: "", slot_status: YardSlotStatus[0], cargo_type: "EMPTY", reserved_by_plan: null },
    { id: 23, yard_area: "B", row_no: "R1", bay_no: "B2", tier_no: "T1", container_no: "", slot_status: YardSlotStatus[0], cargo_type: "EMPTY", reserved_by_plan: null },
    { id: 24, yard_area: "B", row_no: "R2", bay_no: "B1", tier_no: "T1", container_no: "TCLU5520918", slot_status: YardSlotStatus[2], cargo_type: "FULL", reserved_by_plan: null },
    { id: 25, yard_area: "B", row_no: "R2", bay_no: "B2", tier_no: "T1", container_no: "", slot_status: YardSlotStatus[0], cargo_type: "EMPTY", reserved_by_plan: null },
    { id: 26, yard_area: "B", row_no: "R2", bay_no: "B3", tier_no: "T1", container_no: "", slot_status: YardSlotStatus[0], cargo_type: "EMPTY", reserved_by_plan: null }
  ],
  workTask: [
    {
      id: 1,
      berth_plan_id: 1,
      yard_slot_id: 11,
      task_type: "DISCHARGE",
      team_id: 1,
      status: "PLANNED",
      planned_start: "2026-09-22T09:00:00.000Z",
      finished_at: ""
    }
  ],
  auditLog: [
    {
      id: 1,
      actor: "dispatcher#1",
      action: "BerthPlan.approve",
      target_type: "BerthPlan",
      target_id: "1",
      detail: "slot=11",
      created_at: "2026-09-21T03:10:00.000Z"
    }
  ]
};

export type SeedDatabase = typeof seed;
