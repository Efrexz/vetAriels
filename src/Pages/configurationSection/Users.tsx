import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import PlusIcon from '@assets/plusIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import BanIcon from '@assets/banIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

function Users() {
  const { users } = useGlobal();
  const navigate = useNavigate();
  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);

  const controls = useTableControls(users, { itemsPerPage: 10, searchFields: ['name', 'lastName', 'email'] });

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'ACTIVO').length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [users]);

  const hasActiveFilters = controls.searchText.trim() !== '';

  function resetFilters() { controls.setSearchText(''); }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Configuración</span>
          <h1 className="text-2xl font-bold font-display text-ink">Usuarios</h1>
        </div>
        <button onClick={() => navigate('/config/user-subsidiaries/create')} className="bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap">
          <PlusIcon className="w-5 h-5" /> Nuevo usuario
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={UserGroupIcon} value={stats.total} label="Total usuarios" color="#3B82F6" />
        <StatsCard icon={CheckIcon} value={stats.active} label="Activos" color="#059669" />
        <StatsCard icon={BanIcon} value={stats.inactive} label="Inactivos" color="#DC2626" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
            <div className="flex items-center justify-center bg-white pl-3"><KeyIcon className="w-4 h-4 text-slate" /></div>
            <input type="text" placeholder="Buscar por nombre o correo..." value={controls.searchText} onChange={(e) => controls.setSearchText(e.target.value)} className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70" />
            {controls.searchText && <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>}
          </div>
          {hasActiveFilters && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap mt-3"><EraserIcon className="w-4 h-4" />Limpiar filtros</button>}
        </div>

        {controls.totalFiltered === 0 ? (
          <EmptyState icon={UserGroupIcon} title="No hay usuarios" description="Crea el primer usuario del sistema." actionLabel="Nuevo usuario" onAction={() => navigate('/config/user-subsidiaries/create')} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Usuario</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Correo</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Rol</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((user: User) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${user.name} ${user.lastName}`} size="sm" />
                          <div>
                            <div className="text-sm text-ink font-medium">{user.name} {user.lastName}</div>
                            <div className="text-xs text-slate">{user.registrationDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate">{user.email}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{user.rol}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === 'ACTIVO' ? 'text-success' : 'text-danger'}`}>
                          <span className={`inline-block w-2 h-2 rounded-full ${user.status === 'ACTIVO' ? 'bg-success' : 'bg-danger'}`} />
                          {user.status === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-2">
                        <RowActionMenu items={[
                          { label: 'Editar', icon: KeyIcon, onClick: () => navigate(`/config/user-subsidiaries/edit/${user.id}`) },
                          { divider: true },
                          { label: 'Eliminar', icon: TrashIcon, danger: true, onClick: () => setConfirmTarget(user) },
                        ]} />
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

      {confirmTarget && <ConfirmActionModal elementData={confirmTarget} onClose={() => setConfirmTarget(null)} typeOfOperation="deleteUser" />}
    </section>
  );
}

export { Users };
