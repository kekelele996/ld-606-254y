import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export type ServiceErrorCode = keyof typeof ERROR_CODES;

/** Service 层统一抛出的业务异常，由 controller 与全局错误处理器分别包装。 */
export class ServiceError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(code: ServiceErrorCode, status = 400, detail?: string) {
    super(detail ? `${ERROR_MESSAGES[code]}: ${detail}` : ERROR_MESSAGES[code]);
    this.name = "ServiceError";
    this.status = status;
    this.code = ERROR_CODES[code];
  }
}
