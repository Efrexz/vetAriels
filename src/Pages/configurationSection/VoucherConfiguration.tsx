import { useMemo } from 'react';
import { useTableControls } from '@hooks/useTableControls';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { StatsCard } from '@components/ui/StatsCard';
import SearchIcon from '@assets/searchIcon.svg?react';
import FileContractIcon from '@assets/fileContract.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

interface Voucher {
  date: string;
  company: string;
  voucherName: string;
  serialNumber: string;
  lastNumber: string;
  isDefault: boolean;
}

const vouchers: (Voucher & { id: string })[] = [
  { id: '1', date: '01-01-2024', company: 'VETERINARIA ARIEL\'S E.I.R.L', voucherName: 'BOLETA DE VENTA ELECTRÓNICA', serialNumber: 'BV01', lastNumber: '0003562', isDefault: true },
];

function VoucherConfiguration() {
  const controls = useTableControls(vouchers, { itemsPerPage: 10, searchFields: ['voucherName', 'company'], dateField: 'date' });

  const stats = useMemo(() => ({ total: vouchers.length }), []);

  const hasActiveFilters = controls.searchText.trim() !== '' || controls.dateFrom !== '' || controls.dateTo !== '';

  function resetFilters() { controls.setSearchText(''); controls.setDateFrom(''); controls.setDateTo(''); }

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Configuración</span>
        <h1 className="text-2xl font-bold font-display text-ink">Comprobantes</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={FileContractIcon} value={stats.total} label="Tipos configurados" color="#3B82F6" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3"><SearchIcon className="w-4 h-4 text-slate" /></div>
              <input type="text" placeholder="Buscar por nombre o empresa..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
              {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
            </div>
            <input type="date" value={controls.dateFrom} onChange={(e) => controls.setDateFrom(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha desde" />
            <input type="date" value={controls.dateTo} onChange={(e) => controls.setDateTo(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha hasta" />
            {hasActiveFilters && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap"><EraserIcon className="w-4 h-4" />Limpiar filtros</button>}
          </div>
        </div>

        {controls.totalFiltered === 0 ? (
          <EmptyState icon={FileContractIcon} title="Sin comprobantes" description="No hay comprobantes configurados." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Fecha</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Empresa</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Comprobante</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Serie</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Últ. Número</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Predeterminado</th>
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((v: Voucher & { id: string }) => (
                    <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate whitespace-nowrap">{v.date}</td>
                      <td className="py-3 px-3 text-sm text-ink font-medium truncate max-w-[200px]" title={v.company}>{v.company}</td>
                      <td className="py-3 px-3 text-sm text-slate">{v.voucherName}</td>
                      <td className="py-3 px-3 text-center text-sm text-ink font-mono font-semibold">{v.serialNumber}</td>
                      <td className="py-3 px-3 text-center text-sm text-slate font-mono">{v.lastNumber}</td>
                      <td className="py-3 px-3 text-center">
                        {v.isDefault ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">Sí</span>
                          : <span className="text-slate/40">—</span>}
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

export { VoucherConfiguration };
