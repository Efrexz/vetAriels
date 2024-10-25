import { Link } from "react-router-dom";
import HomeIcon from '../assets/homeIcon.svg?react';
import ShoppingCart from '../assets/shoppingCart.svg?react';
import BookIcon from '../assets/bookIcon.svg?react';
import HospitalIcon from '../assets/hospitalIcon.svg?react';
import BathIcon from '../assets/bathIcon.svg?react';
import UserGroupIcon from '../assets/userGroupIcon.svg?react';
import PetIcon from '../assets/petIcon.svg?react';
import BoxesIcon from '../assets/boxesIcon.svg?react';
import PillsIcon from '../assets/pillsIcon.svg?react';
import ConfigurationIcon from '../assets/configurationIcon.svg?react';
import ShoppingCartPlusIcon from '../assets/shoppingCartPlus.svg?react';
import BagShoppingIcon from '../assets/bagShopping.svg?react';
import FileInvoiceIcon from '../assets/file-invoice.svg?react';
import MoneyTransferIcon from '../assets/moneyTransferIcon.svg?react';
import MoneyIcon from '../assets/moneyIcon.svg?react';
import DocumentIcon from '../assets/documentIcon.svg?react';
import DocumentOutIcon from '../assets/documentOutIcon.svg?react';
import DocumentJoinIcon from '../assets/DocumentJoinIcon.svg?react';
import BuildingShieldIcon from '../assets/buildingShield.svg?react';
import RoleUserIcon from '../assets/roleUserIcon.svg?react';
import FileContractIcon from '../assets/fileContract.svg?react';

function SideBarMenu() {

    const categories = [
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
                {
                    name: "Comprobantes",
                    icon: FileInvoiceIcon,
                    path: "/sales/invoices"
                },
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
        {
            name: "Internamientos",
            icon: HospitalIcon,
            path: "/internments"
        },
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
                {
                    name: "Stock por almacén",
                    icon: BoxesIcon,
                    path: "/depot-stocks"
                },
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
                {
                    name: "Datos fiscales",
                    icon: BuildingShieldIcon,
                    path: "/config/companies"
                },
                {
                    name: "Comprobantes",
                    icon: FileInvoiceIcon,
                    path: "/config/invoice-types"
                },
                {
                    name: "Metodos de pago",
                    icon: MoneyIcon,
                    path: "/config/payment-methods"
                },
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
                {
                    name: "Cuenta",
                    icon: FileContractIcon,
                    path: "/config/subscriptions"
                },
            ],
            path: "/configuracion"
        },
    ]

    return (
        <ul className="space-y-1">
            {categories.map((category, index) => (
                !category.subCategories ? (
                    <li key={index}>
                        <Link to={category.path} className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-md font-medium text-gray-600 hover:bg-gray-100 hover:text-[#47C5A6]">
                            <category.icon className="w-5 h-5" />
                            {category.name}
                        </Link>
                    </li>
                ) : (
                    <li key={index}>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100  hover:text-[#47C5A6]">
                                <span className="flex gap-2 items-center text-sm font-medium">
                                    <category.icon className="w-5 h-5" />
                                    {category.name}
                                </span>
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                {category.subCategories?.map((subCategory, index) => (
                                    <li key={index}>
                                        <Link to={subCategory.path} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#47C5A6]">
                                            {subCategory.icon ? <subCategory.icon className="w-4 h-4" /> : null}
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
