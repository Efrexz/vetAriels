import { useContext, useState } from "react";
import { ProductsAndServicesContext } from "../context/ProductsAndServicesContext";



function ProductSearchInput({ addProductToTable }) {

    const { productsData, servicesData } = useContext(ProductsAndServicesContext);

    const [searchTerm, setSearchTerm] = useState("");

    //estado para saber cuando el input tiene el foco para mostrar la lista de clientes que coinciden con el buscador
    const [isFilteredListVisible, setIsFilteredListVisible] = useState(false);

    function getFilteredServicesAndProducts() {
        let productMatch = productsData.filter(product => {
            return product?.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
        let serviceMatch = servicesData.filter(service => {
            return service?.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
        });

        return [...productMatch, ...serviceMatch];
    }


    return (
        <div className="w-full relative">
            <input
                className="border rounded w-full py-2 px-3 hover:border-blue-300 focus-within:border-blue-300"
                id="clientSearch"
                type="text"
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
                                    addProductToTable(productOrService)
                                    setSearchTerm('')
                                }}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-gray-700">
                                        {productOrService?.name || productOrService?.serviceName}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-700">
                                            s/{productOrService?.price}
                                        </span>
                                        {
                                            productOrService?.quantity && (
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">
                                                        <div>Stock</div>
                                                        <div>Disponible</div>
                                                    </div>
                                                    <div className="bg-blue-400 font-medium w-7 h-6 flex items-center justify-center rounded-full text-white mx-auto">
                                                        {productOrService?.quantity}
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
        </div>

    );
}

export { ProductSearchInput };