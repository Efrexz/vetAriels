import { useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

type Mode = 'clients' | 'pets' | 'services' | 'products' | 'user' | 'restock' | 'discharge' | 'clinics';

interface HorizontalMenuProps {
    mode: Mode;
}

interface Tab {
    name: string;
    url: string;
}

// Constantes de modulo: nunca cambian, asi se declaran una sola vez fuera
// del componente para que el useMemo no se invalide en cada render.
const TABS_CONFIG: Record<Mode, Tab[]> = {
    clients: [
        { name: 'Editar', url: 'update' },
        { name: 'Mascotas', url: 'pets' },
        // { name: 'Historial de compras', url: 'purchase-history' },
        // { name: 'Galería', url: 'gallery' },
    ],
    pets: [
        { name: 'Editar', url: 'update' },
        { name: 'Historial Clínica', url: 'clinical-records' },
        // { name: 'Historial de compras', url: 'purchase-history' },
    ],
    services: [
        { name: 'Editar', url: 'update' },
        { name: 'Precios', url: 'prices' },
        // { name: 'Codigo de barras', url: 'barcode' },
    ],
    products: [
        { name: 'Editar', url: 'update' },
        { name: 'Precios', url: 'prices' },
        // { name: 'Codigo de barras', url: 'barcode' },
    ],
    user: [
        { name: 'Datos personales', url: 'update' },
        { name: 'Contraseña', url: 'password' },
        { name: 'Imagen de perfil', url: 'gallery' },
    ],
    restock: [
        { name: 'Ver', url: 'detail' },
        { name: 'Editar', url: 'edit' },
    ],
    discharge: [
        { name: 'Ver', url: 'detail' },
        { name: 'Editar', url: 'edit' },
    ],
    clinics: [
        { name: 'Datos Generales', url: 'subsydiary' },
        // { name: 'Ajustes', url: 'subsydiary-settings' },
        // { name: 'Logo', url: 'gallery' },
    ],
};

function buildBaseUrl(mode: Mode, id: string | undefined): string {
    const path: Record<Mode, string> = {
        clients: `/clients/client/${id}`,
        pets: `/pets/pet/${id}`,
        services: `/service/${id}`,
        products: `/products/product/${id}`,
        user: `/config/profile/${id}`,
        restock: `/charges/charge/${id}`,
        discharge: `/discharges/discharge/${id}`,
        clinics: `/config/clinics/${id}`,
    };
    return path[mode];
}

function HorizontalMenu({ mode }: HorizontalMenuProps) {
    const location = useLocation();
    const { id } = useParams<{ id: string }>();

    const baseUrl = useMemo(() => buildBaseUrl(mode, id), [mode, id]);

    const selectedTab = useMemo(() => {
        const segments = location.pathname.split('/');
        const currentSection = segments[segments.length - 1];
        const tabs = TABS_CONFIG[mode] || [];
        const match = tabs.find((tab) => tab.url === currentSection);
        if (match) return match.name;

        switch (mode) {
            case 'user':
                return 'Datos personales';
            case 'discharge':
            case 'restock':
                return 'Ver';
            case 'clinics':
                return 'Datos Generales';
            default:
                return 'Editar';
        }
    }, [location.pathname, mode]);

    return (
        <div>
            <nav className="flex flex-wrap gap-2 md:gap-6" aria-label="Tabs">
                {TABS_CONFIG[mode]?.map((tab) => (
                    <Link
                        key={tab.name}
                        to={`${baseUrl}/${tab.url}`}
                        className={`shrink-0 rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${
                            selectedTab === tab.name
                                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                                : 'text-slate border border-slate-200 hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                        }`}
                    >
                        {tab.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export { HorizontalMenu };