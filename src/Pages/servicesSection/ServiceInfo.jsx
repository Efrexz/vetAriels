import { useContext } from "react";
import { ProductsAndServicesContext } from "@context/ProductsAndServicesContext.jsx";
import { useParams } from "react-router-dom";
import { UpdateService } from "./UpdateService.jsx";
import { EditServicePrice } from "./EditServicePrice.jsx";
import { HorizontalMenu } from "@components/ui/HorizontalMenu";
import PillsIcon from "@assets/pillsIcon.svg?react";


function ServiceInfo() {
    const { servicesData } = useContext(ProductsAndServicesContext);

    const { section, id } = useParams();

    const serviceData = servicesData.find(service => service.id === id);

    return (
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-xl sm:text-3xl font-medium mb-4 border-b-2 border-gray-200 pb-3 text-blue-400 flex gap-1 align-center" >
                <PillsIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                {serviceData?.serviceName}
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