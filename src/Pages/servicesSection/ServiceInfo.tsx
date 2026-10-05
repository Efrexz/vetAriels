import { useParams, Link } from "react-router-dom";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { Service } from "@t/inventory.types";
import { UpdateService } from "./UpdateService";
import { EditServicePrice } from "./EditServicePrice";
import { HorizontalMenu } from "@components/ui/HorizontalMenu";
import { NotFound } from "@components/ui/NotFound";
import PillsIcon from "@assets/pillsIcon.svg?react";

function ServiceInfo() {
    const { servicesData, isLoadingServices } = useProductsAndServices();

    const { section = 'update', id } = useParams<{ id: string; section?: string }>();

    const serviceData: Service | undefined = servicesData.find(service => service.id === id);

    if (isLoadingServices) {
        return <div className="p-6 text-center text-slate">Cargando servicio...</div>;
    }

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
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Detalle del servicio
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    {serviceData.serviceName}
                </h1>
            </div>
            <div className="mb-5">
                <HorizontalMenu mode={"services"} />
            </div>
            <section>
                {section === 'update' && <UpdateService serviceData={serviceData} />}
                {section === 'prices' && <EditServicePrice serviceData={serviceData} />}
            </section>
        </section>
    );
}

export { ServiceInfo };