/**
 * 本地种子数据（离线回退），结构与后端 /api 返回保持一致。
 * 仅在后端不可达时使用，禁止接入第三方 API。
 */
export const mockData = {
  vessel: [
    { id: 1, vessel_name: "远洋先锋", imo_no: "IMO-9472816", carrier: "中远海运", length_m: 220, draft_m: 11.5, eta: "2026-09-22T06:00:00.000Z", etd: "2026-09-22T20:00:00.000Z", status: "EXPECTED" },
    { id: 2, vessel_name: "南海明珠", imo_no: "IMO-9288719", carrier: "招商轮船", length_m: 180, draft_m: 9.2, eta: "2026-09-23T02:00:00.000Z", etd: "2026-09-23T16:00:00.000Z", status: "EXPECTED" },
    { id: 3, vessel_name: "东方海湾", imo_no: "IMO-9655271", carrier: "海丰国际", length_m: 260, draft_m: 13.8, eta: "2026-09-24T00:00:00.000Z", etd: "2026-09-24T18:00:00.000Z", status: "EXPECTED" },
    { id: 4, vessel_name: "华海快航", imo_no: "IMO-9119994", carrier: "中谷物流", length_m: 150, draft_m: 7.6, eta: "2026-09-22T10:00:00.000Z", etd: "2026-09-23T02:00:00.000Z", status: "EXPECTED" }
  ],
  berth: [
    { id: 1, berth_code: "B-01", length_m: 300, water_depth_m: 15, berth_type: "CONTAINER", current_status: "AVAILABLE", safety_note: "主航道侧，注意强风流" },
    { id: 2, berth_code: "B-02", length_m: 200, water_depth_m: 10, berth_type: "CONTAINER", current_status: "AVAILABLE", safety_note: "夜间限制作业" },
    { id: 3, berth_code: "B-03", length_m: 180, water_depth_m: 9, berth_type: "BULK", current_status: "AVAILABLE", safety_note: "散货泊位，龙门吊检修中" }
  ],
  berthPlan: [
    { id: 1, vessel_id: 1, berth_id: 1, planned_arrival: "2026-09-22T08:00:00.000Z", planned_departure: "2026-09-22T18:00:00.000Z", priority: "HIGH", status: "APPROVED", dispatcher_id: 1, reserved_slot_id: 11, vessel_name: "远洋先锋", berth_code: "B-01", reserved_slot_code: "A-R1-B1-T1" },
    { id: 2, vessel_id: 2, berth_id: 2, planned_arrival: "2026-09-23T04:00:00.000Z", planned_departure: "2026-09-23T14:00:00.000Z", priority: "NORMAL", status: "DRAFT", dispatcher_id: 1, reserved_slot_id: null, vessel_name: "南海明珠", berth_code: "B-02", reserved_slot_code: null },
    { id: 3, vessel_id: 3, berth_id: 2, planned_arrival: "2026-09-23T08:00:00.000Z", planned_departure: "2026-09-23T20:00:00.000Z", priority: "NORMAL", status: "CONFLICT", dispatcher_id: 1, reserved_slot_id: null, vessel_name: "东方海湾", berth_code: "B-02", reserved_slot_code: null },
    { id: 4, vessel_id: 4, berth_id: 3, planned_arrival: "2026-09-22T12:00:00.000Z", planned_departure: "2026-09-23T00:00:00.000Z", priority: "LOW", status: "DRAFT", dispatcher_id: 1, reserved_slot_id: null, vessel_name: "华海快航", berth_code: "B-03", reserved_slot_code: null }
  ],
  yardSlot: [
    { id: 11, yard_area: "A", row_no: "R1", bay_no: "B1", tier_no: "T1", container_no: "", slot_status: "RESERVED", cargo_type: "EMPTY", reserved_by_plan: 1, slot_code: "A-R1-B1-T1", occupied_by_plan: 1 },
    { id: 12, yard_area: "A", row_no: "R1", bay_no: "B1", tier_no: "T2", container_no: "", slot_status: "EMPTY", cargo_type: "EMPTY", reserved_by_plan: null, slot_code: "A-R1-B1-T2", occupied_by_plan: null },
    { id: 13, yard_area: "A", row_no: "R1", bay_no: "B2", tier_no: "T1", container_no: "CBHU8821104", slot_status: "OCCUPIED", cargo_type: "FULL", reserved_by_plan: null, slot_code: "A-R1-B2-T1", occupied_by_plan: null },
    { id: 14, yard_area: "A", row_no: "R2", bay_no: "B1", tier_no: "T1", container_no: "", slot_status: "EMPTY", cargo_type: "EMPTY", reserved_by_plan: null, slot_code: "A-R2-B1-T1", occupied_by_plan: null },
    { id: 15, yard_area: "A", row_no: "R2", bay_no: "B2", tier_no: "T1", container_no: "", slot_status: "EMPTY", cargo_type: "EMPTY", reserved_by_plan: null, slot_code: "A-R2-B2-T1", occupied_by_plan: null },
    { id: 16, yard_area: "A", row_no: "R2", bay_no: "B3", tier_no: "T1", container_no: "MSCU7712039", slot_status: "LOCKED", cargo_type: "FULL", reserved_by_plan: null, slot_code: "A-R2-B3-T1", occupied_by_plan: null },
    { id: 21, yard_area: "B", row_no: "R1", bay_no: "B1", tier_no: "T1", container_no: "", slot_status: "EMPTY", cargo_type: "EMPTY", reserved_by_plan: null, slot_code: "B-R1-B1-T1", occupied_by_plan: null },
    { id: 22, yard_area: "B", row_no: "R1", bay_no: "B1", tier_no: "T2", container_no: "", slot_status: "EMPTY", cargo_type: "EMPTY", reserved_by_plan: null, slot_code: "B-R1-B1-T2", occupied_by_plan: null },
    { id: 23, yard_area: "B", row_no: "R1", bay_no: "B2", tier_no: "T1", container_no: "", slot_status: "EMPTY", cargo_type: "EMPTY", reserved_by_plan: null, slot_code: "B-R1-B2-T1", occupied_by_plan: null },
    { id: 24, yard_area: "B", row_no: "R2", bay_no: "B1", tier_no: "T1", container_no: "TCLU5520918", slot_status: "OCCUPIED", cargo_type: "FULL", reserved_by_plan: null, slot_code: "B-R2-B1-T1", occupied_by_plan: null },
    { id: 25, yard_area: "B", row_no: "R2", bay_no: "B2", tier_no: "T1", container_no: "", slot_status: "EMPTY", cargo_type: "EMPTY", reserved_by_plan: null, slot_code: "B-R2-B2-T1", occupied_by_plan: null },
    { id: 26, yard_area: "B", row_no: "R2", bay_no: "B3", tier_no: "T1", container_no: "", slot_status: "EMPTY", cargo_type: "EMPTY", reserved_by_plan: null, slot_code: "B-R2-B3-T1", occupied_by_plan: null }
  ],
  workTask: [
    { id: 1, berth_plan_id: 1, yard_slot_id: 11, task_type: "DISCHARGE", team_id: 1, status: "PLANNED", planned_start: "2026-09-22T09:00:00.000Z", finished_at: "" }
  ]
} as const;
