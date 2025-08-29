import { useParams, Link } from "react-router-dom";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { Service } from "@t/inventory.types";
import { UpdateService } from "./UpdateService";
import { EditServicePrice } from "./EditServicePrice";
import { HorizontalMenu } from "@components/ui/HorizontalMenu";
import PillsIcon from "@assets/pillsIcon.svg?react";
import SearchIcon from "@assets/searchIcon.svg?react";
import AlertIcon from "@assets/alertIcon.svg?react";


function ServiceInfo() {
    const { servicesData } = useProductsAndServices();

    const { section = 'update', id } = useParams<{ id: string; section?: string }>();

    const serviceData: Service | undefined = servicesData.find(service => service.id === id);

    if (!serviceData) {
        return (
        <main className="container mx-auto p-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-xl w-full text-center border-t-4 border-blue-500">
            <AlertIcon className="text-blue-500 w-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl font-extrabold text-gray-700 mb-4">
                Servicio no Encontrado
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                No se encontró ningún servicio con el ID "<strong className="text-blue-600">{id}</strong>". Por favor, verifica el identificador.
            </p>
            <div className="border-t border-gray-200 pt-6 mt-6">
                <Link
                to="/services"
                className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-lg"
                >
                <SearchIcon className="w-5 mr-3" /> Ver lista de servicios
                </Link>
            </div>
            </div>
        </main>
        );
    }


    return (
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-xl sm:text-3xl font-medium mb-4 border-b-2 border-gray-200 pb-3 text-blue-400 flex gap-1 align-center" >
                <PillsIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                {serviceData.serviceName}
            </h2>
            <HorizontalMenu mode={"services"} />
            <section >
                {section === 'update' && <UpdateService serviceData={serviceData} />}
                {section === 'prices' && <EditServicePrice serviceData={serviceData} />}
            </section>
        </main>
    );
}

export { ServiceInfo };