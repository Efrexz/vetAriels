import { useMemo } from 'react';
import { useTableControls } from '@hooks/useTableControls';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { StatsCard } from '@components/ui/StatsCard';
import FileContractIcon from '@assets/fileContract.svg?react';

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
