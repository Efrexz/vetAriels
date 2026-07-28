import { useMemo } from 'react';
import { useTableControls } from '@hooks/useTableControls';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { StatsCard } from '@components/ui/StatsCard';
import SearchIcon from '@assets/searchIcon.svg?react';
import DocumentIcon from '@assets/documentIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

interface Receipt {
  date: string;
  comprobante: string;
  concept: string;
  pet: string;
  price: string;
  quantity: string;
  total: string;
  status: 'PAGADO' | 'PENDIENTE' | 'ANULADO';
}

const receipts: (Receipt & { id: string })[] = [
  { id: '1', date: '29-07-2024 07:33 PM', comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560', concept: 'CONSULTA', pet: 'FRAC', price: '10.00', quantity: '1', total: '10.00', status: 'PAGADO' as const },
  { id: '2', date: '29-07-2024 07:33 PM', comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560', concept: 'CONSULTA', pet: 'FRAC', price: '10.00', quantity: '1', total: '10.00', status: 'PAGADO' as const },
  { id: '3', date: '29-07-2024 07:33 PM', comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560', concept: 'CONSULTA', pet: 'FRAC', price: '10.00', quantity: '1', total: '10.00', status: 'PAGADO' as const },
];

function getStatusBadge(status: string) {
  if (status === 'PAGADO') return 'bg-success/10 text-success';
  if (status === 'PENDIENTE') return 'bg-amber/10 text-amber';
  return 'bg-danger/10 text-danger';
}

function PurchaseHistory() {
  const controls = useTableControls(receipts, { itemsPerPage: 10, searchFields: ['concept', 'pet', 'comprobante'], dateField: 'date' });

  const stats = useMemo(() => {
    const total = receipts.length;
    const paid = receipts.filter((r) => r.status === 'PAGADO').length;
    const totalSpent = receipts.reduce((s, r) => s + parseFloat(r.total || '0'), 0);
    return { total, paid, totalSpent };
  }, []);

  const hasActiveFilters = controls.searchText.trim() !== '' || controls.dateFrom !== '' || controls.dateTo !== '';

  function resetFilters() { controls.setSearchText(''); controls.setDateFrom(''); controls.setDateTo(''); }

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={DocumentIcon} value={stats.total} label="Total compras" color="#3B82F6" />
        <StatsCard icon={CheckIcon} value={stats.paid} label="Pagadas" color="#059669" />
        <StatsCard icon={DocumentIcon} value={stats.totalSpent} label="Total gastado (S/)" color="#D97706" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3"><SearchIcon className="w-4 h-4 text-slate" /></div>
              <input type="text" placeholder="Buscar..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
              {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
            </div>
            <input type="date" value={controls.dateFrom} onChange={(e) => controls.setDateFrom(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha desde" />
            <input type="date" value={controls.dateTo} onChange={(e) => controls.setDateTo(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha hasta" />
            {hasActiveFilters && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap"><EraserIcon className="w-4 h-4" />Limpiar filtros</button>}
          </div>
        </div>

        {controls.totalFiltered === 0 ? (
          <EmptyState icon={DocumentIcon} title="Sin historial de compras" description="Este cliente aún no tiene compras registradas." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Fecha</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Comprobante</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Concepto</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Mascota</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">Precio</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Cant.</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">Total</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((receipt: Receipt & { id: string }) => (
                    <tr key={receipt.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate whitespace-nowrap">{receipt.date}</td>
                      <td className="py-3 px-3 text-sm text-ink font-medium truncate max-w-[220px]" title={receipt.comprobante}>{receipt.comprobante}</td>
                      <td className="py-3 px-3 text-center text-sm text-slate">{receipt.concept}</td>
                      <td className="py-3 px-3 text-sm text-slate">{receipt.pet}</td>
                      <td className="py-3 px-3 text-right text-sm text-ink font-mono">S/ {parseFloat(receipt.price).toFixed(2)}</td>
                      <td className="py-3 px-3 text-center text-sm text-slate">{receipt.quantity}</td>
                      <td className="py-3 px-3 text-right text-sm text-ink font-mono font-semibold">S/ {parseFloat(receipt.total).toFixed(2)}</td>
                      <td className="py-3 px-3 text-center"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(receipt.status)}`}>{receipt.status}</span></td>
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

export { PurchaseHistory };
