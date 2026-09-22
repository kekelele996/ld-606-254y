/**
 * 统一请求封装：前端只请求 /api，禁止硬编码 localhost。
 * 携带演示用角色头 x-role（authMiddleware 读取），并把后端错误码抛出。
 */
export interface ApiError extends Error {
  code: string;
  status: number;
}

const ROLE_STORAGE_KEY = "port-yard.role";

export function getRole(): string {
  return localStorage.getItem(ROLE_STORAGE_KEY) ?? "dispatcher";
}

export function setRole(role: string): void {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "x-role": getRole(),
        ...(init.headers ?? {})
      }
    });
  } catch (networkError) {
    throw Object.assign(new Error("网络异常，请确认后端服务可用"), {
      code: "NETWORK_OFFLINE",
      status: 0
    }) as ApiError;
  }

  if (!res.ok) {
    let body: { code?: string; message?: string } = {};
    try {
      body = await res.json();
    } catch {
      // 非 JSON 错误响应时使用状态码兜底
    }
    throw Object.assign(new Error(body.message ?? `请求失败（HTTP ${res.status}）`), {
      code: body.code ?? `HTTP_${res.status}`,
      status: res.status
    }) as ApiError;
  }

  return (await res.json()) as T;
}
