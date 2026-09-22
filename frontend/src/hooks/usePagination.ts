import { signal, computed } from "@angular/core";

/** 通用分页 hook：基于 signal 的页码与页大小切片。 */
export function usePagination<T>(rowsSource: () => T[], pageSize = 8) {
  const page = signal(1);
  const size = signal(pageSize);
  const total = computed(() => rowsSource().length);
  const pageCount = computed(() => Math.max(1, Math.ceil(total() / size())));
  const pagedRows = computed(() => {
    const start = (page() - 1) * size();
    return rowsSource().slice(start, start + size());
  });

  return {
    page,
    pageCount,
    total,
    pagedRows,
    next: () => page.update((value) => Math.min(value + 1, pageCount())),
    prev: () => page.update((value) => Math.max(value - 1, 1))
  };
}
