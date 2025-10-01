import { useParams, Link } from "react-router-dom";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { Service } from "@t/inventory.types";
import { UpdateService } from "./UpdateService";
import { EditServicePrice } from "./EditServicePrice";
import { HorizontalMenu } from "@components/ui/HorizontalMenu";
import { NotFound } from "@components/ui/NotFound";
import PillsIcon from "@assets/pillsIcon.svg?react";

function ServiceInfo() {
    const { servicesData } = useProductsAndServices();

    const { section = 'update', id } = useParams<{ id: string; section?: string }>();

    const serviceData: Service | undefined = servicesData.find(service => service.id === id);

    if (!serviceData) {
        return (
            <NotFound
                entityName="Servicio"
                searchId={id!}
                returnPath="/services"
            />
        )
    }

    return (
        <section className="w-full p-6 bg-gray-800 text-gray-200 rounded-md">
            <h2 className="text-xl sm:text-2xl font-medium mb-4 border-b-2 border-gray-700 pb-4 flex">
                <PillsIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-cyan-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                    {serviceData.serviceName}
                </span>
            </h2>
            <HorizontalMenu mode={"services"} />
            <section>
                {section === 'update' && <UpdateService serviceData={serviceData} />}
                {section === 'prices' && <EditServicePrice serviceData={serviceData} />}
            </section>
        </section>
    );
}

export { ServiceInfo };