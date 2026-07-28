import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { DeleteModal } from '@components/modals/DeleteModal';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { Client } from '@t/client.types';
import PlusIcon from '@assets/plusIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';
import NewUserIcon from '@assets/newUserIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

const MONTHS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function parseClientDate(dateStr: string): Date | null {
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  const parts = dateStr.split(/[-\/]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

function formatDateShort(dateStr: string): string {
  const parsed = parseClientDate(dateStr);
  if (parsed) {
    return `${parsed.getDate()} ${MONTHS_ES[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }
  return dateStr;
}

function getClientName(client: Client): string {
  return `${client.firstName} ${client.lastName}`.trim();
}

function Clients() {
  const { clients, removeClient } = useClients();
  const navigate = useNavigate();

  const [quickFilter, setQuickFilter] = useState('todos');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const preFiltered = useMemo(() => {
    if (quickFilter === 'todos') return clients;
    if (quickFilter === 'sinEmail') return clients.filter((c) => !c.email);
    if (quickFilter === 'sinTelefono') return clients.filter((c) => !c.phone1);
    if (quickFilter === 'sinDireccion') return clients.filter((c) => !c.address);
    if (quickFilter === 'nuevosMes') {
      const now = new Date();
      const cm = now.getMonth();
      const cy = now.getFullYear();
      return clients.filter((c) => {
        const d = parseClientDate(c.date);
        return d && d.getMonth() === cm && d.getFullYear() === cy;
      });
    }
    return clients;
  }, [clients, quickFilter]);

  const controls = useTableControls(preFiltered, {
    itemsPerPage: 10,
    searchFields: ['firstName', 'lastName', 'email', 'phone1', 'dni', 'address'],
    dateField: 'date',
  });

  const stats = useMemo(() => {
    const now = new Date();
    const cm = now.getMonth();
    const cy = now.getFullYear();

    const newThisMonth = clients.filter((c) => {
      const d = parseClientDate(c.date);
      return d && d.getMonth() === cm && d.getFullYear() === cy;
    }).length;

    const totalPets = clients.reduce((sum, c) => sum + (c.pets?.length || 0), 0);

    const withCompleteData = clients.filter(
      (c) => c.email && c.phone1 && c.address
    ).length;

    return {
      total: clients.length,
      newThisMonth,
      totalPets,
      withCompleteData,
    };
  }, [clients]);

  const hasActiveFilters =
    controls.searchText.trim() !== '' ||
    controls.dateFrom !== '' ||
    controls.dateTo !== '' ||
    quickFilter !== 'todos';

  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-row-menu]')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  function handleBulkDelete() {
    controls.selectedIds.forEach((id: string) => removeClient(id));
    controls.clearSelection();
    setShowBulkConfirm(false);
  }

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
    setQuickFilter('todos');
  }

  const statCards = [
    {
      icon: UserGroupIcon,
      value: stats.total,
      label: 'Total clientes',
      color: '#3B82F6',
    },
    {
      icon: NewUserIcon,
      value: stats.newThisMonth,
      label: 'Nuevos este mes',
      color: '#059669',
    },
    {
      icon: PawIcon,
      value: stats.totalPets,
      label: 'Total mascotas',
      color: '#0D9488',
    },
    {
      icon: CheckIcon,
      value: stats.withCompleteData,
      label: 'Datos completos',
      color: '#D97706',
    },
  ];

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
            Gesti&oacute;n de clientes
          </span>
          <h1 className="text-2xl font-bold font-display text-ink">Clientes</h1>
        </div>
        <button
          onClick={() => navigate('/clients/create')}
          className="bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo cliente
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-paper rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.color + '1A' }}
              >
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </span>
              <p className="text-2xl sm:text-3xl font-bold font-display text-ink mt-3 leading-none">
                {card.value}
              </p>
              <p className="text-xs text-slate mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3">
                <SearchIcon className="w-4 h-4 text-slate" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, tel&eacute;fono o email..."
                value={controls.searchText}
                onChange={(e) => controls.setSearchText(e.target.value)}
                className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70"
              />
              {controls.searchText && (
                <button
                  onClick={() => controls.setSearchText('')}
                  className="pr-3 text-slate/40 hover:text-slate transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            <input
              type="date"
              value={controls.dateFrom}
              onChange={(e) => controls.setDateFrom(e.target.value)}
              className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              title="Fecha desde"
            />
            <input
              type="date"
              value={controls.dateTo}
              onChange={(e) => controls.setDateTo(e.target.value)}
              className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              title="Fecha hasta"
            />

            <select
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            >
              <option value="todos">Todos los clientes</option>
              <option value="sinEmail">Sin correo electr&oacute;nico</option>
              <option value="sinTelefono">Sin tel&eacute;fono</option>
              <option value="sinDireccion">Sin direcci&oacute;n</option>
              <option value="nuevosMes">Nuevos este mes</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap"
              >
                <EraserIcon className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {controls.selectedCount > 0 && (
          <div className="flex items-center justify-between bg-primary/5 border-b border-primary/20 px-4 py-2.5">
            <span className="text-primary font-medium text-sm">
              {controls.selectedCount}{' '}
              {controls.selectedCount === 1
                ? 'cliente seleccionado'
                : 'clientes seleccionados'}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={controls.clearSelection}
                className="text-primary text-sm underline hover:no-underline"
              >
                Deseleccionar
              </button>
              <button
                onClick={() => setShowBulkConfirm(true)}
                className="bg-danger text-white text-xs font-semibold py-1.5 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                Eliminar seleccionados
              </button>
            </div>
          </div>
        )}

        {controls.totalFiltered === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              icon={SearchIcon}
              title="Sin resultados"
              description="No encontramos clientes que coincidan con tu b&uacute;squeda. Intenta con otros filtros."
              actionLabel="Limpiar filtros"
              onAction={resetFilters}
            />
          ) : (
            <EmptyState
              icon={UserGroupIcon}
              title="No hay clientes registrados"
              description="Crea tu primer cliente para comenzar a gestionar tu cl&iacute;nica veterinaria."
              actionLabel="Nuevo cliente"
              onAction={() => navigate('/clients/create')}
            />
          )
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 pl-4 pr-2 w-10">
                      <input
                        type="checkbox"
                        checked={controls.isAllSelected}
                        onChange={controls.toggleSelectAll}
                        className="form-checkbox h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Fecha
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Cliente
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Tel&eacute;fono
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Email
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Direcci&oacute;n
                    </th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                      Mascotas
                    </th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((client: Client) => (
                    <tr
                      key={client.id}
                      onClick={() =>
                        navigate(`/clients/client/${client.id}/update`)
                      }
                      className={`border-b border-slate-100 hover:bg-slate-50/60 transition-colors cursor-pointer ${
                        controls.selectedIds.has(client.id)
                          ? 'bg-primary/[0.04]'
                          : ''
                      }`}
                    >
                      <td
                        className="py-3 pl-4 pr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={controls.selectedIds.has(client.id)}
                          onChange={() => controls.toggleSelection(client.id)}
                          className="form-checkbox h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-sm text-ink">
                          {formatDateShort(client.date)}
                        </div>
                        <div className="text-xs text-slate">
                          {client.hour}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={getClientName(client)}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="text-sm text-ink font-medium truncate">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-xs text-slate">
                              DNI: {client.dni || '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-sm text-slate font-mono tabular-nums">
                          {client.phone1 || '—'}
                        </span>
                        {client.phone2 && (
                          <span className="block text-xs text-slate">
                            {client.phone2}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {client.email ? (
                          <div>
                            <div
                              className="text-sm text-ink truncate max-w-[180px]"
                              title={client.email}
                            >
                              {client.email}
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs text-success mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-success" />
                              Verificado
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-slate/40">—</div>
                            <span className="inline-flex items-center gap-1 text-xs text-amber mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                              Pendiente
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="block text-sm text-slate truncate max-w-[180px]"
                          title={client.address}
                        >
                          {client.address || '—'}
                        </span>
                      </td>
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            navigate(
                              `/clients/client/${client.id}/pets`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                          title={`${client.pets?.length || 0} mascota(s)`}
                        >
                          <PawIcon className="w-3 h-3" />
                          {client.pets?.length || 0}
                        </button>
                      </td>
                      <td
                        className="py-3 pr-4 pl-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative" data-row-menu>
                          <button
                            data-row-menu
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === client.id ? null : client.id
                              )
                            }
                            className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors"
                            aria-label={`Opciones de ${getClientName(client)}`}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="opacity-60"
                            >
                              <circle cx="8" cy="3" r="1.5" />
                              <circle cx="8" cy="8" r="1.5" />
                              <circle cx="8" cy="13" r="1.5" />
                            </svg>
                          </button>

                          {openMenuId === client.id && (
                            <div
                              data-row-menu
                              className="absolute right-0 mt-1 w-44 bg-paper border border-slate-200 rounded-xl shadow-lg py-1 z-20"
                            >
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  navigate(
                                    `/clients/client/${client.id}/update`
                                  );
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-slate hover:bg-slate-50 hover:text-ink transition-colors flex items-center gap-2.5"
                              >
                                <PenIcon className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  navigate(
                                    `/clients/client/${client.id}/pets`
                                  );
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-slate hover:bg-slate-50 hover:text-ink transition-colors flex items-center gap-2.5"
                              >
                                <PawIcon className="w-4 h-4" />
                                Ver mascotas
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setDeleteTarget(client);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/5 transition-colors flex items-center gap-2.5"
                              >
                                <TrashIcon className="w-4 h-4" />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 pb-4">
              <Pagination
                currentPage={controls.currentPage}
                totalPages={controls.totalPages}
                onPageChange={controls.setCurrentPage}
                itemsPerPage={controls.itemsPerPage}
                onItemsPerPageChange={controls.setItemsPerPage}
                showingFrom={controls.showingFrom}
                showingTo={controls.showingTo}
                totalItems={controls.totalFiltered}
              />
            </div>
          </>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal
          elementToDelete={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          mode="clients"
        />
      )}

      {showBulkConfirm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50">
          <div className="bg-paper rounded-2xl p-6 w-full max-w-md shadow-sm modal-appear mx-4 border border-slate-200">
            <div className="pb-3 mb-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold font-display text-ink">
                Eliminar {controls.selectedCount}{' '}
                {controls.selectedCount === 1 ? 'cliente' : 'clientes'}
              </h2>
            </div>

            <div className="bg-danger/10 border-l-2 border-danger text-danger p-4 mb-4 rounded-lg">
              <p>
                Esta acci&oacute;n no se puede deshacer. Se eliminar&aacute;n
                todos los clientes seleccionados junto con sus mascotas y datos
                asociados.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="px-4 py-2 bg-white text-slate rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-5 py-2 bg-danger text-white rounded-xl hover:opacity-90 transition-colors font-semibold font-display shadow-sm shadow-danger/25"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export { Clients };
