import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type Mode = 'clients' | 'pets' | 'services' | 'products' | 'user' | 'restock' | 'discharge';

interface HorizontalMenuProps {
    mode: Mode;
}

interface Tab {
    name: string;
    url: string;
}

function HorizontalMenu({ mode }: HorizontalMenuProps) {
    const [selectedTab, setSelectedTab] = useState<string>(() => {
        switch (mode) {
            case 'user':
                return 'Datos personales';
            case 'discharge':
            case 'restock':
                return 'Ver';
            default:
                return 'Editar';
        }
    });

    function handleTabClick (tabName : string) {
        setSelectedTab(tabName);
    };

    const tabsConfig: Record<Mode, Tab[]> = {
        clients: [
            { name: 'Editar', url: "update" },
            { name: 'Mascotas', url: "pets" },
            // { name: 'Historial de compras', url: "purchase-history" },
            // { name: 'Galería', url: "gallery" },
        ],
        pets: [
            { name: 'Editar', url: "update" },
            { name: 'Historial Clínica', url: "clinical-records" },
            // { name: 'Historial de compras', url: "purchase-history" },   
        ],
        services: [
            { name: 'Editar', url: "update" },
            { name: 'Precios', url: "prices" },
            // { name: 'Codigo de barras', url: "barcode" },
        ],
        products: [
            { name: 'Editar', url: "update" },
            { name: 'Precios', url: "prices" },
            // { name: 'Codigo de barras', url: "barcode" },
        ],
        user: [
            { name: 'Datos personales', url: "update" },
            { name: 'Contraseña', url: "password" },
            { name: 'Imagen de perfil', url: "gallery" },
        ],
        restock: [
            { name: 'Ver', url: "detail" },
            { name: 'Editar', url: "edit" },
        ],
        discharge: [
            { name: 'Ver', url: "detail" },
            { name: 'Editar', url: "edit" },
        ],
    };

     const { id } = useParams<{ id: string }>();

    // Determina la URL base según el modo
    const baseUrl: Record<Mode, string>  = {
        clients: `/clients/client/${id}`,
        pets: `/pets/pet/${id}`,
        services: `/service/${id}`,
        products: `/products/product/${id}`,
        user: `/config/profile/${id}`,
        restock: `/charges/charge/${id}`,
        discharge: `/discharges/discharge/${id}`,
    };

    const hasAlternativeStyles = ['restock', 'discharge', 'services', 'products'].includes(mode);
    return (
        <div className={`${hasAlternativeStyles  ? "border-b-2 border-gray-200 pb-4 mb-4" : ""}`}>
            <nav className="flex flex-wrap gap-2 md:gap-6" aria-label="Tabs">
                {tabsConfig[mode]?.map((tab) => (
                    <Link
                        key={tab.name}
                        to={`${baseUrl[mode]}/${tab.url}`}
                        className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-all
                        ${selectedTab === tab.name ? "bg-sky-400 text-white" : "text-sky-500 hover:text-sky-600 hover:bg-gray-50"}`}
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
