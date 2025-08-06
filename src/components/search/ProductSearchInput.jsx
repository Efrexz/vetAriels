import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ClientsContext } from "@context/ClientsContext";
import { ProductsAndServicesContext } from "@context/ProductsAndServicesContext";
import { ErrorModal } from "../modals/ErrorModal";
import { generateUniqueId } from "@utils/idGenerator";
import PropTypes from "prop-types";



function ProductSearchInput({ addProductToTable, mode, stockMode }) {

    const { productsData, servicesData } = useContext(ProductsAndServicesContext);
    const { addProductToClient } = useContext(ClientsContext);
    const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
    const { id } = useParams();


    const [searchTerm, setSearchTerm] = useState("");

    //estado para saber cuando el input tiene el foco para mostrar la lista de clientes que coinciden con el buscador
    const [isFilteredListVisible, setIsFilteredListVisible] = useState(false);

    function getFilteredServicesAndProducts() {
        if (!stockMode) {
            let productMatch = productsData.filter(product => {
                return product?.productName?.toLowerCase().includes(searchTerm.toLowerCase());
            });
            let serviceMatch = servicesData.filter(service => {
                return service?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
            });
            return [...productMatch, ...serviceMatch];
        }
        else {
            let productMatch = productsData.filter(product => {
                return product?.productName?.toLowerCase().includes(searchTerm.toLowerCase());
            });
            return productMatch;
        }
    }

    function addProductByClient(productOrService) {
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"
        const newProduct = {
            ...productOrService,
            provisionalId: generateUniqueId(),
            additionTime: currentTime,
            additionDate: currentDate,
            quantity: 1,// por defecto siempre sera un producto al agregarlo a la lista
        };
        if (mode === "sales") {
            // agregamos el producto al cliente
            addProductToClient(id, newProduct);
        }
        // también lo agregamos a la tabla local 
        addProductToTable(newProduct);
    }


    return (
        <div className="w-full relative">
            <input
                className="border rounded w-full py-2 px-3 hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                id="clientSearch"
                type="search"
                placeholder="Buscar cliente..."
                value={searchTerm || ""}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsFilteredListVisible(true); // mostrar el dropdown cuando escribes
                }}
                onFocus={() => setIsFilteredListVisible(true)} // cuando el input tiene el foco
                onBlur={() => setTimeout(() => setIsFilteredListVisible(false), 150)} //  al perder foco con un poco de delay se cierra
            />

            {/*Filtrado de busqueda de clientes */}
            {(searchTerm.length >= 3 && isFilteredListVisible) && (
                <ul className="bg-white border rounded-b-lg shadow-lg max-h-[480px] overflow-y-auto absolute top-full right-0 z-40 w-full">
                    {getFilteredServicesAndProducts().map((productOrService, index) => {
                        return (
                            <li
                                key={index}
                                className="py-2 pl-3 pr-6 h-20 cursor-pointer hover:bg-blue-100 border flex justify-between items-center"
                                onClick={() => {
                                    //Confirmamos solo mostrar el error del stock solo en las paginas de ventas y descargas
                                    if (productOrService?.availableStock < 1 && (mode === "discharge" || mode === "sales")) {
                                        setIsOpenErrorModal(true);
                                        setSearchTerm('');
                                        return;
                                    }
                                    addProductByClient(productOrService)
                                    setSearchTerm('')
                                }}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-gray-700">
                                        {productOrService?.productName || productOrService?.serviceName}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-700">
                                            s/{productOrService?.salePrice || productOrService?.price}
                                        </span>
                                        {
                                            productOrService?.availableStock >= 0 && (
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-500">
                                                        <div>Stock</div>
                                                        <div>Disponible</div>
                                                    </div>
                                                    <div className={`${productOrService?.availableStock > 0 ? "bg-blue-500" : "bg-red-500"} font-medium w-7 h-6 flex items-center justify-center rounded-full text-white mx-auto`}>
                                                        {productOrService?.availableStock}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                    {getFilteredServicesAndProducts().length === 0 && (
                        <li className="p-2 text-gray-500">No se encontraron coincidencias</li>
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

ProductSearchInput.propTypes = {
    addProductToTable: PropTypes.func,
    mode: PropTypes.string,
    stockMode: PropTypes.bool
}