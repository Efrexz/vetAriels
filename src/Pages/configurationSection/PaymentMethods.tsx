import { useMemo } from 'react';
import { useTableControls } from '@hooks/useTableControls';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { StatsCard } from '@components/ui/StatsCard';
import MoneyTransferIcon from '@assets/moneyTransferIcon.svg?react';

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
