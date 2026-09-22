import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export type ErrorCode = keyof typeof ERROR_CODES;

/** 业务异常：service 抛出，controller 与全局 errorHandler 分别包装，禁止在单一位置吞掉 */
export class AppError extends Error {
  status: number;
  code: ErrorCode;

  constructor(code: ErrorCode, status = 400, message?: string) {
    super(message ?? ERROR_MESSAGES[code]);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}
