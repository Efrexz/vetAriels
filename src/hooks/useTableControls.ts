import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { isWithinRange } from '@utils/date';

interface UseTableControlsOptions {
  itemsPerPage?: number;
  searchFields?: string[];
  dateField?: string;
}

interface UseTableControlsReturn<T extends { id: string }> {
  searchText: string;
  setSearchText: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
  totalPages: number;
  paginatedData: T[];
  showingFrom: number;
  showingTo: number;
  totalFiltered: number;
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  isAllSelected: boolean;
  selectedCount: number;
}

/**
 * Lee un campo de un item. Soporta paths anidados con punto
 * ('petData.petName') para las colas, cuyo item guarda snapshot de la
 * mascota en una propiedad.
 */
function getField(item: unknown, field: string): unknown {
  const segments = field.split('.');
  let current: unknown = item;
  for (const segment of segments) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

export function useTableControls<T extends { id: string }>(
  data: T[],
  options: UseTableControlsOptions = {}
): UseTableControlsReturn<T> {
  const { itemsPerPage = 10, searchFields = [], dateField } = options;

  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(itemsPerPage);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedText(searchText);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText]);

  const filteredData = useMemo(() => {
    let result = data;

    if (debouncedText.trim() && searchFields.length > 0) {
      const lower = debouncedText.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = getField(item, field);
          // Strings y numeros (un hc "000105" matchea por includes);
          // undefined/null(gr) no matchean.
          if (typeof value === 'string') return value.toLowerCase().includes(lower);
          if (typeof value === 'number') return String(value).includes(lower);
          return false;
        })
      );
    }

    if (dateField && (dateFrom || dateTo)) {
      result = result.filter((item) => {
        const rawDate = getField(item, dateField);
        if (typeof rawDate !== 'string') return true;
        // isWithinRange compara por calendario LOCAL: ya no pierde el
        // dia exacto por el shift UTC (era un bug en Lima UTC-5).
        return isWithinRange(rawDate, dateFrom, dateTo);
      });
    }

    return result;
  }, [data, debouncedText, searchFields, dateField, dateFrom, dateTo]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedText, dateFrom, dateTo, perPage]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const existingIds = new Set(data.map((item) => item.id));
      const prevIds = Array.from(prev);
      let changed = false;
      prevIds.forEach((id) => {
        if (!existingIds.has(id)) changed = true;
      });
      if (!changed) return prev;
      const next = new Set(prev);
      prevIds.forEach((id) => {
        if (!existingIds.has(id)) next.delete(id);
      });
      return next;
    });
  }, [data]);

  const totalFiltered = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, safePage, perPage]);

  const showingFrom = totalFiltered === 0 ? 0 : (safePage - 1) * perPage + 1;
  const showingTo = Math.min(safePage * perPage, totalFiltered);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const pageIds = paginatedData.map((item) => item.id);
      const allSelected = pageIds.length > 0 && pageIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [paginatedData]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((item) => selectedIds.has(item.id));

  const selectedCount = selectedIds.size;

  const setItemsPerPage = useCallback((n: number) => {
    setPerPage(n);
  }, []);

  return {
    searchText,
    setSearchText,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    currentPage: safePage,
    setCurrentPage,
    itemsPerPage: perPage,
    setItemsPerPage,
    totalPages,
    paginatedData,
    showingFrom,
    showingTo,
    totalFiltered,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    isAllSelected,
    selectedCount,
  };
}
