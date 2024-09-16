import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';


function HorizontalMenu({ mode }) {

    const [selectedTab, setSelectedTab] = useState('Editar');

    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
    };

    const clientTabs = [
        { name: 'Editar', url: "update" },
        { name: 'Mascotas', url: "pets" },
        { name: 'Historial de compras', url: "purchase-history" },
        { name: 'Galería', url: "gallery" },
    ];

    const petTabs = [
        { name: 'Editar', url: "update" },
        { name: 'Historial Clínica', url: "clinical-records" },
        { name: 'Historial de compras', url: "purchase-history" },
    ];
    const { id } = useParams();

    return (
        <div>
            <nav className="flex gap-5" aria-label="Tabs">

                {mode === 'clients' &&
                    clientTabs.map((tab, index) => (
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

                {mode === 'pets' &&
                    petTabs.map((tab, index) => (
                        <Link
                            key={index}
                            to={`/pets/pet/${id}/${tab.url}`}
                            className={`shrink-0 rounded-lg p-2 text-sm font-bold
                        ${selectedTab === tab.name ? 'bg-sky-400 text-white ' : 'text-sky-500 hover:text-sky-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabClick(tab.name)}
                        >
                            {tab.name}
                        </Link>
                    ))
                }
            </nav>
        </div>
    );
}

export { HorizontalMenu };