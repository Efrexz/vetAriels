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
        <section className="w-full p-6 overflow-auto">
    <h1 className="text-xl md:text-2xl font-medium mb-4 pb-4 border-b-2 border-cyan-500 flex items-center gap-2">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Productos</span>
    </h1>
    <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6 border border-gray-700">
        <div className="p-4 rounded-xl mb-4 bg-gray-800 border-2 border-cyan-500/30">
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex w-full sm:w-[350px] border-gray-600 border rounded-lg overflow-hidden hover:border-cyan-500 focus-within:border-cyan-500">
                    <div className="flex items-center justify-center bg-gray-700 px-3">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="w-full py-1 px-5 focus:outline-none focus:ring-0 focus:border-transparent bg-gray-700 text-gray-200"
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    className="w-full sm:w-auto border border-gray-700 text-white bg-emerald-600 py-1 px-3 rounded-xl hover:bg-emerald-700 flex items-center gap-2 justify-center transition-colors"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <PlusIcon className="w-5 h-5" />
                    CREAR NUEVO PRODUCTO
                </button>
            </div>

            <div className="flex flex-wrap gap-4">
                {filterOptions.map((filter) => (
                    <div key={filter.type} className="w-full sm:w-[250px]">
                        <select
                            name={filter.type}
                            onChange={handleFilterChange}
                            className="w-full rounded-lg hover:border-cyan-500 focus-within:border-cyan-500 border-2 border-gray-600 text-gray-400 bg-gray-700 sm:text-sm py-1 px-5"
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

        <div className="overflow-x-auto border border-gray-700 rounded-lg">
            <table className="min-w-full bg-gray-800 rounded-lg">
                <thead className="bg-gray-700 border-b border-gray-600">
                    <tr>
                        {tableHeaders.map((header) => (
                            <th key={header} className="py-1 px-4 text-center border-r border-gray-600 font-bold text-sm text-gray-300">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product: Product) => (
                        <tr key={product.systemCode || product.id} className="hover:bg-gray-700 text-sm">
                            <td className="py-1 px-4 text-center border border-gray-600 text-gray-400">{product.systemCode?.slice(0, 8).toUpperCase()}</td>
                            <td className="py-1 px-4 text-left border border-gray-600 text-gray-400">{product?.productName}</td>
                            <td className="py-1 px-4 text-center border border-gray-600 text-gray-400">{product?.brand}</td>
                            <td className="py-1 px-4 text-center border border-gray-600 text-gray-400">{product?.provider}</td>
                            <td className="py-1 px-4 text-center border border-gray-600 text-gray-400">{product?.line}</td>
                            <td className="py-1 px-4 text-center border border-gray-600 text-gray-400">{product?.salePrice}</td>
                            <td className="py-1 px-4 text-center border border-gray-600 text-gray-400">
                                <span className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-xs text-white ${product?.availableStock > 0 ? 'bg-green-600' : 'bg-red-600'} rounded-full`}>
                                    {product?.availableStock}
                                </span>
                            </td>
                            <td className="py-1 px-4 text-center border border-gray-600 text-gray-400">
                                <span className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-xs text-white ${product?.availableStock > 0 ? 'bg-green-600' : 'bg-red-600'} rounded-full`}>
                                    {product?.availableStock}
                                </span>
                            </td>
                            <td className="py-1 px-4 text-center border border-gray-600 ">
                                <span
                                    className={`inline-block cursor-pointer w-4 h-4 rounded-full ${product?.status ? "bg-green-600" : "bg-red-600"}`}
                                />
                            </td>
                            <td className="py-1 px-4 text-center border border-gray-600 ">
                                <div className="flex justify-center items-center h-full space-x-2">
                                    <div className="flex justify-center items-center h-full space-x-2">
                                        <button aria-label={`Editar ${product.productName}`} onClick={() => navigate(`/products/product/${product.systemCode}/update`)}>
                                            <PenIcon className="w-4 h-4 text-cyan-500 hover:text-cyan-400" />
                                        </button>
                                        <button aria-label={`Eliminar ${product.productName}`} onClick={() => {
                                            setIsDeleteModalOpen(true);
                                            setProductToDelete(product);
                                        }}>
                                            <TrashIcon className="w-4 h-4 text-red-500 hover:text-red-400" />
                                        </button>
                                    </div>
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
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-400 text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {productsData.length} | Total{" "}
                        {productsData.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Primera</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Anterior</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">1</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Siguiente</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Última</button>
                    </div>
                </div>
    </div>
</section>
    );
}

export { Products };