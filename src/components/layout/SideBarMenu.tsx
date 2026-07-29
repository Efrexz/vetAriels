import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobal } from "@context/GlobalContext";
import HomeIcon from "@assets/homeIcon.svg?react";
import ShoppingCart from "@assets/shoppingCart.svg?react";
import BookIcon from "@assets/bookIcon.svg?react";
import BathIcon from "@assets/bathIcon.svg?react";
import UserGroupIcon from "@assets/userGroupIcon.svg?react";
import PetIcon from "@assets/petIcon.svg?react";
import BoxesIcon from "@assets/boxesIcon.svg?react";
import PillsIcon from "@assets/pillsIcon.svg?react";
import ConfigurationIcon from "@assets/configurationIcon.svg?react";
import ShoppingCartPlusIcon from "@assets/shoppingCartPlus.svg?react";
import BagShoppingIcon from "@assets/bagShopping.svg?react";
import MoneyTransferIcon from "@assets/moneyTransferIcon.svg?react";
import MoneyIcon from "@assets/moneyIcon.svg?react";
import DocumentIcon from "@assets/documentIcon.svg?react";
import DocumentOutIcon from "@assets/documentOutIcon.svg?react";
import DocumentJoinIcon from "@assets/documentJoinIcon.svg?react";
import RoleUserIcon from "@assets/roleUserIcon.svg?react";
import AngleDownIcon from "@assets/angleDown.svg?react";
import PawIcon from "@assets/pawIcon.svg?react";

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

interface NavSubcategory {
    name: string;
    path: string;
    icon?: IconComponent;
}

interface NavCategory {
    name: string;
    icon: IconComponent;
    path?: string;
    subCategories?: NavSubcategory[];
    activeRoutes?: string[];
}

interface NavSection {
    label?: string;
    items: NavCategory[];
}

const sections: NavSection[] = [
    {
        items: [
            { name: "Inicio", icon: HomeIcon, path: "/" },
            {
                name: "Ventas",
                icon: ShoppingCart,
                activeRoutes: ["/sales"],
                subCategories: [
                    { name: "Ventas", icon: ShoppingCartPlusIcon, path: "/sales/client/no_client" },
                    { name: "Cuentas Activas", icon: BagShoppingIcon, path: "/sales/active-orders" },
                    { name: "Entradas / Salidas", icon: MoneyTransferIcon, path: "/sales/payments" },
                    { name: "Cuadrar caja", icon: MoneyIcon, path: "/sales/cash-review" },
                ],
            },
        ],
    },
    {
        label: "Clínica",
        items: [
            { name: "Sala de espera", icon: BookIcon, path: "/clinic-queue" },
            { name: "Clientes", icon: UserGroupIcon, path: "/clients", activeRoutes: ["/clients"] },
            { name: "Mascotas", icon: PetIcon, path: "/pets", activeRoutes: ["/pets"] },
            { name: "Servicios", icon: PillsIcon, path: "/services", activeRoutes: ["/services"] },
        ],
    },
    {
        label: "Grooming",
        items: [
            {
                name: "Peluquería",
                icon: BathIcon,
                activeRoutes: ["/grooming"],
                subCategories: [
                    { name: "Turnos de hoy", path: "/grooming" },
                    { name: "Historial", path: "/grooming/history" },
                ],
            },
        ],
    },
    {
        label: "Inventario",
        items: [
            {
                name: "Productos",
                icon: BoxesIcon,
                activeRoutes: ["/products", "/discharges", "/charges"],
                subCategories: [
                    { name: "Catálogo", icon: DocumentIcon, path: "/products" },
                    { name: "Descargar stock", icon: DocumentOutIcon, path: "/discharges" },
                    { name: "Cargar stock", icon: DocumentJoinIcon, path: "/charges" },
                ],
            },
        ],
    },
    {
        label: "Configuración",
        items: [
            {
                name: "Configuración",
                icon: ConfigurationIcon,
                activeRoutes: ["/config"],
                subCategories: [
                    { name: "General", icon: PawIcon, path: "/config/subsidiary" },
                    { name: "Usuarios", icon: UserGroupIcon, path: "/config/user-subsidiaries" },
                    { name: "Roles", icon: RoleUserIcon, path: "/config/roles" },
                ],
            },
        ],
    },
];

function isRouteActive(cat: NavCategory, pathname: string): boolean {
    const routes = cat.activeRoutes ?? (cat.path ? [cat.path] : []);
    return routes.some((r) => {
        if (r === "/") return pathname === "/";
        return pathname === r || pathname.startsWith(r + "/");
    });
}

function isSubActive(sub: NavSubcategory, pathname: string): boolean {
    return pathname === sub.path || (sub.path !== "/" && pathname.startsWith(sub.path + "/"));
}

interface SideBarMenuProps {
    toggleSideMenu: () => void;
}

function SideBarMenu({ toggleSideMenu }: SideBarMenuProps) {
    const { companyData } = useGlobal();
    const location = useLocation();

    const initialOpen = useMemo(() => {
        for (const section of sections) {
            for (const cat of section.items) {
                if (cat.subCategories && cat.subCategories.length > 0 && isRouteActive(cat, location.pathname)) {
                    return cat.name;
                }
            }
        }
        return null;
    }, []);

    const [openSection, setOpenSection] = useState<string | null>(initialOpen);

    const brandWords = (companyData?.clinicName || "VETERINARIA ARIEL´S EIRL").split(" ");
    const brandFirstWord = brandWords[0];
    const brandRest = brandWords.slice(1).join(" ");

    return (
        <>
            <div className="px-5 pt-5 pb-3 flex items-center gap-3 border-b border-slate-100 flex-shrink-0">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <PawIcon className="w-5 h-5 text-primary" />
                </span>
                <div className="leading-tight min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        {brandFirstWord}
                    </span>
                    {brandRest && (
                        <span className="block text-sm font-bold font-display text-ink truncate">
                            {brandRest}
                        </span>
                    )}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto custom-scrollbar py-3">
                {sections.map((section, si) => (
                    <div key={si} className="mb-1">
                        {section.label && (
                            <p className="px-4 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none">
                                {section.label}
                            </p>
                        )}
                        <ul className="px-3 space-y-0.5">
                            {section.items.map((cat) => {
                                const active = isRouteActive(cat, location.pathname);
                                const hasChildren = cat.subCategories && cat.subCategories.length > 0;
                                const isOpen = openSection === cat.name;

                                if (!hasChildren) {
                                    return (
                                        <li key={cat.name}>
                                            <Link
                                                to={cat.path!}
                                                onClick={toggleSideMenu}
                                                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                                                    active
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-slate hover:bg-slate-100 hover:text-ink"
                                                }`}
                                            >
                                                <cat.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                                                <span className="truncate">{cat.name}</span>
                                            </Link>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={cat.name}>
                                        <button
                                            onClick={() => setOpenSection(isOpen ? null : cat.name)}
                                            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                                                active && !isOpen
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-slate hover:bg-slate-100 hover:text-ink"
                                            }`}
                                        >
                                            <cat.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                                            <span className="truncate flex-1 text-left">{cat.name}</span>
                                            <AngleDownIcon
                                                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                        {isOpen && (
                                            <ul className="mt-0.5 ml-7 space-y-0.5 border-l-2 border-slate-100 pl-4 py-1">
                                                {cat.subCategories!.map((sub) => {
                                                    const subActive = isSubActive(sub, location.pathname);
                                                    return (
                                                        <li key={sub.name}>
                                                            <Link
                                                                to={sub.path}
                                                                onClick={toggleSideMenu}
                                                                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                                                                    subActive
                                                                        ? "text-primary bg-primary/5"
                                                                        : "text-slate hover:text-ink"
                                                                }`}
                                                            >
                                                                {sub.icon && (
                                                                    <sub.icon className="w-4 h-4 flex-shrink-0" />
                                                                )}
                                                                <span className="truncate">{sub.name}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="flex-shrink-0 border-t border-slate-100 px-3 py-3">
                <Link
                    to="/sales/cash-review"
                    onClick={toggleSideMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                    <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MoneyIcon className="w-4 h-4 text-primary" />
                    </span>
                    <div className="leading-tight min-w-0">
                        <span className="block text-sm font-medium text-ink">Cierra tu d&iacute;a</span>
                        <span className="block text-[11px] text-slate truncate">Cuadrar caja</span>
                    </div>
                </Link>
            </div>

            <p className="flex-shrink-0 text-center text-[10px] text-slate-400 pb-3 pt-1">
                &copy; {new Date().getFullYear()} {companyData?.clinicName || "Veterinaria Ariel's"}
            </p>
        </>
    );
}

export { SideBarMenu }
