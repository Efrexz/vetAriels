import { useContext } from 'react';
import { useParams } from "react-router-dom";
import { ClientsContext } from '../../context/ClientsContext';
import { ClientProfile } from './ClientProfile';
import { ClientPets } from './ClientPets';
import { PurchaseHistory } from './PurchaseHistory';
import { HorizontalMenu } from '../../components/HorizontalMenu';
import RoleUserIcon from '../../assets/roleUserIcon.svg?react';

function ClientInfo() {

    const { clients } = useContext(ClientsContext);
    const { id, section } = useParams();

    const individualClientData = clients.find(client => client.id == id);

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-5">
                <h1 className="text-2xl font-semibold text-gray-800">Informacion del Cliente</h1>
                <HorizontalMenu />
            </div>

            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-t-lg overflow-hidden">
                <div className="w-full md:w-1/4 p-6 bg-gray-100 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{individualClientData.firstName} {individualClientData.lastName}</h2>
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                        <span className="mr-2">&#x1F6AB;</span> Correo electrónico no confirmado
                    </p>
                </div>
                {section === 'update' && <ClientProfile />}
                {section === 'pets' && <ClientPets />}
                {section === 'purchase-history' && <PurchaseHistory />}
            </div>
        </div>
    );
}

export { ClientInfo };