import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { Client } from '@t/client.types';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import SearchIcon from '@assets/searchIcon.svg?react';
import EyeIcon from '@assets/eyeIcon.svg?react';
import ShoppingCart from '@assets/shoppingCart.svg?react';
import DollarIcon from '@assets/dollarIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import BoxesIcon from '@assets/boxesIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

function calculateTotal(client: Client): number {
  return (
    client.products?.reduce(
      (sum, p) => sum + (p.salePrice || 0) * (p.quantity || 0),
      0
    ) || 0
  );
}

function ActiveOrders() {
  const { clients } = useClients();
  const navigate = useNavigate();

  const activeAccounts = useMemo(
    () => clients.filter((c) => c.products && c.products.length > 0),
    [clients]
  );

  const controls = useTableControls(activeAccounts, {
    itemsPerPage: 10,
    searchFields: ['firstName', 'lastName', 'phone1'],
  });

  const stats = useMemo(() => {
    const total = activeAccounts.length;
    const totalAmount = activeAccounts.reduce(
      (sum, c) => sum + calculateTotal(c),
      0
    );
    const totalItems = activeAccounts.reduce(
      (sum, c) => sum + (c.products?.length || 0),
      0
    );
    const avgTicket = total > 0 ? Math.round(totalAmount / total) : 0;
    return { total, totalAmount, totalItems, avgTicket };
  }, [activeAccounts]);

  const hasActiveFilters = controls.searchText.trim() !== '';

  return (
    <section className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-ink">Órdenes Activas</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={UserGroupIcon} value={stats.total} label="Cuentas activas" color="#3B82F6" />
        <StatsCard icon={DollarIcon} value={stats.totalAmount} label="Monto pendiente" color="#059669" />
        <StatsCard icon={BoxesIcon} value={stats.totalItems} label="Items en lista" color="#D97706" />
        <StatsCard icon={ShoppingCart} value={stats.avgTicket} label="Ticket promedio (S/)" color="#8B5CF6" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
            <div className="flex items-center justify-center bg-white pl-3"><SearchIcon className="w-4 h-4 text-slate" /></div>
            <input type="text" placeholder="Buscar por nombre o teléfono..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
            {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
          </div>
        </div>

        {controls.totalFiltered === 0 ? (
          <EmptyState icon={ShoppingCart} title="Sin órdenes activas" description="No hay cuentas con productos pendientes." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Cliente</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Último movimiento</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Items</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">Monto</th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((client: Client) => (
                    <tr key={client.id} onClick={() => navigate(`/sales/client/${client.id}`)} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors cursor-pointer">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${client.firstName} ${client.lastName}`} size="sm" />
                          <div>
                            <div className="text-sm text-ink font-medium">{client.firstName} {client.lastName}</div>
                            <div className="text-xs text-slate">{client.phone1}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate">{client.date} {client.hour}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{client.products?.length || 0}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-sm text-ink font-mono font-semibold">S/ {calculateTotal(client).toFixed(2)}</span>
                      </td>
                      <td className="py-3 pr-4 pl-2" onClick={(e) => e.stopPropagation()}>
                        <RowActionMenu items={[{ label: 'Ver detalle', icon: EyeIcon, onClick: () => navigate(`/sales/client/${client.id}`) }]} />
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

export { ActiveOrders };
