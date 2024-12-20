import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from "prop-types";

function HorizontalMenu({ mode }) {
    const [selectedTab, setSelectedTab] = useState(() => {
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

    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
    };

    // Configuración de pestañas según el modo
    const tabsConfig = {
        clients: [
            { name: 'Editar', url: "update" },
            { name: 'Mascotas', url: "pets" },
            { name: 'Historial de compras', url: "purchase-history" },
            { name: 'Galería', url: "gallery" },
        ],
        pets: [
            { name: 'Editar', url: "update" },
            { name: 'Historial Clínica', url: "clinical-records" },
            { name: 'Historial de compras', url: "purchase-history" },
        ],
        services: [
            { name: 'Editar', url: "update" },
            { name: 'Precios', url: "prices" },
            // { name: 'Codigo de barras', url: "barcode" },
        ],
        products: [
            { name: 'Editar', url: "update" },
            { name: 'Precios', url: "prices" },
            { name: 'Codigo de barras', url: "barcode" },
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

    const { id } = useParams();

    // Determina la URL base según el modo
    const baseUrl = {
        clients: `/clients/client/${id}`,
        pets: `/pets/pet/${id}`,
        services: `/service/${id}`,
        products: `/products/product/${id}`,
        user: `/config/profile/${id}`,
        restock: `/charges/charge/${id}`,
        discharge: `/discharges/discharge/${id}`,
    }[mode];

    const alternativeStyles = mode === 'restock' || mode === 'discharge' || mode === 'services' || mode === "products";

    return (
        <div className={`${alternativeStyles ? 'border-b-2 border-gray-200 pb-4 mb-4' : ''}`}>
            <nav className="flex gap-6" aria-label="Tabs">
                {tabsConfig[mode]?.map((tab, index) => (
                    <Link
                        key={index}
                        to={`${baseUrl}/${tab.url}`}
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

HorizontalMenu.propTypes = {
    mode: PropTypes.string
}