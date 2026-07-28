import { useState, useMemo } from 'react';
import { useFinancial } from '@context/FinancialContext';
import { Payment } from '@t/financial.types';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import { useTableControls } from '@hooks/useTableControls';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import { PaymentAndDepositModal } from '@components/modals/PaymentAndDepositModal';
import PlusIcon from '@assets/plusIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import MoneyIcon from '@assets/moneyIcon.svg?react';
import DollarIcon from '@assets/dollarIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

function getPaymentMethodBadge(method: string) {
  const map: Record<string, string> = {
    EFECTIVO: 'bg-success/10 text-success',
    VISA: 'bg-primary/10 text-primary',
    YAPE: 'bg-purple-500/10 text-purple-600',
    PLIN: 'bg-teal/10 text-teal',
    TRANSFERENCIA: 'bg-amber/10 text-amber',
    OTRO: 'bg-slate-100 text-slate',
  };
  return map[method] || 'bg-slate-100 text-slate';
}

function Payments() {
  const { paymentsData } = useFinancial();
  const [modalType, setModalType] = useState<'ENTRADA' | 'SALIDA' | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Payment | null>(null);

  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  const preFiltered = useMemo(() => {
    return paymentMethodFilter
      ? paymentsData.filter((p) => p.paymentMethod === paymentMethodFilter)
      : paymentsData;
  }, [paymentsData, paymentMethodFilter]);

  const controls = useTableControls(preFiltered, {
    itemsPerPage: 10,
    searchFields: ['description', 'docRef', 'paymentMethod'],
    dateField: 'date',
  });

  const stats = useMemo(() => {
    const totalIncome = paymentsData.reduce((sum, p) => sum + (parseFloat(p.income || '0') || 0), 0);
    const totalExpense = paymentsData.reduce((sum, p) => sum + (parseFloat(p.expense || '0') || 0), 0);
    const balance = totalIncome - totalExpense;
    return { total: paymentsData.length, totalIncome, totalExpense, balance };
  }, [paymentsData]);

  const hasActiveFilters = controls.searchText.trim() !== '' || controls.dateFrom !== '' || controls.dateTo !== '' || paymentMethodFilter !== '';

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
    setPaymentMethodFilter('');
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Finanzas</span>
          <h1 className="text-2xl font-bold font-display text-ink">Caja</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModalType('ENTRADA')} className="bg-success text-white py-2.5 px-4 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-success/25 text-sm">
            <PlusIcon className="w-4 h-4" /> + Entrada
          </button>
          <button onClick={() => setModalType('SALIDA')} className="bg-danger text-white py-2.5 px-4 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-danger/25 text-sm">
            <PlusIcon className="w-4 h-4" /> - Salida
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={MoneyIcon} value={stats.total} label="Total movimientos" color="#3B82F6" />
        <StatsCard icon={DollarIcon} value={stats.totalIncome} label="Ingresos" color="#059669" />
        <StatsCard icon={DollarIcon} value={stats.totalExpense} label="Egresos" color="#DC2626" />
        <StatsCard icon={MoneyIcon} value={stats.balance} label="Balance neto" color={stats.balance >= 0 ? '#059669' : '#DC2626'} />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3"><SearchIcon className="w-4 h-4 text-slate" /></div>
              <input type="text" placeholder="Buscar por descripción..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
              {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
            </div>
            <input type="date" value={controls.dateFrom} onChange={(e) => controls.setDateFrom(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha desde" />
            <input type="date" value={controls.dateTo} onChange={(e) => controls.setDateTo(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha hasta" />
            <select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)} className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30">
              <option value="">Medio de pago</option>
              {['EFECTIVO', 'VISA', 'YAPE', 'PLIN', 'TRANSFERENCIA', 'OTRO'].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            {hasActiveFilters && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap"><EraserIcon className="w-4 h-4" />Limpiar filtros</button>}
          </div>
        </div>

        {controls.totalFiltered === 0 ? (
          hasActiveFilters ? <EmptyState icon={SearchIcon} title="Sin resultados" description="No se encontraron movimientos con estos filtros." actionLabel="Limpiar filtros" onAction={resetFilters} />
          : <EmptyState icon={MoneyIcon} title="Sin movimientos" description="Registra tu primer ingreso o egreso de caja." actionLabel="Registrar entrada" onAction={() => setModalType('ENTRADA')} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">ID</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Fecha</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Descripción</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Medio</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">Entrada</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">Salida</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Doc. Ref.</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Tipo</th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((payment: Payment) => (
                    <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate font-mono">{payment.id.slice(0, 8)}</td>
                      <td className="py-3 px-3 text-sm text-slate whitespace-nowrap">{payment.date}</td>
                      <td className="py-3 px-3 text-sm text-ink truncate max-w-[180px]" title={payment.description}>{payment.description}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodBadge(payment.paymentMethod)}`}>{payment.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-sm text-success font-mono font-medium">{payment.income ? `S/ ${parseFloat(payment.income).toFixed(2)}` : '—'}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-sm text-danger font-mono font-medium">{payment.expense ? `S/ ${parseFloat(payment.expense).toFixed(2)}` : '—'}</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate">{payment.docRef || '—'}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate">{payment.movementType}</span>
                      </td>
                      <td className="py-3 pr-4 pl-2">
                        <RowActionMenu items={[{ label: 'Eliminar', icon: TrashIcon, danger: true, onClick: () => setConfirmTarget(payment) }]} />
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

      {modalType && <PaymentAndDepositModal onClose={() => setModalType(null)} typeOfOperation={modalType} />}
      {confirmTarget && <ConfirmActionModal elementData={confirmTarget} onClose={() => setConfirmTarget(null)} typeOfOperation="payments" />}
    </section>
  );
}

export { Payments };
