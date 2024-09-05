import { useState } from 'react';

function HorizontalMenu() {

    const [selectedTab, setSelectedTab] = useState('Editar');

    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
    };

    const tabs = [
        { name: 'Editar' },
        { name: 'Mascotas' },
        { name: 'Historial de compras' },
        { name: 'Galería' },
    ];

    return (
        <div>
            <nav className="flex gap-5" aria-label="Tabs">
                {tabs.map((tab, index) => (
                    <a
                        key={index}
                        href="#"
                        className={`shrink-0 rounded-lg p-2 text-sm font-bold
                        ${selectedTab === tab.name ? 'bg-sky-400 text-white ' : 'text-sky-500 hover:text-sky-600 hover:bg-gray-50'}`}
                        onClick={() => handleTabClick(tab.name)}
                    >
                        {tab.name}
                    </a>
                ))}
            </nav>
        </div>
    );
}

export { HorizontalMenu };