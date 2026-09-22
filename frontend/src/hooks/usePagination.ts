import { signal, computed, type Signal } from "@angular/core";

/**
 * 极简分页 hook（基于 Angular signal），各列表页共用。
 */
export function usePagination<T>(source: T[] = [], pageSizeSignal?: Signal<number>) {
  const rows = signal(source);
  const page = signal(1);
  const pageSize = pageSizeSignal ?? signal(8);

  const pagedRows = computed(() => {
    const start = (page() - 1) * pageSize();
    return rows().slice(start, start + pageSize());
  });
  const totalPages = computed(() => Math.max(1, Math.ceil(rows().length / pageSize())));
  const total = computed(() => rows().length);

  return { rows, page, pageSize, pagedRows, totalPages, total };
}
