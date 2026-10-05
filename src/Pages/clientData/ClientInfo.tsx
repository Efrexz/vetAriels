import { useParams, Link } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { ClientProfile } from './ClientProfile';
import { ClientPets } from './ClientPets';
import { PurchaseHistory } from './PurchaseHistory';
import { HorizontalMenu } from '@components/ui/HorizontalMenu';
import { NotFound } from "@components/ui/NotFound";
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

type ClientInfoSection = 'update' | 'pets' | 'purchase-history';


interface ClientInfoParams extends Record<string, string | undefined> {
    id: string;
    section: ClientInfoSection;
}


function ClientInfo() {

    const { clients, isLoadingClients } = useClients();
    const { id, section } = useParams<ClientInfoParams>();

    const individualClientData = clients.find(client => client.id === id);

    if (isLoadingClients) {
        return <div className="p-6 text-center text-slate">Cargando cliente...</div>;
    }

    if (!individualClientData) {
        return (
            <NotFound
                entityName="Cliente"
                searchId={id!}
                returnPath="/clients"
            />
        );
    }

    return (
        <main className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Perfil del cliente
                </span>
                <div className="flex flex-col lg:flex-row gap-2 justify-between items-start lg:items-center mb-4">
                    <h1 className="text-2xl font-bold font-display text-ink">
                        {individualClientData.firstName} {individualClientData.lastName}
                    </h1>
                    <HorizontalMenu mode="clients" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row bg-paper border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="w-full lg:w-1/5 p-6 bg-slate-50/50 flex flex-col items-center h-auto">
                    <div className="w-28 h-28 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-14 h-14 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold font-display text-ink text-center">
                        {individualClientData.firstName} {individualClientData.lastName}
                    </h2>
                    <p className="text-xs text-danger mt-1.5 flex items-center">
                        <span className="mr-1.5">&#x1F6AB;</span> Correo no confirmado
                    </p>
                </div>
                <div className="w-full lg:w-[85%]">
                    {section === 'update' && <ClientProfile />}
                    {section === 'pets' && <ClientPets />}
                    {section === 'purchase-history' && <PurchaseHistory />}
                </div>
            </div>
        </main>
    );
}

export { ClientInfo };