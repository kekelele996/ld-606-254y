/**
 * 内存仓储基类：种子数据就是本地数据库的运行时镜像。
 * mutate 提供串行临界区——Node 单线程下校验+写入的整体原子性靠它保证，
 * 重复或并发的审批请求只有一个能进入临界区，第二个会看到已变更的状态而失败。
 */
let approvalChain: Promise<unknown> = Promise.resolve();

export const runExclusive = async <T>(task: () => T | Promise<T>): Promise<T> => {
  const run = approvalChain.then(task, task);
  approvalChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
};

export class InMemoryRepository<T extends { id: number }> {
  constructor(private readonly rows: T[]) {}

  findAll(): T[] {
    return [...this.rows];
  }

  findById(id: number): T | undefined {
    return this.rows.find((row) => row.id === id);
  }

  insert(row: T): T {
    this.rows.push(row);
    return row;
  }

  nextId(): number {
    return this.rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
  }
}
