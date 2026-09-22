import type { RequestHandler } from "express";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

/**
 * 极简 RBAC：authMiddleware 把 x-role 注入 req.user.role。
 * 审批等写操作仅调度（dispatcher）与管理员（admin）可执行。
 */
export const rbacMiddleware =
  (roles: string[] = []): RequestHandler =>
  (req, res, next) => {
    if (roles.length === 0) return next();
    const role = (req as { user?: { role?: string } }).user?.role ?? "guest";
    if (!roles.includes(role)) {
      return res.status(403).json({
        code: ERROR_CODES.RBAC_DENIED,
        message: `${ERROR_MESSAGES.RBAC_DENIED}: role=${role}, required=${roles.join("|")}`
      });
    }
    next();
  };
