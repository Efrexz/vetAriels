import { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { Product } from '@t/inventory.types';
import { AddNewProductModal } from '@components/modals/AddNewProductModal';
import { DeleteModal } from '@components/modals/DeleteModal.jsx';
import PlusIcon from '@assets/plusIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';

const filterOptions = [
    { type: 'provider', label: "Proveedor...", options: ["REPRESENTACIONES DURAND SAC", "Imagen Total SAC", "CENTRO"] },
    { type: 'line', label: "Línea...", options: ["ALIMENTOS", "FARMACIA", "LABORATORIO", "MEDICA", "PET SHOP", "SPA", "OTRA"] },
    { type: 'category', label: "Categorías...", options: ["Categoría 1", "Categoría 2", "OTRA"] },
    { type: 'stock', label: "Stock...", options: ["Stock Agotado", "Stock Bajo"] },
];

const tableHeaders = ["Cod. de sistema", "Producto", "Marca", "Proveedor", "Línea", "Precio de venta", "Stock Contable", "Stock Disponible", "Estado", "Opciones"];

function Products() {
    const { productsData } = useProductsAndServices();

    const navigate = useNavigate();

    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filters, setFilters] = useState<Record<string, string>>({
        provider: '',
        line: '',
        category: '',
        stock: '',
    });

    const filteredProducts = useMemo(() => {
        return productsData.filter(product => {
            const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesProvider = filters.provider ? product.provider === filters.provider : true;
            const matchesLine = filters.line ? product.line === filters.line : true;
            const matchesCategory = filters.category ? product.category === filters.category : true;
            const matchesStock = filters.stock
                ? (filters.stock === 'Stock Agotado' && (product.availableStock ?? 0) === 0) ||
                  (filters.stock === 'Stock Bajo' && (product.availableStock ?? 0) > 0 && (product.availableStock ?? 0) <= (product.minStock ?? 5))
                : true;

            return matchesSearch && matchesProvider && matchesLine && matchesCategory && matchesStock;
        });
    }, [productsData, searchTerm, filters]);

    function handleFilterChange (e: ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Inventario
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Productos
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center w-full sm:w-[350px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary">
                            <div className="flex items-center justify-center px-3">
                                <SearchIcon className="w-4 h-4 text-slate" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="w-full py-2 px-2 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70"
                                value={searchTerm}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            className="ml-auto border border-slate-200 text-white bg-primary py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 justify-center transition-colors font-semibold font-display shadow-sm shadow-primary/25 w-full sm:w-auto"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nuevo producto
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {filterOptions.map((filter) => (
                            <div key={filter.type} className="w-full sm:w-[220px]">
                                <select
                                    name={filter.type}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                >
                                    <option value="">{filter.label}</option>
                                    {filter.options.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product: Product) => (
                                <tr key={product.systemCode || product.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-sm text-slate">{product.systemCode?.slice(0, 8).toUpperCase()}</td>
                                    <td className="py-3 px-4 text-left text-sm text-ink font-medium">{product?.productName}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{product?.brand}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{product?.provider}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{product?.line}</td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-medium">{product?.salePrice}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product?.availableStock > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                            {product?.availableStock}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product?.availableStock > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                            {product?.availableStock}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`inline-block cursor-pointer w-3 h-3 rounded-full ${product?.status ? "bg-success" : "bg-danger"}`}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <button
                                                aria-label={`Editar ${product.productName}`}
                                                className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors"
                                                onClick={() => navigate(`/products/product/${product.systemCode}/update`)}
                                            >
                                                <PenIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                aria-label={`Eliminar ${product.productName}`}
                                                className="p-1.5 rounded-lg text-slate hover:text-danger hover:bg-danger/10 transition-colors"
                                                onClick={() => {
                                                    setIsDeleteModalOpen(true);
                                                    setProductToDelete(product);
                                                }}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {
                    isAddModalOpen && (
                        <AddNewProductModal
                            onClose={() => setIsAddModalOpen(false)}
                        />
                    )
                }

                {
                    isDeleteModalOpen && productToDelete && (
                        <DeleteModal
                            onClose={() => setIsDeleteModalOpen(false)}
                            elementToDelete={productToDelete}
                            mode="products"
                        />
                    )
                }
                <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
                    <p className="text-slate text-sm">
                        Registros 1&ndash;{productsData.length} de {productsData.length}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Primera</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Anterior</button>
                        <button className="py-1.5 px-3 rounded-lg text-sm bg-primary text-white font-semibold transition-colors">1</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Siguiente</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">&Uacute;ltima</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Products };