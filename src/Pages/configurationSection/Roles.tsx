import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { Role } from '@t/user.types';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import PlusIcon from '@assets/plusIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';
import EditIcon from '@assets/editIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';

function Roles() {
  const { roles, removeRole } = useGlobal();
  const navigate = useNavigate();

  const controls = useTableControls(roles, { itemsPerPage: 10, searchFields: ['name'] });

  const stats = useMemo(() => {
    const total = roles.length;
    const active = roles.filter((r) => r.access === 'SI').length;
    return { total, active };
  }, [roles]);

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Configuración</span>
          <h1 className="text-2xl font-bold font-display text-ink">Roles</h1>
        </div>
        <button onClick={() => navigate('/config/roles/create')} className="bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap">
          <PlusIcon className="w-5 h-5" /> Nuevo rol
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={UserGroupIcon} value={stats.total} label="Total roles" color="#3B82F6" />
        <StatsCard icon={CheckIcon} value={stats.active} label="Roles activos" color="#059669" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {controls.totalFiltered === 0 ? (
          <EmptyState icon={UserGroupIcon} title="No hay roles" description="Crea el primer rol del sistema." actionLabel="Nuevo rol" onAction={() => navigate('/config/roles/create')} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Rol</th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((role: Role) => (
                    <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={role.name} size="sm" />
                          <div>
                            <div className="text-sm text-ink font-medium">{role.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 pl-2">
                        <RowActionMenu items={[
                          { label: 'Permisos', icon: KeyIcon, onClick: () => navigate(`/config/role/permissions/${role.name}`) },
                          { label: 'Editar', icon: EditIcon, onClick: () => {} },
                          { divider: true },
                          { label: 'Eliminar', icon: TrashIcon, danger: true, onClick: () => removeRole(role.id) },
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
    </section>
  );
}

export { Roles };
