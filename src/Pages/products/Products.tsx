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
        <section className="container mx-auto p-6 overflow-auto custom-scrollbar">
            <h1 className="text-xl md:text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                Productos
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex w-full sm:w-[350px] border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                            <div className="flex items-center justify-center bg-gray-100 px-3">
                                <SearchIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            className="w-full sm:w-auto border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2 justify-center"
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
                                    className="w-full rounded-lg hover:border-blue-300 focus-within:border-blue-300 border-2 text-gray-700 sm:text-sm p-2"
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

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-1 text-center border font-medium text-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product: Product) => (
                                <tr key={product.systemCode || product.id} className="hover:bg-gray-100 text-sm">
                                    <td className="py-2 px-4 text-center border">{product.systemCode?.slice(0, 8).toUpperCase()}</td>
                                    <td className="py-2 px-4 text-left border">{product?.productName}</td>
                                    <td className="py-2 px-4 text-center border">{product?.brand}</td>
                                    <td className="py-2 px-4 text-center border">{product?.provider}</td>
                                    <td className="py-2 px-4 text-center border">{product?.line}</td>
                                    <td className="py-2 px-4 text-center border">{product?.salePrice}</td>
                                    <td className="py-2 px-4 text-center border">
                                        <span className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-xs text-white ${product?.availableStock > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full`}>
                                            {product?.availableStock}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center border">
                                        <span className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-xs text-white ${product?.availableStock > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full`}>
                                            {product?.availableStock}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center border ">
                                        <span
                                            className={`inline-block cursor-pointer w-4 h-4 rounded-full ${product?.status ? "bg-green-500" : "bg-red-500"}`}
                                        />
                                    </td>
                                    <td className="py-8 px-4 text-center border">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <div className="flex justify-center items-center h-full space-x-2">
                                                <button aria-label={`Editar ${product.productName}`} onClick={() => navigate(`/products/product/${product.systemCode}/update`)}>
                                                    <PenIcon className="w-4 h-4 text-green-500 cursor-pointer" />
                                                </button>
                                                <button aria-label={`Eliminar ${product.productName}`} onClick={() => {
                                                    setIsDeleteModalOpen(true);
                                                    setProductToDelete(product);
                                                }}>
                                                    <TrashIcon className="w-4 h-4 text-red-500 cursor-pointer" />
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
                            // onConfirm={deleteProduct}
                            elementToDelete={productToDelete}
                            mode="products"
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {productsData.length} | Total{" "}
                        {productsData.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-2 px-4 border rounded">Primera</button>
                        <button className="py-2 px-4 border rounded">Anterior</button>
                        <button className="py-2 px-4 border rounded bg-blue-500 text-white">1</button>
                        <button className="py-2 px-4 border rounded">Siguiente</button>
                        <button className="py-2 px-4 border rounded">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Products };