export const PAGE_SIZE = 10;
export const CHILD_PAGE_SIZE = 10;
export const MAX_VISIBLE_PAGES = 5;

export function getPageNumbers(current: number, total: number): number[] {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + MAX_VISIBLE_PAGES - 1);
  if (end - start < MAX_VISIBLE_PAGES - 1) {
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
