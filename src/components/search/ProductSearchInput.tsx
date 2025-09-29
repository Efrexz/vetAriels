import { useState, useMemo, ChangeEvent } from 'react';
import { useParams } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { ErrorModal } from "../modals/ErrorModal";
import { generateUniqueId } from "@utils/idGenerator";
import { Product, Service } from '@t/inventory.types';

type SearchMode = 'sales' | 'discharge' | 'restock' | 'grooming';

type SearchResultItem = Product | Service;

interface ProductSearchInputProps {
    addProductToTable: (item: Product | Service) => void;
    mode: SearchMode;
    stockMode?: boolean;
}

function ProductSearchInput({ addProductToTable, mode, stockMode }: ProductSearchInputProps) {

    const { productsData, servicesData } = useProductsAndServices();
    const { addProductToClient } = useClients();
    const { id } = useParams<{ id: string }>();

    const [searchTerm, setSearchTerm] = useState<string>("");

    //estado para saber cuando el input tiene el foco para mostrar la lista de clientes que coinciden con el buscador
    const [isFilteredListVisible, setIsFilteredListVisible] = useState<boolean>(false);
    const [isOpenErrorModal, setIsOpenErrorModal] = useState<boolean>(false);

    const filteredItems = useMemo((): SearchResultItem[] => {
        if (searchTerm.length < 3) return [];

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const productMatches = productsData.filter(product =>
        product.productName?.toLowerCase().includes(lowerCaseSearchTerm)
        );

        if (stockMode) {
        return productMatches;
        }

        const serviceMatches = servicesData.filter(service =>
        service.serviceName?.toLowerCase().includes(lowerCaseSearchTerm)
        );

        return [...productMatches, ...serviceMatches];
    }, [searchTerm, productsData, servicesData, stockMode]);

    // Función para determinar si un item es un Producto (Type Guard)
    function isProduct(item: SearchResultItem): item is Product {
        return (item as Product).productName !== undefined;
    }

    function addProductByClient(selectedItem: SearchResultItem) {
        // Si el item es un producto y estamos en un modo que consume stock, mostramos un modal de error
        //Confirmamos solo mostrar el error del stock solo en las paginas de ventas y descargas
        if (isProduct(selectedItem) && selectedItem.availableStock !== undefined && selectedItem.availableStock < 1 && (mode === "discharge" || mode === "sales")) {
            setIsOpenErrorModal(true);
            setSearchTerm('');
            return;
        }

        addProductToTable(selectedItem);
        setSearchTerm('');

        // // Si estamos en modo ventas y hay un ID de cliente, lo añadimos al cliente.
        // if (mode === "sales" && id) {
        //     addProductToClient(id, newItemForTable);
        // }
    }

    return (
        <div className="w-full relative">
            <input
                className="bg-gray-700 border border-gray-600 rounded-lg w-full py-1 px-4 text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 focus:outline-none hover:border-cyan-500"
                id="productSearch"
                type="search"
                placeholder="Buscar producto o servicio..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsFilteredListVisible(true); // mostrar el dropdown cuando escribes
                }}
                onFocus={() => setIsFilteredListVisible(true)} // cuando el input tiene el foco
                onBlur={() => setTimeout(() => setIsFilteredListVisible(false), 150)} //  al perder foco con un poco de delay se cierra
            />

            {/*Filtrado de busqueda de productos y servicios */}
            {isFilteredListVisible && filteredItems.length > 0 && (
                <ul className="bg-gray-800 border border-gray-700 rounded-b-lg shadow-xl max-h-[480px] overflow-y-auto custom-scrollbar absolute top-full right-0 z-40 w-full">
                    {filteredItems.map((item) => {
                        const isItemProduct = isProduct(item); // Usamos el type guard para determinar el tipo
                        return (
                            <li
                                key={isItemProduct ? item.systemCode : item.id}
                                className="py-2 pl-3 pr-6 h-20 cursor-pointer hover:bg-gray-700 border-b border-gray-700 flex justify-between items-center transition-colors"
                                onClick={() => addProductByClient(item)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-cyan-400">
                                        {isItemProduct ? item.productName : item.serviceName}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-200">
                                            s/{item?.salePrice}
                                        </span>
                                        {
                                            isItemProduct && item.availableStock !== undefined && (
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-400">
                                                        <div>Stock</div>
                                                        <div>Disponible</div>
                                                    </div>
                                                    <div className={`${item?.availableStock > 0 ? "bg-cyan-500 border-cyan-500" : "bg-red-500 border-red-500"} font-medium w-7 h-6 flex items-center justify-center rounded-full text-white mx-auto border`}>
                                                        {item?.availableStock}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                    {isFilteredListVisible && searchTerm.length >= 3 && filteredItems.length === 0 && (
                        <li className="p-3 text-gray-500">No se encontraron coincidencias</li>
                    )}
                </ul>
            )}
            {
                isOpenErrorModal && <ErrorModal onClose={() => setIsOpenErrorModal(false)} typeOfError="stock" />
            }
        </div>
    );
}

export { ProductSearchInput };
