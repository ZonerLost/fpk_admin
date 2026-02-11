export type PageItem = number | "...";

type GetPageItemsInput = {
  page: number;
  totalPages: number;
  siblingCount?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getPageItems({
  page,
  totalPages,
  siblingCount = 1,
}: GetPageItemsInput): PageItem[] {
  if (totalPages <= 0) return [];

  const current = clamp(page, 1, totalPages);
  const left = clamp(current - siblingCount, 1, totalPages);
  const right = clamp(current + siblingCount, 1, totalPages);

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);

  for (let next = left; next <= right; next += 1) {
    pages.add(next);
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const result: PageItem[] = [];

  sortedPages.forEach((nextPage, index) => {
    if (index > 0) {
      const prevPage = sortedPages[index - 1];
      if (nextPage - prevPage === 2) {
        result.push(prevPage + 1);
      } else if (nextPage - prevPage > 2) {
        result.push("...");
      }
    }

    result.push(nextPage);
  });

  return result;
}

function arraysEqual(left: PageItem[], right: PageItem[]) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

function runPaginationChecks() {
  const checks: Array<{ input: GetPageItemsInput; expected: PageItem[] }> = [
    {
      input: { page: 1, totalPages: 1, siblingCount: 1 },
      expected: [1],
    },
    {
      input: { page: 1, totalPages: 7, siblingCount: 1 },
      expected: [1, 2, "...", 7],
    },
    {
      input: { page: 5, totalPages: 20, siblingCount: 1 },
      expected: [1, "...", 4, 5, 6, "...", 20],
    },
    {
      input: { page: 19, totalPages: 20, siblingCount: 1 },
      expected: [1, "...", 18, 19, 20],
    },
  ];

  checks.forEach(({ input, expected }) => {
    const result = getPageItems(input);
    if (!arraysEqual(result, expected)) {
      console.warn("Pagination check mismatch", { input, result, expected });
    }
  });
}

if (import.meta.env.DEV) {
  runPaginationChecks();
}

