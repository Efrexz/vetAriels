import { useContext } from 'react';
import { useParams } from "react-router-dom";
import { ClientsContext } from '@context/ClientsContext';
import { ClientProfile } from './ClientProfile';
import { ClientPets } from './ClientPets';
import { PurchaseHistory } from './PurchaseHistory';
import { HorizontalMenu } from '@components/HorizontalMenu';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

function ClientInfo() {

    const { clients } = useContext(ClientsContext);
    const { id, section } = useParams();

    const individualClientData = clients.find(client => client.id === Number(id));

    return (
        <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto custom-scrollbar mt-3">
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 border-b-2 border-gray-100 pb-5">
                <h1 className="text-2xl font-semibold text-gray-800 text-center lg:text-left">
                    Información del Cliente
                </h1>
                <HorizontalMenu mode="clients" />
            </div>

            <div className="flex flex-col lg:flex-row bg-white border border-gray-100 shadow-lg rounded-lg overflow-hidden">
                <div className="w-full lg:w-[200px] p-6 bg-gray-100 flex flex-col items-center h-auto">
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 text-center">
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
        </div>
    );
}

export { ClientInfo };