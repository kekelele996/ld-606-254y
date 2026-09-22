/**
 * 靠泊计划审批与箱位联动冒烟测试（零依赖）：npx tsx src/smoke.ts
 * 覆盖：提交冲突检测与保留、审批校验拒绝、审批双写、重复/并发只成功一次。
 */
import { berthPlanService } from "./services/BerthPlanService";
import { yardSlotRepository } from "./repositories/YardSlotRepository";
import { AppError } from "./errors/AppError";

let passed = 0;
const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(`断言失败：${message}`);
  passed += 1;
  console.info(`✓ ${message}`);
};
const expectFail = async (code: string, fn: () => Promise<unknown>, message: string) => {
  try {
    await fn();
  } catch (err) {
    if (!(err instanceof AppError) || err.code !== code) throw err;
    assert(true, message);
    return;
  }
  throw new Error(`断言失败：${message}（未拒绝）`);
};

const main = async () => {
  // 1. 提交与已批准计划 #1 在 B-01 重叠：保留且标 CONFLICT，返回全部冲突
  const submitted = berthPlanService.submit(
    { vessel_id: 3, berth_id: 1, planned_arrival: "2026-09-23T20:00:00Z", planned_departure: "2026-09-25T00:00:00Z", priority: "HIGH" },
    1
  );
  assert(submitted.plan.status === "CONFLICT", "重叠计划被标记为 CONFLICT");
  assert(submitted.plan.conflict_plan_ids.includes(1), "冲突原因记录了计划 #1");
  assert(submitted.conflicts.length === 1 && submitted.conflicts[0].id === 1, "返回全部冲突计划");

  // 2. 不冲突提交为 DRAFT
  const clean = berthPlanService.submit(
    { vessel_id: 4, berth_id: 3, planned_arrival: "2026-10-01T00:00:00Z", planned_departure: "2026-10-01T08:00:00Z" },
    1
  );
  assert(clean.plan.status === "DRAFT", "无重叠计划为 DRAFT");

  // 3. 非法时间被同步拒绝
  expectFailSync("VALIDATION_FAILED", () =>
    berthPlanService.submit(
      { vessel_id: 4, berth_id: 3, planned_arrival: "2026-10-02T08:00:00Z", planned_departure: "2026-10-01T08:00:00Z" },
      1
    ), "到港晚于离港被拒绝");

  // 4. 成功审批：合规 + 空箱位 => 双写
  assert(yardSlotRepository.findById(2)?.slot_status === "EMPTY", "前置：箱位 #2 为空");
  const result = await berthPlanService.approve(clean.plan.id, { yard_slot_id: 2 });
  assert(result.plan.status === "APPROVED" && result.plan.yard_slot_id === 2, "审批通过计划关联箱位 #2");
  assert(yardSlotRepository.findById(2)?.slot_status === "RESERVED", "箱位 #2 同时预留");

  // 5. 重复审批被拒，且失败时两者都不变化
  await expectFail("PLAN_ALREADY_PROCESSED", () => berthPlanService.approve(clean.plan.id, { yard_slot_id: 4 }), "重复审批被拒绝");
  assert(yardSlotRepository.findById(4)?.slot_status === "EMPTY", "重复审批失败后箱位 #4 仍为空");

  // 6. 箱位已非空
  await expectFail("SLOT_NOT_EMPTY", () => berthPlanService.approve(2, { yard_slot_id: 2 }), "已预留箱位审批被拒");
  await expectFail("SLOT_NOT_EMPTY", () => berthPlanService.approve(2, { yard_slot_id: 8 }), "锁定箱位审批被拒");

  // 7. 船舶超限：220m 船靠 120m/6m 泊位
  const oversized = berthPlanService.submit(
    { vessel_id: 2, berth_id: 3, planned_arrival: "2026-10-05T00:00:00Z", planned_departure: "2026-10-05T12:00:00Z" },
    1
  );
  await expectFail("VESSEL_BERTH_MISMATCH", () => berthPlanService.approve(oversized.plan.id, { yard_slot_id: 3 }), "船舶超长审批被拒");
  assert(yardSlotRepository.findById(3)?.slot_status === "EMPTY", "超限拒绝后箱位 #3 仍为空");
  assert(oversized.plan.status === "DRAFT", "超限拒绝后计划状态不变");

  // 8. 缺箱位参数
  await expectFail("VALIDATION_FAILED", () => berthPlanService.approve(oversized.plan.id, {}), "未指定箱位被拒绝");

  // 9. 并发审批同一计划只成功一次
  const rival = berthPlanService.submit(
    { vessel_id: 4, berth_id: 3, planned_arrival: "2026-10-20T00:00:00Z", planned_departure: "2026-10-20T06:00:00Z" },
    1
  );
  const outcomes = await Promise.allSettled([
    berthPlanService.approve(rival.plan.id, { yard_slot_id: 6 }),
    berthPlanService.approve(rival.plan.id, { yard_slot_id: 7 })
  ]);
  assert(outcomes.filter((o) => o.status === "fulfilled").length === 1, "并发审批恰好一次成功");
  assert(
    outcomes.filter((o) => o.status === "rejected" && (o as PromiseRejectedResult).reason instanceof AppError &&
      ((o as PromiseRejectedResult).reason as AppError).code === "PLAN_ALREADY_PROCESSED").length === 1,
    "并发失败方原因为计划已处理"
  );
  const reserved = [6, 7].filter((id) => yardSlotRepository.findById(id)?.slot_status === "RESERVED");
  assert(reserved.length === 1, "仅一个争抢箱位被预留");

  console.info(`\n冒烟测试全部通过（${passed} 条断言）`);
};

const expectFailSync = (code: string, fn: () => unknown, message: string) => {
  try {
    fn();
  } catch (err) {
    if (!(err instanceof AppError) || err.code !== code) throw err;
    assert(true, message);
    return;
  }
  throw new Error(`断言失败：${message}（未拒绝）`);
};

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
