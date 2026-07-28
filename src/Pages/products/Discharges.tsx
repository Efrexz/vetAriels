import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { InventoryOperation } from '@t/inventory.types';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import DocumentOutIcon from '@assets/documentOutIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import EyeIcon from '@assets/eyeIcon.svg?react';
import BoxesIcon from '@assets/boxesIcon.svg?react';
import CalendarIcon from '@assets/calendarIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

function formatDate(dateStr: string, timeStr: string): string {
  return `${dateStr} ${timeStr}`;
}

function Discharges() {
  const { dischargesData } = useProductsAndServices();
  const navigate = useNavigate();

  const controls = useTableControls(dischargesData, {
    itemsPerPage: 10,
    searchFields: ['reason', 'responsible', 'registeredBy'],
    dateField: 'date',
  });

  const stats = useMemo(() => {
    const total = dischargesData.length;
    const totalItems = dischargesData.reduce(
      (sum, op) => sum + (op.products?.length || 0),
      0
    );
    const now = new Date();
    const thisMonth = dischargesData.filter((op) => {
      const d = new Date(op.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length;
    return { total, totalItems, thisMonth };
  }, [dischargesData]);

  const hasActiveFilters =
    controls.searchText.trim() !== '' ||
    controls.dateFrom !== '' ||
    controls.dateTo !== '';

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DocumentOutIcon className="w-7 h-7 text-rose-500" />
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
              Inventario
            </span>
            <h1 className="text-2xl font-bold font-display text-ink">
              Descargas de stock
            </h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/discharges/create')}
          className="bg-rose-500 text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-rose-500/25 whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Descargar stock
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard
          icon={DocumentOutIcon}
          value={stats.total}
          label="Total descargas"
          color="#E11D48"
        />
        <StatsCard
          icon={BoxesIcon}
          value={stats.totalItems}
          label="Items descargados"
          color="#3B82F6"
        />
        <StatsCard
          icon={CalendarIcon}
          value={stats.thisMonth}
          label="Este mes"
          color="#D97706"
        />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3">
                <SearchIcon className="w-4 h-4 text-slate" />
              </div>
              <input
                type="text"
                placeholder="Buscar por razón o responsable..."
                value={controls.searchText}
                onChange={(e) => controls.setSearchText(e.target.value)}
                className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70"
              />
              {controls.searchText && (
                <button
                  onClick={() => controls.setSearchText('')}
                  className="pr-3 text-slate/40 hover:text-slate transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            <input
              type="date"
              value={controls.dateFrom}
              onChange={(e) => controls.setDateFrom(e.target.value)}
              className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              title="Fecha desde"
            />
            <input
              type="date"
              value={controls.dateTo}
              onChange={(e) => controls.setDateTo(e.target.value)}
              className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              title="Fecha hasta"
            />

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap"
              >
                <EraserIcon className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {controls.totalFiltered === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              icon={SearchIcon}
              title="Sin resultados"
              description="No encontramos descargas que coincidan con tu b&uacute;squeda."
              actionLabel="Limpiar filtros"
              onAction={resetFilters}
            />
          ) : (
            <EmptyState
              icon={DocumentOutIcon}
              title="No hay descargas registradas"
              description="Registra tu primera descarga de stock."
              actionLabel="Descargar stock"
              onAction={() => navigate('/discharges/create')}
            />
          )
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      N°
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Fecha de creaci&oacute;n
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Raz&oacute;n
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Responsable
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Registrado por
                    </th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map(
                    (op: InventoryOperation, idx: number) => {
                      const rowIndex =
                        (controls.currentPage - 1) *
                          controls.itemsPerPage +
                        idx +
                        1;
                      return (
                        <tr
                          key={op.id}
                          className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-slate font-mono">
                            {rowIndex.toString().padStart(4, '0')}
                          </td>
                          <td className="py-3 px-3 text-sm text-slate whitespace-nowrap">
                            {formatDate(op.date, op.time)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className="block text-sm text-ink truncate max-w-[220px]"
                              title={op.reason}
                            >
                              {op.reason}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Avatar name={op.responsible} size="sm" />
                              <span className="text-sm text-slate">
                                {op.responsible}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Avatar name={op.registeredBy} size="sm" />
                              <span className="text-sm text-slate">
                                {op.registeredBy}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 pl-2">
                            <RowActionMenu
                              items={[
                                {
                                  label: 'Ver detalle',
                                  icon: EyeIcon,
                                  onClick: () =>
                                    navigate(
                                      `/discharges/discharge/${op.id}/detail`
                                    ),
                                },
                              ]}
                            />
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 pb-4">
              <Pagination
                currentPage={controls.currentPage}
                totalPages={controls.totalPages}
                onPageChange={controls.setCurrentPage}
                itemsPerPage={controls.itemsPerPage}
                onItemsPerPageChange={controls.setItemsPerPage}
                showingFrom={controls.showingFrom}
                showingTo={controls.showingTo}
                totalItems={controls.totalFiltered}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export { Discharges };
