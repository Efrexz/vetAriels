import { useMemo } from 'react';
import { useTableControls } from '@hooks/useTableControls';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { StatsCard } from '@components/ui/StatsCard';
import SearchIcon from '@assets/searchIcon.svg?react';
import MoneyTransferIcon from '@assets/moneyTransferIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

interface PaymentMethod {
  name: string;
  paymentType: string;
  observations: string;
  state: string;
}

const methods: (PaymentMethod & { id: string })[] = [
  { id: '1', name: 'AMERICAN EXPRESS', paymentType: 'Tarjeta', observations: '—', state: 'Activo' },
];

function PaymentMethods() {
  const controls = useTableControls(methods, { itemsPerPage: 10, searchFields: ['name', 'paymentType'] });

  const stats = useMemo(() => ({ total: methods.length, active: methods.filter((m) => m.state === 'Activo').length }), []);

  const hasActiveFilters = controls.searchText.trim() !== '';

  function resetFilters() { controls.setSearchText(''); }

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Configuración</span>
        <h1 className="text-2xl font-bold font-display text-ink">Métodos de pago</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={MoneyTransferIcon} value={stats.total} label="Total métodos" color="#3B82F6" />
        <StatsCard icon={MoneyTransferIcon} value={stats.active} label="Activos" color="#059669" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
            <div className="flex items-center justify-center bg-white pl-3"><SearchIcon className="w-4 h-4 text-slate" /></div>
            <input type="text" placeholder="Buscar por nombre..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
            {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
          </div>
          {hasActiveFilters && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap mt-3"><EraserIcon className="w-4 h-4" />Limpiar filtros</button>}
        </div>

        {controls.totalFiltered === 0 ? (
          <EmptyState icon={MoneyTransferIcon} title="Sin métodos de pago" description="No hay métodos de pago configurados." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Nombre</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Tipo de pago</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Observaciones</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((method: PaymentMethod & { id: string }) => (
                    <tr key={method.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-sm text-ink font-medium">{method.name}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{method.paymentType}</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate">{method.observations}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${method.state === 'Activo' ? 'text-success' : 'text-danger'}`}>
                          <span className={`inline-block w-2 h-2 rounded-full ${method.state === 'Activo' ? 'bg-success' : 'bg-danger'}`} />
                          {method.state}
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

export { PaymentMethods };
