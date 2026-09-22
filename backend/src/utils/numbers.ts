/** 种子数据里长度/吃水是字符串，统一宽松解析，无法解析时返回 NaN 由调用方拒绝 */
export const toMetres = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
  if (value === null || value === undefined) return NaN;
  const matched = String(value).match(/-?\d+(\.\d+)?/);
  return matched ? Number(matched[0]) : NaN;
};

export const toId = (value: unknown): number => {
  const id = Number(value);
  return Number.isInteger(id) ? id : NaN;
};
