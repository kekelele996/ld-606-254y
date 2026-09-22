import { seed, type SeedDatabase } from "../seed";
import type { Vessel } from "../models/Vessel";
import type { Berth } from "../models/Berth";
import type { BerthPlan } from "../models/BerthPlan";
import type { YardSlot } from "../models/YardSlot";
import type { WorkTask } from "../models/WorkTask";

/** 种子里的字面量状态需要放宽为模型类型，供运行期写入。 */
type MutableDatabase = Omit<SeedDatabase, "vessel" | "berth" | "berthPlan" | "yardSlot" | "workTask"> & {
  vessel: Vessel[];
  berth: Berth[];
  berthPlan: BerthPlan[];
  yardSlot: YardSlot[];
  workTask: WorkTask[];
};

/**
 * 运行期内存数据库：启动时从种子深拷贝一份，所有仓库共享同一份可变数据。
 * 这是本地演示数据源（禁止接入第三方 API），进程重启即回到种子状态。
 */
export const db: MutableDatabase = structuredClone(seed) as unknown as MutableDatabase;

/** 串行化写操作的互斥段，保证“计划状态 + 箱位预留”原子联动。 */
export function runInLock<T>(label: string, fn: () => T): T {
  if (locked.has(label)) {
    throw Object.assign(new Error(`concurrent write in progress: ${label}`), {
      status: 409,
      code: "CONCURRENT_UPDATE"
    });
  }
  locked.add(label);
  try {
    return fn();
  } finally {
    locked.delete(label);
  }
}

const locked = new Set<string>();

export function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
}
