import { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ClientsContext } from '../context/ClientsContext';

function HorizontalMenu() {

    const [selectedTab, setSelectedTab] = useState('Editar');

    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
    };

    const tabs = [
        { name: 'Editar', url: "update" },
        { name: 'Mascotas', url: "pets" },
        { name: 'Historial de compras', url: "purchase-history" },
        { name: 'Galería', url: "gallery" },
    ];

    const { clients } = useContext(ClientsContext);
    const { id } = useParams();

    return (
        <div>
            <nav className="flex gap-5" aria-label="Tabs">
                {tabs.map((tab, index) => (
                    <Link
                        key={index}
                        to={`/clients/client/${id}/${tab.url}`}
                        className={`shrink-0 rounded-lg p-2 text-sm font-bold
                        ${selectedTab === tab.name ? 'bg-sky-400 text-white ' : 'text-sky-500 hover:text-sky-600 hover:bg-gray-50'}`}
                        onClick={() => handleTabClick(tab.name)}
                    >
                        {tab.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export { HorizontalMenu };