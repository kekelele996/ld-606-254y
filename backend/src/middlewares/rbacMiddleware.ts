import type { RequestHandler } from "express";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

/**
 * RBAC：authMiddleware 已把 { id, role } 挂到 req.user。
 * 传入允许角色白名单（为空表示任意已认证用户），不在白名单内整次拒绝 403。
 */
export const rbacMiddleware =
  (roles: string[] = []): RequestHandler =>
  (req, res, next) => {
    const role = (req as unknown as { user?: { role?: string } }).user?.role ?? "guest";
    if (roles.length > 0 && !roles.includes(role)) {
      res.status(403).json({ code: ERROR_CODES.RBAC_DENIED, message: ERROR_MESSAGES.RBAC_DENIED });
      return;
    }
    next();
  };
