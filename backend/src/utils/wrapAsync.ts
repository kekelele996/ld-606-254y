import type { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../errors/AppError";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => unknown;

/**
 * 控制器层异常包装：service 抛出的业务异常在控制器补充动作上下文后继续上抛，
 * 未知异常原样交给全局 errorHandlerMiddleware 返回 500，禁止只在一个位置吞掉。
 */
export const wrapAsync = (action: string, handler: AsyncHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((err: unknown) => {
      if (err instanceof AppError) {
        next(new AppError(err.code, err.status, `[${action}] ${err.message}`));
        return;
      }
      next(err);
    });
  };
};
