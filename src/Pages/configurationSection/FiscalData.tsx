import { useMemo } from 'react';
import { useTableControls } from '@hooks/useTableControls';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { StatsCard } from '@components/ui/StatsCard';
import SearchIcon from '@assets/searchIcon.svg?react';
import BuildingShieldIcon from '@assets/buildingShield.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

interface FiscalEntry {
  date: string;
  name: string;
  ruc: string;
  address: string;
  email: string;
  code: string;
  status: string;
}

const entries: (FiscalEntry & { id: string })[] = [
  { id: '1', date: '01-01-2024', name: 'VETERINARIA ARIEL\'S E.I.R.L', ruc: '10723141067', address: 'Av. Principal 456, Cusco', email: 'ariels@vet.com', code: '0001', status: 'Activo' },
];

function FiscalData() {
  const controls = useTableControls(entries, { itemsPerPage: 10, searchFields: ['name', 'ruc', 'email'], dateField: 'date' });

  const stats = useMemo(() => ({ total: entries.length }), []);

  const hasActiveFilters = controls.searchText.trim() !== '' || controls.dateFrom !== '' || controls.dateTo !== '';

  function resetFilters() { controls.setSearchText(''); controls.setDateFrom(''); controls.setDateTo(''); }

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Configuración</span>
        <h1 className="text-2xl font-bold font-display text-ink">Datos Fiscales</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={BuildingShieldIcon} value={stats.total} label="Entidades fiscales" color="#3B82F6" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3"><SearchIcon className="w-4 h-4 text-slate" /></div>
              <input type="text" placeholder="Buscar por nombre, RUC o correo..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
              {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
            </div>
            <input type="date" value={controls.dateFrom} onChange={(e) => controls.setDateFrom(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha desde" />
            <input type="date" value={controls.dateTo} onChange={(e) => controls.setDateTo(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha hasta" />
            {hasActiveFilters && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap"><EraserIcon className="w-4 h-4" />Limpiar filtros</button>}
          </div>
        </div>

        {controls.totalFiltered === 0 ? (
          <EmptyState icon={BuildingShieldIcon} title="Sin datos fiscales" description="No hay datos fiscales registrados." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Fecha</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Nombre / RUC</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Dirección</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Correo</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Código</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((entry: FiscalEntry & { id: string }) => (
                    <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate whitespace-nowrap">{entry.date}</td>
                      <td className="py-3 px-3">
                        <div className="text-sm text-ink font-medium">{entry.name}</div>
                        <div className="text-xs text-slate font-mono">RUC: {entry.ruc}</div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate truncate max-w-[180px]" title={entry.address}>{entry.address}</td>
                      <td className="py-3 px-3 text-sm text-slate">{entry.email}</td>
                      <td className="py-3 px-3 text-center text-sm text-ink font-mono">{entry.code}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${entry.status === 'Activo' ? 'text-success' : 'text-danger'}`}>
                          <span className={`inline-block w-2 h-2 rounded-full ${entry.status === 'Activo' ? 'bg-success' : 'bg-danger'}`} />
                          {entry.status}
                        </span>
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
    </section>
  );
}

export { FiscalData };
