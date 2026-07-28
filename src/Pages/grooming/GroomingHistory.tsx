import { useState, useMemo } from 'react';
import { useClients } from '@context/ClientsContext';
import { GroomingQueueItem } from '@t/clinical.types';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import { UpdateStateModal } from '@components/modals/UpdateStateModal';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import BathIcon from '@assets/bathIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import EyeIcon from '@assets/eyeIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import ScissorsIcon from '@assets/scissorsIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

function getStateBadge(state: string): string {
  if (state === 'Pendiente') return 'bg-rose-500/10 text-rose-500';
  if (state.includes('atenci') || state.includes('Atenci')) return 'bg-amber/10 text-amber';
  if (state === 'Terminado') return 'bg-success/10 text-success';
  if (state === 'Entregado') return 'bg-primary/10 text-primary';
  return 'bg-slate-100 text-slate';
}

const STATE_OPTIONS = ['Pendiente', 'En atención', 'Terminado', 'Entregado'];

function GroomingHistory() {
  const { petsInQueueGroomingHistory } = useClients();

  const [confirmTarget, setConfirmTarget] = useState<GroomingQueueItem | null>(null);
  const [stateTarget, setStateTarget] = useState<GroomingQueueItem | null>(null);
  const [stateFilter, setStateFilter] = useState('');

  const preFiltered = useMemo(() => {
    return stateFilter
      ? petsInQueueGroomingHistory.filter((p) => (p.state as string) === stateFilter)
      : petsInQueueGroomingHistory;
  }, [petsInQueueGroomingHistory, stateFilter]);

  const controls = useTableControls(preFiltered, {
    itemsPerPage: 10,
    searchFields: ['ownerName', 'petData.petName'],
    dateField: 'dateOfAttention',
  });

  const stats = useMemo(() => {
    const total = petsInQueueGroomingHistory.length;
    const finished = petsInQueueGroomingHistory.filter((p) => p.state === 'Terminado').length;
    const delivered = petsInQueueGroomingHistory.filter((p) => p.state === 'Entregado').length;
    const pending = total - finished - delivered;
    return { total, finished, delivered, pending };
  }, [petsInQueueGroomingHistory]);

  const hasActiveFilters = controls.searchText.trim() !== '' || controls.dateFrom !== '' || controls.dateTo !== '' || stateFilter !== '';

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
    setStateFilter('');
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Peluquer&iacute;a</span>
        <h1 className="text-2xl font-bold font-display text-ink">Historial</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={BathIcon} value={stats.total} label="Total histórico" color="#3B82F6" />
        <StatsCard icon={ScissorsIcon} value={stats.finished} label="Terminados" color="#D97706" />
        <StatsCard icon={CheckIcon} value={stats.delivered} label="Entregados" color="#059669" />
        <StatsCard icon={BathIcon} value={stats.pending} label="Pendientes" color="#DC2626" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3"><SearchIcon className="w-4 h-4 text-slate" /></div>
              <input type="text" placeholder="Buscar por cliente o mascota..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
              {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
            </div>
            <input type="date" value={controls.dateFrom} onChange={(e) => controls.setDateFrom(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha desde" />
            <input type="date" value={controls.dateTo} onChange={(e) => controls.setDateTo(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha hasta" />
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30">
              <option value="">Estado</option>
              {STATE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {hasActiveFilters && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap"><EraserIcon className="w-4 h-4" />Limpiar filtros</button>}
          </div>
        </div>

        {controls.totalFiltered === 0 ? (
          hasActiveFilters ? <EmptyState icon={SearchIcon} title="Sin resultados" description="No encontramos registros que coincidan con tu búsqueda." actionLabel="Limpiar filtros" onAction={resetFilters} />
          : <EmptyState icon={BathIcon} title="Sin historial" description="No hay órdenes de peluquería en el historial." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Código</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Fecha</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Cliente</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Mascota</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Raza</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Servicios</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((item: GroomingQueueItem) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate font-mono">{item.systemCode?.slice(0, 8) || item.id.slice(0, 8)}</td>
                      <td className="py-3 px-3 text-sm text-slate whitespace-nowrap">{item.dateOfAttention} {item.timeOfAttention}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={item.ownerName} size="sm" />
                          <span className="text-sm text-slate">{item.ownerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={item.petData?.petName || ''} size="sm" />
                          <span className="text-sm text-ink font-medium">{item.petData?.petName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate">{item.petData?.breed}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {item.productsAndServices?.slice(0, 3).map((ps) => (
                            <span key={ps.provisionalId} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate">{ps.serviceName || ps.productName}</span>
                          ))}
                          {(item.productsAndServices?.length || 0) > 3 && <span className="text-xs text-slate/60">+{item.productsAndServices!.length - 3}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => setStateTarget(item)} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${getStateBadge(item.state)}`}>{item.state}</button>
                      </td>
                      <td className="py-3 pr-4 pl-2">
                        <RowActionMenu
                          items={[
                            { label: 'Devolver a cola', icon: ReturnIcon, onClick: () => setConfirmTarget(item) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 pb-4"><Pagination currentPage={controls.currentPage} totalPages={controls.totalPages} onPageChange={controls.setCurrentPage} itemsPerPage={controls.itemsPerPage} onItemsPerPageChange={controls.setItemsPerPage} showingFrom={controls.showingFrom} showingTo={controls.showingTo} totalItems={controls.totalFiltered} /></div>
          </>
        )}
      </div>

      {confirmTarget && <ConfirmActionModal elementData={confirmTarget} onClose={() => setConfirmTarget(null)} typeOfOperation="returnGrooming" />}
      {stateTarget && <UpdateStateModal mode="history" dataToUpdate={stateTarget} onClose={() => setStateTarget(null)} />}
    </section>
  );
}

export { GroomingHistory };
