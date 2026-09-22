import type { Request, Response } from "express";
import { berthPlanService } from "../services/BerthPlanService";
import { wrapAsync } from "../utils/wrapAsync";

const currentUserId = (req: Request): number => (req as unknown as { user?: { id?: number } }).user?.id ?? 1;

export const berthPlanController = {
  list: (_req: Request, res: Response) => res.json(berthPlanService.list()),

  /** 提交计划：保留记录，重叠时标为冲突，返回计划与全部冲突计划 */
  create: wrapAsync("BerthPlan.submit", (req, res) => {
    const result = berthPlanService.create(req.body, currentUserId(req));
    res.status(201).json(result);
  }),

  submit: wrapAsync("BerthPlan.submit", (req, res) => {
    const result = berthPlanService.submit(req.body, currentUserId(req));
    res.status(201).json(result);
  }),

  /** 审批：请求体指定空箱位，通过后计划与箱位预留同时生效 */
  approve: wrapAsync("BerthPlan.approve", async (req, res) => {
    const result = await berthPlanService.approve(req.params.id, req.body);
    res.json(result);
  }),

  /** 单条计划的实时冲突清单 */
  conflicts: wrapAsync("BerthPlan.conflicts", (req, res) => {
    res.json(berthPlanService.conflictsOf(berthPlanService.getById(req.params.id)));
  })
};
