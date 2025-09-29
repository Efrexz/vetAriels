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

    const { clients } = useClients();
    const { id, section } = useParams<ClientInfoParams>();

    const individualClientData = clients.find(client => client.id === id);

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
        <main className="w-full p-4 sm:p-6 bg-gray-950 text-gray-200">
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 border-b border-cyan-500 pb-4">
                <h1 className="text-xl sm:text-2xl font-medium text-cyan-500">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Información del Cliente</span>
                </h1>
                <HorizontalMenu mode="clients" />
            </div>

            <div className="flex flex-col lg:flex-row bg-gray-800 border border-gray-700 shadow-lg rounded-lg overflow-hidden">
                <div className="w-full md:w-1/5 p-6 bg-gray-700 flex flex-col items-center h-auto">
                    <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-200 text-center">
                        {individualClientData.firstName} {individualClientData.lastName}
                    </h2>
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                        <span className="mr-2">&#x1F6AB;</span> Correo electrónico no confirmado
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