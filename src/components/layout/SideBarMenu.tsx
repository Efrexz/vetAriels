import { Link } from "react-router-dom";
import HomeIcon from '@assets/homeIcon.svg?react';
import ShoppingCart from '@assets/shoppingCart.svg?react';
import BookIcon from '@assets/bookIcon.svg?react';
import HospitalIcon from '@assets/hospitalIcon.svg?react';
import BathIcon from '@assets/bathIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import PetIcon from '@assets/petIcon.svg?react';
import BoxesIcon from '@assets/boxesIcon.svg?react';
import PillsIcon from '@assets/pillsIcon.svg?react';
import ConfigurationIcon from '@assets/configurationIcon.svg?react';
import ShoppingCartPlusIcon from '@assets/shoppingCartPlus.svg?react';
import BagShoppingIcon from '@assets/bagShopping.svg?react';
import MoneyTransferIcon from '@assets/moneyTransferIcon.svg?react';
import MoneyIcon from '@assets/moneyIcon.svg?react';
import DocumentIcon from '@assets/documentIcon.svg?react';
import DocumentOutIcon from '@assets/documentOutIcon.svg?react';
import DocumentJoinIcon from '@assets/documentJoinIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import AngleDownIcon from '@assets/angleDown.svg?react';

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

interface SubCategory {
    name: string;
    path: string;
    icon?: IconComponent;
}

type Category = {
    name: string;
    icon: IconComponent;
} & (
    {
        path: string;
        subCategories?: never;
    } | {
        subCategories: SubCategory[];
        path?: never;
    }
);

interface SideBarMenuProps {
    toggleSideMenu: () => void;
}

const categories : Category[] = [
        {
            name: "Inicio",
            icon: HomeIcon,
            path: "/"
        },
        {
            name: "Ventas",
            icon: ShoppingCart,
            subCategories: [
                {
                    name: "Ventas",
                    icon: ShoppingCartPlusIcon,
                    path: "/sales/client/no_client"
                },
                {
                    name: "Cuentas Activas",
                    icon: BagShoppingIcon,
                    path: "/sales/active-orders"
                },
                // {
                //     name: "Comprobantes",
                //     icon: FileInvoiceIcon,
                //     path: "/sales/invoices"
                // },
                {
                    name: "Entradas / Salidas",
                    icon: MoneyTransferIcon,
                    path: "/sales/payments"
                },
                {
                    name: "Cuadrar caja",
                    icon: MoneyIcon,
                    path: "/sales/cash-review"
                },
            ],
        },
        {
            name: "Sala de espera",
            icon: BookIcon,
            path: "/clinic-queue"
        },
        // {
        //     name: "Internamientos",
        //     icon: HospitalIcon,
        //     path: "/internments"
        // },
        {
            name: "Peluqueria",
            icon: BathIcon,
            subCategories: [
                {
                    name: "Turnos de hoy",
                    path: "/grooming"
                },
                {
                    name: "Historial",
                    path: "/grooming/history"
                },
            ],
        },
        {
            name: "Clientes",
            icon: UserGroupIcon,
            path: "/clients"
        },
        {
            name: "Mascotas",
            icon: PetIcon,
            path: "/pets"
        },
        {
            name: "Productos",
            icon: BoxesIcon,
            subCategories: [
                {
                    name: "Catalogo",
                    icon: DocumentIcon,
                    path: "/products"
                },
                {
                    name: "Descargar stock",
                    icon: DocumentOutIcon,
                    path: "/discharges"
                },
                {
                    name: "Cargar stock",
                    icon: DocumentJoinIcon,
                    path: "/charges"
                },
                // {
                //     name: "Stock por almacén",
                //     icon: BoxesIcon,
                //     path: "/depot-stocks"
                // },
            ],
        },
        {
            name: "Servicios",
            icon: PillsIcon,
            path: "/services"
        },
        {
            name: "Configuración",
            icon: ConfigurationIcon,
            subCategories: [
                {
                    name: "General",
                    icon: HospitalIcon,
                    path: "/config/subsidiary"
                },
                // {
                //     name: "Datos fiscales",
                //     icon: BuildingShieldIcon,
                //     path: "/config/fiscal-data"
                // },
                // {
                //     name: "Comprobantes",
                //     icon: FileInvoiceIcon,
                //     path: "/config/invoice-types"
                // },
                // {
                //     name: "Metodos de pago",
                //     icon: MoneyIcon,
                //     path: "/config/payment-methods"
                // },
                {
                    name: "Usuarios",
                    icon: UserGroupIcon,
                    path: "/config/user-subsidiaries"
                },
                {
                    name: "Roles",
                    icon: RoleUserIcon,
                    path: "/config/roles"
                },
            ],
        },
    ]

function SideBarMenu({ toggleSideMenu }: SideBarMenuProps) {

    return (
        <ul className="space-y-1 w-full pt-10 lg:pt-0 pl-4 lg:pl-0 pb-6 md:pb-0">
            {categories.map((category) => (
                !category.subCategories ? (
                    <li key={category.name}>
                        <Link
                            to={category.path}
                            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-lg sm:text-[18px] font-medium text-gray-600 hover:bg-gray-100 hover:text-[#60A5FA]"
                            onClick={toggleSideMenu}
                        >
                            <category.icon className="w-6 sm:w-5 h-6 sm:h-5" />
                            {category.name}
                        </Link>
                    </li>
                ) : (
                    <li key={category.name} className="group">
                        <details className="group [&_summary::-webkit-details-marker]:hidden" name="details">
                            <summary className="flex cursor-pointer items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100  hover:text-[#60A5FA]  ">
                                <span className="flex gap-2 items-center text-lg sm:text-[18px] font-medium">
                                    <category.icon className="w-6 sm:w-5 h-6 sm:h-5 " />
                                    {category.name}
                                </span>
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <AngleDownIcon className="w-5 h-5" />
                                </span>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                {category.subCategories?.map((subCategory) => (
                                    <li key={subCategory.name}>
                                        <Link
                                            to={subCategory.path}
                                            className="flex items-center gap-2 rounded-lg px-2 py-2 text-lg sm:text-[18px] font-medium text-gray-600 hover:bg-gray-100 hover:text-[#60A5FA]"
                                            onClick={toggleSideMenu}
                                        >
                                            {subCategory.icon ? <subCategory.icon className="w-5 sm:w-5 h-5 sm:h-5" /> : null}
                                            {subCategory.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </li>
                )
            ))}
        </ul>
    )
}

export { SideBarMenu }

