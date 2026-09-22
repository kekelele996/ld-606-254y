import type { Request, Response, NextFunction } from "express";
import { berthPlanService } from "../services/BerthPlanService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ServiceError } from "../utils/ServiceError";
import type { BerthPlanSubmitPayload, BerthPlanApprovePayload } from "../types/BerthPlanPayload";

/** Controller 层包装：服务层异常在此转为带错误码的响应，不交给全局处理器吞掉。 */
function handleError(res: Response, error: unknown): Response {
  if (error instanceof ServiceError) {
    return res.status(error.status).json({ code: error.code, message: error.message });
  }
  return res.status(500).json({
    code: ERROR_CODES.VALIDATION_FAILED,
    message: error instanceof Error ? error.message : "failed to process berth plan"
  });
}

export const berthPlanController = {
  list: (_req: Request, res: Response) => {
    try {
      res.json(berthPlanService.list());
    } catch (error) {
      handleError(res, error);
    }
  },

  /** 提交计划：201 返回保存结果（含全部冲突计划）。 */
  submit: (req: Request, res: Response) => {
    try {
      const result = berthPlanService.submit(req.body as BerthPlanSubmitPayload);
      res.status(201).json(result);
    } catch (error) {
      handleError(res, error);
    }
  },

  /** 泊位页查询某计划的冲突原因列表。 */
  conflicts: (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) throw new ServiceError("VALIDATION_FAILED", 400, "plan id");
      res.json(berthPlanService.describeConflicts(id));
    } catch (error) {
      next(error);
    }
  },

  /** 审批计划：通过后计划状态与箱位预留同时生效。 */
  approve: (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) throw new ServiceError("VALIDATION_FAILED", 400, "plan id");
      const result = berthPlanService.approve(id, req.body as BerthPlanApprovePayload);
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
};
