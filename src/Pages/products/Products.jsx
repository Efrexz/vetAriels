import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAndServicesContext } from '@context/ProductsAndServicesContext';
import { AddNewProductModal } from '@components/AddNewProductModal.jsx';
import { DeleteModal } from '@components/DeleteModal.jsx';
import EraserIcon from '@assets/eraserIcon.svg?react';
import RefreshIcon from '@assets/refreshIcon.svg?react';
import PDFIcon from '@assets/pdfIcon.svg?react';
import ExcelIcon from '@assets/fileExcelIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import EyeIcon from '@assets/eyeIcon.svg?react';
import EyeSlashIcon from '@assets/eyeSlash.svg?react';
import PenIcon from '@assets/penIcon.svg?react';

const IconsOptions = [
    { icon: EraserIcon, color: "text-gray-700" },
    { icon: RefreshIcon, color: "text-gray-700" },
    { icon: EyeSlashIcon, color: "text-gray-700" },
    { icon: EyeIcon, color: "text-green-600" },
    { icon: TrashIcon, color: "text-red-500" },
    { icon: PDFIcon, color: "text-orange-500" },
    { icon: ExcelIcon, color: "text-green-600" },
];

const filterOptions = [
    {
        type: "Proveedor",
        options: [
            { value: "durand", label: "REPRESENTACIONES DURAND SAC" },
            { value: "imagen-total", label: "Imagen Total SAC" },
        ]
    },
    {
        type: "Línea...",
        options: [
            { value: "alimentos", label: "ALIMENTOS" },
            { value: "farmacia", label: "FARMACIA" },
            { value: "laboratorio", label: "LABORATORIO" },
            { value: "medica", label: "MEDICA" },
            { value: "pet-shop", label: "PET SHOP" },
            { value: "spa", label: "SPA" },
        ]
    },
    {
        type: "Categorías",
        options: [
            { value: "categoria1", label: "Categoría 1" },
            { value: "categoria2", label: "Categoría 2" },
        ]
    },
    {
        type: "Stock...",
        options: [
            { value: "stock-agotado", label: "Stock Agotado" },
            { value: "stock-bajo", label: "Stock Bajo" },
        ]
    },
];

const tableHeaders = ["Cod. de sistema", "Producto", "Marca", "Proveedor", "Línea", "Precio de venta", "Stock Contable", "Stock Disponible", "Estado", "Opciones"];

function Products() {
    const { productsData } = useContext(ProductsAndServicesContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const navigate = useNavigate();

    return (
        <section className="container mx-auto p-6 overflow-auto custom-scrollbar">
            <h1 className="text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                Productos
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="flex w-[35%] border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                            <div className="flex items-center justify-center bg-gray-100 px-3">
                                <SearchIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-[40%] py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <div>
                            {IconsOptions.map((option, index) => (
                                <button key={index} className={`bg-transparent border border-gray-300 ${option.color} py-2 px-4 rounded hover:bg-gray-200`}>
                                    <option.icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                        <button
                            className="border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <PlusIcon className="w-5 h-5" />
                            CREAR NUEVO PRODUCTO
                        </button>
                    </div>

                    {
                        isModalOpen && (
                            <AddNewProductModal
                                onClose={() => setIsModalOpen(false)}
                            />
                        )
                    }

                    {
                        isDeleteModalOpen && (
                            <DeleteModal
                                onClose={() => setIsDeleteModalOpen(false)}
                                // onConfirm={deleteProduct}
                                elementToDelete={productToDelete}
                                mode="products"
                            />
                        )
                    }

                    <div className="flex items-center space-x-4 mb-1">
                        {
                            filterOptions.map((option, index) => (
                                <div key={index} className=" w-[250px] flex gap-2">
                                    <select
                                        name={option.type}
                                        className="mt-1.5 w-full rounded-lg hover:border-blue-300 focus-within:border-blue-300 border-2 text-gray-700 sm:text-sm p-2"
                                    >
                                        <option value="">{option.type}</option>
                                        {option.options.map((option, index) => (
                                            <option key={index} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))
                        }
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
                            {productsData.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-100 text-sm">
                                    <td className="py-2 px-4 text-center border">{product?.systemCode.slice(0, 9).toUpperCase()}</td>
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
                                    <td className="py-10 px-4 text-center border flex justify-center space-x-2">
                                        <PenIcon
                                            className="w-4 h-4 text-green-500 cursor-pointer"
                                            onClick={() => {
                                                navigate(`/products/product/${product?.systemCode}/update`)
                                            }}
                                        />
                                        <TrashIcon
                                            className="w-4 h-4 text-red-500 cursor-pointer"
                                            onClick={() => {
                                                setIsDeleteModalOpen(true)
                                                setProductToDelete(product)
                                            }
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-600">Página: 1 de 1 | Registros del 1 al 2 | Total 2</p>
                    <div className="flex space-x-2">
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