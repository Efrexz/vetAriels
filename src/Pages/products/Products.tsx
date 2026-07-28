import { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { Product } from '@t/inventory.types';
import { AddNewProductModal } from '@components/modals/AddNewProductModal';
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
import BoxesIcon from '@assets/boxesIcon.svg?react';
import DollarIcon from '@assets/dollarIcon.svg?react';
import AlertIcon from '@assets/alertIcon.svg?react';
import BanIcon from '@assets/banIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

const FILTER_OPTIONS = [
  {
    name: 'provider',
    label: 'Proveedor...',
    options: [
      'REPRESENTACIONES DURAND SAC',
      'Imagen Total SAC',
      'CENTRO',
    ],
  },
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
      'OTRA',
    ],
  },
  {
    name: 'category',
    label: 'Categorías...',
    options: ['Categoría 1', 'Categoría 2', 'OTRA'],
  },
  {
    name: 'stock',
    label: 'Stock...',
    options: ['Stock Agotado', 'Stock Bajo'],
  },
];

function getProductInitial(product: Product): string {
  const name = product.productName || product.systemCode;
  return name.charAt(0).toUpperCase();
}

function getStockBadge(product: Product) {
  const stock = product.availableStock ?? 0;
  if (stock === 0) {
    return {
      label: 'Agotado',
      className: 'bg-danger/10 text-danger',
    };
  }
  if (stock <= (product.minStock ?? 5)) {
    return {
      label: `${stock} (bajo)`,
      className: 'bg-amber/10 text-amber',
    };
  }
  return {
    label: `${stock}`,
    className: 'bg-success/10 text-success',
  };
}

function Products() {
  const { productsData } = useProductsAndServices();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>({
    provider: '',
    line: '',
    category: '',
    stock: '',
  });

  const preFiltered = useMemo(() => {
    return productsData.filter((product) => {
      const matchesProvider = filters.provider
        ? product.provider === filters.provider
        : true;
      const matchesLine = filters.line
        ? product.line === filters.line
        : true;
      const matchesCategory = filters.category
        ? product.category === filters.category
        : true;
      const matchesStock = filters.stock
        ? (filters.stock === 'Stock Agotado' &&
            (product.availableStock ?? 0) === 0) ||
          (filters.stock === 'Stock Bajo' &&
            (product.availableStock ?? 0) > 0 &&
            (product.availableStock ?? 0) <= (product.minStock ?? 5))
        : true;
      return matchesProvider && matchesLine && matchesCategory && matchesStock;
    });
  }, [productsData, filters]);

  const controls = useTableControls(preFiltered, {
    itemsPerPage: 10,
    searchFields: ['productName', 'systemCode', 'brand', 'provider'],
    dateField: 'registrationDate',
  });

  const stats = useMemo(() => {
    const total = productsData.length;
    const stockValue = productsData.reduce(
      (sum, p) => sum + (p.salePrice || 0) * (p.availableStock || 0),
      0
    );
    const lowStock = productsData.filter(
      (p) => (p.availableStock ?? 0) > 0 && (p.availableStock ?? 0) <= (p.minStock ?? 5)
    ).length;
    const outOfStock = productsData.filter(
      (p) => (p.availableStock ?? 0) === 0
    ).length;
    return { total, stockValue, lowStock, outOfStock };
  }, [productsData]);

  const hasActiveFilters =
    controls.searchText.trim() !== '' ||
    controls.dateFrom !== '' ||
    controls.dateTo !== '' ||
    filters.provider !== '' ||
    filters.line !== '' ||
    filters.category !== '' ||
    filters.stock !== '';

  function handleFilterChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
    setFilters({ provider: '', line: '', category: '', stock: '' });
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
            Inventario
          </span>
          <h1 className="text-2xl font-bold font-display text-ink">
            Productos
          </h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo producto
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard
          icon={BoxesIcon}
          value={stats.total}
          label="Total productos"
          color="#3B82F6"
        />
        <StatsCard
          icon={DollarIcon}
          value={stats.stockValue}
          label="Valor de stock"
          color="#059669"
        />
        <StatsCard
          icon={AlertIcon}
          value={stats.lowStock}
          label="Stock bajo"
          color="#D97706"
        />
        <StatsCard
          icon={BanIcon}
          value={stats.outOfStock}
          label="Agotados"
          color="#DC2626"
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
                placeholder="Buscar por nombre, c&oacute;digo o marca..."
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
              description="No encontramos productos que coincidan con tu b&uacute;squeda."
              actionLabel="Limpiar filtros"
              onAction={resetFilters}
            />
          ) : (
            <EmptyState
              icon={BoxesIcon}
              title="No hay productos registrados"
              description="Agrega tu primer producto al inventario."
              actionLabel="Nuevo producto"
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
                      Producto
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Marca
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                      Proveedor
                    </th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                      L&iacute;nea
                    </th>
                    <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">
                      Precio
                    </th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                      Stock
                    </th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                      Estado
                    </th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((product: Product) => {
                    const stockBadge = getStockBadge(product);
                    return (
                      <tr
                        key={product.systemCode || product.id}
                        className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={getProductInitial(product)}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <div className="text-sm text-ink font-medium truncate">
                                {product.productName}
                              </div>
                              <div className="text-xs text-slate font-mono">
                                {product.systemCode?.slice(0, 8).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-sm text-slate">
                          {product.brand || '—'}
                        </td>
                        <td className="py-3 px-3 text-sm text-slate max-w-[160px] truncate" title={product.provider}>
                          {product.provider || '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {product.line}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-sm text-ink font-mono tabular-nums font-medium">
                            S/ {product.salePrice?.toFixed(2) ?? '0.00'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockBadge.className}`}
                          >
                            {stockBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full ${
                              product.status ? 'bg-success' : 'bg-danger'
                            }`}
                            title={
                              product.status ? 'Activo' : 'Inactivo'
                            }
                          />
                        </td>
                        <td className="py-3 pr-4 pl-2">
                          <RowActionMenu
                            items={[
                              {
                                label: 'Editar',
                                icon: PenIcon,
                                onClick: () =>
                                  navigate(
                                    `/products/product/${product.systemCode}/update`
                                  ),
                              },
                              { divider: true },
                              {
                                label: 'Eliminar',
                                icon: TrashIcon,
                                danger: true,
                                onClick: () => setDeleteTarget(product),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
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
        <AddNewProductModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {deleteTarget && (
        <DeleteModal
          onClose={() => setDeleteTarget(null)}
          elementToDelete={deleteTarget}
          mode="products"
        />
      )}
    </section>
  );
}

export { Products };
