import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (n: number) => void;
  showingFrom: number;
  showingTo: number;
  totalItems: number;
}

function getPageNumbers(
  current: number,
  total: number
): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 2)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [
    1,
    '...',
    current - 1,
    current,
    current + 1,
    '...',
    total,
  ];
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  showingFrom,
  showingTo,
  totalItems,
}: PaginationProps) {
  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
      <div className="flex items-center gap-3 text-sm text-slate">
        <span>
          Registros {showingFrom}&ndash;{showingTo} de {totalItems}
        </span>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-xs">por p&aacute;gina</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-slate-200 rounded-lg bg-paper text-sm py-1 px-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="py-1.5 px-2.5 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Primera p&aacute;gina"
        >
          &laquo;
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="py-1.5 px-2.5 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="P&aacute;gina anterior"
        >
          &lsaquo;
        </button>

        {pageNumbers.map((page, idx) =>
          page === '...' ? (
            <span
              key={`dots-${idx}`}
              className="py-1.5 px-1.5 text-sm text-slate/50 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-primary text-white shadow-sm shadow-primary/25'
                  : 'border border-slate-200 text-slate bg-paper hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="py-1.5 px-2.5 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="P&aacute;gina siguiente"
        >
          &rsaquo;
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="py-1.5 px-2.5 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="&Uacute;ltima p&aacute;gina"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}

export { Pagination };
