import { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { Service } from '@t/inventory.types';
import { AddNewServiceModal } from '@components/modals/AddNewServiceModal';
import { DeleteModal } from '@components/modals/DeleteModal';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import PenIcon from '@assets/penIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import KitMedical from '@assets/kitMedical.svg?react';
import DollarIcon from '@assets/dollarIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import BanIcon from '@assets/banIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

const FILTER_OPTIONS = [
  {
    name: 'line',
    label: 'Línea...',
    options: [
      'ALIMENTOS',
      'FARMACIA',
      'LABORATORIO',
      'MEDICA',
      'PET SHOP',
      'SPA',
    ],
  },
  {
    name: 'category',
    label: 'Categorías...',
    options: ['Categoría 1', 'Categoría 2'],
  },
];

function Services() {
  const { servicesData } = useProductsAndServices();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>({
    line: '',
    category: '',
  });

  const preFiltered = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesLine = filters.line
        ? service.line === filters.line
        : true;
      const matchesCategory = filters.category
        ? service.category === filters.category
        : true;
      return matchesLine && matchesCategory;
    });
  }, [servicesData, filters]);

  const controls = useTableControls(preFiltered, {
    itemsPerPage: 10,
    searchFields: ['serviceName', 'line', 'category'],
    dateField: 'registrationDate',
  });

  const stats = useMemo(() => {
    const total = servicesData.length;
    const active = servicesData.filter((s) => s.status).length;
    const inactive = servicesData.filter((s) => !s.status).length;
    const avgPrice =
      total > 0
        ? Math.round(
            servicesData.reduce((sum, s) => sum + (s.salePrice || 0), 0) /
              total
          )
        : 0;
    return { total, active, inactive, avgPrice };
  }, [servicesData]);

  const hasActiveFilters =
    controls.searchText.trim() !== '' ||
    controls.dateFrom !== '' ||
    controls.dateTo !== '' ||
    filters.line !== '' ||
    filters.category !== '';

  function handleFilterChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
    setFilters({ line: '', category: '' });
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
            Cat&aacute;logo de servicios
          </span>
          <h1 className="text-2xl font-bold font-display text-ink">
            Servicios
          </h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo servicio
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard
          icon={KitMedical}
          value={stats.total}
          label="Total servicios"
          color="#3B82F6"
        />
        <StatsCard
          icon={CheckIcon}
          value={stats.active}
          label="Activos"
          color="#059669"
        />
        <StatsCard
          icon={BanIcon}
          value={stats.inactive}
          label="Inactivos"
          color="#DC2626"
        />
        <StatsCard
          icon={DollarIcon}
          value={stats.avgPrice}
          label="Precio promedio (S/)"
          color="#D97706"
        />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3 mb-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3">
                <SearchIcon className="w-4 h-4 text-slate" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o línea..."
                value={controls.searchText}
                onChange={(e) => controls.setSearchText(e.target.value)}
                className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70"
              />
              {controls.searchText && (
                <button
                  onClick={() => controls.setSearchText('')}
                  className="pr-3 text-slate/40 hover:text-slate transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M1 1L13 13M13 1L1 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
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
          </div>

          <div className="flex flex-wrap gap-3">
            {FILTER_OPTIONS.map((filter) => (
              <select
                key={filter.name}
                name={filter.name}
                value={filters[filter.name]}
                onChange={handleFilterChange}
                className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ))}

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

        {controls.totalFiltered === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              icon={SearchIcon}
              title="Sin resultados"
              description="No encontramos servicios que coincidan con tu b&uacute;squeda."
              actionLabel="Limpiar filtros"
              onAction={resetFilters}
            />
          ) : (
            <EmptyState
              icon={KitMedical}
              title="No hay servicios registrados"
              description="Agrega tu primer servicio al cat&aacute;logo."
              actionLabel="Nuevo servicio"
              onAction={() => setIsAddModalOpen(true)}
            />
          )
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Servicio
                    </th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                      L&iacute;nea
                    </th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                      Categor&iacute;a
                    </th>
                    <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">
                      Precio
                    </th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                      Estado
                    </th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((service: Service) => (
                    <tr
                      key={service.id}
                      className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={service.serviceName || service.id}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="text-sm text-ink font-medium truncate">
                              {service.serviceName}
                            </div>
                            <div className="text-xs text-slate font-mono">
                              {service.id.slice(0, 8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {service.line}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-sm text-ink font-mono tabular-nums font-medium">
                          S/ {service.salePrice?.toFixed(2) ?? '0.00'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            service.status
                              ? 'text-success'
                              : 'text-danger'
                          }`}
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              service.status
                                ? 'bg-success'
                                : 'bg-danger'
                            }`}
                          />
                          {service.status ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-2">
                        <RowActionMenu
                          items={[
                            {
                              label: 'Editar',
                              icon: PenIcon,
                              onClick: () =>
                                navigate(
                                  `/service/${service.id}/update`
                                ),
                            },
                            { divider: true },
                            {
                              label: 'Eliminar',
                              icon: TrashIcon,
                              danger: true,
                              onClick: () => setDeleteTarget(service),
                            },
                          ]}
                        />
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

      {isAddModalOpen && (
        <AddNewServiceModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {deleteTarget && (
        <DeleteModal
          onClose={() => setDeleteTarget(null)}
          elementToDelete={deleteTarget}
          mode="services"
        />
      )}
    </section>
  );
}

export { Services };
