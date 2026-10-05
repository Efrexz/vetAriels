import { useMemo } from 'react';
import { useTableControls } from '@hooks/useTableControls';
import { useInvoicesQuery } from '@hooks/useInvoicesQuery';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { StatsCard } from '@components/ui/StatsCard';
import SearchIcon from '@assets/searchIcon.svg?react';
import FileInvoiceIcon from '@assets/file-invoice.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

interface Invoice {
  id: string;
  date: string;
  comprobante: string;
  client: string;
  amount: number;
  payment: string;
  status: 'PAGADO' | 'PENDIENTE' | 'ANULADO';
}

type InvoiceForTable = Omit<Invoice, 'date'> & { date: string; status: 'PAGADO' | 'PENDIENTE' | 'ANULADO' };

const INVOICES_MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatDateShort(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return iso;
  return `${Number(match[3])} ${INVOICES_MONTHS[Number(match[2]) - 1]} ${match[1]}`;
}

function getStatusBadge(status: string) {
  if (status === 'PAGADO') return 'bg-success/10 text-success';
  if (status === 'PENDIENTE') return 'bg-amber/10 text-amber';
  return 'bg-danger/10 text-danger';
}

function Invoices() {
  const { data: invoicesData = [], isLoading } = useInvoicesQuery();

  // UiInvoice -> fila de tabla. date() es created_at ISO; se muestra
  // 'dd mmm yyyy' con el util para evitar formato crudo de DB.
  const tableData = useMemo((): InvoiceForTable[] =>
    invoicesData.map((inv) => ({
      id: inv.id,
      comprobante: inv.comprobante,
      client: inv.client,
      amount: inv.amount,
      payment: inv.paidWith || '—',
      date: formatDateShort(inv.date),
      status: inv.status === 'ANULADA' ? 'ANULADO' : inv.status,
    })),
  [invoicesData]);

  const controls = useTableControls(tableData, { itemsPerPage: 10, searchFields: ['client', 'comprobante'], dateField: 'date' });

  const stats = useMemo(() => {
    const total = invoicesData.length;
    const paid = invoicesData.filter((i) => i.status === 'PAGADO').length;
    const totalAmount = invoicesData.reduce((s, i) => s + i.amount, 0);
    return { total, paid, totalAmount };
  }, [invoicesData]);

  const hasActiveFilters = controls.searchText.trim() !== '' || controls.dateFrom !== '' || controls.dateTo !== '';

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
  }

  return (
    <>
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Facturación</span>
        <h1 className="text-2xl font-bold font-display text-ink">Comprobantes</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={FileInvoiceIcon} value={stats.total} label="Total comprobantes" color="#3B82F6" />
        <StatsCard icon={CheckIcon} value={stats.paid} label="Pagados" color="#059669" />
        <StatsCard icon={FileInvoiceIcon} value={stats.totalAmount} label="Monto total (S/)" color="#D97706" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3"><SearchIcon className="w-4 h-4 text-slate" /></div>
              <input type="text" placeholder="Buscar por cliente o comprobante..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
              {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
            </div>
            <input type="date" value={controls.dateFrom} onChange={(e) => controls.setDateFrom(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha desde" />
            <input type="date" value={controls.dateTo} onChange={(e) => controls.setDateTo(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha hasta" />
            {hasActiveFilters && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap"><EraserIcon className="w-4 h-4" />Limpiar filtros</button>}
          </div>
        </div>

        {isLoading ? (
            <div className="py-10 text-center text-slate text-sm">Cargando comprobantes...</div>
          ) :
        controls.totalFiltered === 0 ? (
          hasActiveFilters ? <EmptyState icon={SearchIcon} title="Sin resultados" description="No se encontraron comprobantes con estos filtros." actionLabel="Limpiar filtros" onAction={resetFilters} />
          : <EmptyState icon={FileInvoiceIcon} title="Sin comprobantes" description="No hay comprobantes emitidos." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Fecha</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Comprobante</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Cliente</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">Monto</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Forma de pago</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((invoice: InvoiceForTable) => (
                    <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate whitespace-nowrap">{invoice.date}</td>
                      <td className="py-3 px-3 text-sm text-ink font-medium truncate max-w-[240px]" title={invoice.comprobante}>{invoice.comprobante}</td>
                      <td className="py-3 px-3 text-sm text-slate">{invoice.client}</td>
                      <td className="py-3 px-3 text-right text-sm text-ink font-mono font-semibold">S/ {invoice.amount.toFixed(2)}</td>
                      <td className="py-3 px-3 text-center text-sm text-slate">{invoice.payment}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>{invoice.status}</span>
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
    </>
  );
}

export { Invoices };
