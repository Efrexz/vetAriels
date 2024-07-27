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
                    icon: ShoppingCart,
                    path: "/sales"
                },
                {
                    name: "Cuentas Activas",
                    icon: ShoppingCart,
                    path: "/active-orders"
                },
                {
                    name: "Comprobantes",
                    icon: ShoppingCart,
                    path: "/invoices"
                },
                {
                    name: "Entradas / Salidas",
                    icon: ShoppingCart,
                    path: "/ventas"
                },
                {
                    name: "Cuadrar caja",
                    icon: ShoppingCart,
                    path: "/cash-review"
                },
            ],
        },
        {
            name: "Sala de estar",
            icon: BookIcon,
            path: "/sala-de-estar"
        },
        {
            name: "Internamientos",
            icon: HospitalIcon,
            path: "/internamientos"
        },
        {
            name: "Peluqueria",
            icon: BathIcon,
            subCategories: [
                {
                    name: "Ventas",
                    icon: ShoppingCart,
                    path: "/sales"
                },
                {
                    name: "Cuentas Activas",
                    icon: ShoppingCart,
                    path: "/active-orders"
                },
                {
                    name: "Comprobantes",
                    icon: ShoppingCart,
                    path: "/invoices"
                },
                {
                    name: "Entradas / Salidas",
                    icon: ShoppingCart,
                    path: "/ventas"
                },
                {
                    name: "Cuadrar caja",
                    icon: ShoppingCart,
                    path: "/cash-review"
                },
            ],
            path: "/peluqueria"
        },
        {
            name: "Clientes",
            icon: UserGroupIcon,
            subCategories: [
                {
                    name: "Ventas",
                    icon: ShoppingCart,
                    path: "/sales"
                },
                {
                    name: "Cuentas Activas",
                    icon: ShoppingCart,
                    path: "/active-orders"
                },
                {
                    name: "Comprobantes",
                    icon: ShoppingCart,
                    path: "/invoices"
                },
                {
                    name: "Entradas / Salidas",
                    icon: ShoppingCart,
                    path: "/ventas"
                },
                {
                    name: "Cuadrar caja",
                    icon: ShoppingCart,
                    path: "/cash-review"
                },
            ],
            path: "/clientes"
        },
        {
            name: "Mascotas",
            icon: PetIcon,
            subCategories: [
                {
                    name: "Ventas",
                    icon: ShoppingCart,
                    path: "/sales"
                },
                {
                    name: "Cuentas Activas",
                    icon: ShoppingCart,
                    path: "/active-orders"
                },
                {
                    name: "Comprobantes",
                    icon: ShoppingCart,
                    path: "/invoices"
                },
                {
                    name: "Entradas / Salidas",
                    icon: ShoppingCart,
                    path: "/ventas"
                },
                {
                    name: "Cuadrar caja",
                    icon: ShoppingCart,
                    path: "/cash-review"
                },
            ],
            path: "/mascotas"
        },
        {
            name: "Productos",
            icon: BoxesIcon,
            subCategories: [
                {
                    name: "Ventas",
                    icon: ShoppingCart,
                    path: "/sales"
                },
                {
                    name: "Cuentas Activas",
                    icon: ShoppingCart,
                    path: "/active-orders"
                },
                {
                    name: "Comprobantes",
                    icon: ShoppingCart,
                    path: "/invoices"
                },
                {
                    name: "Entradas / Salidas",
                    icon: ShoppingCart,
                    path: "/ventas"
                },
                {
                    name: "Cuadrar caja",
                    icon: ShoppingCart,
                    path: "/cash-review"
                },
            ],
            path: "/productos"
        },
        {
            name: "Servicios",
            icon: PillsIcon,
            path: "/servicios"
        },
        {
            name: "Configuración",
            icon: ConfigurationIcon,
            subCategories: [
                {
                    name: "Ventas",
                    icon: ShoppingCart,
                    path: "/sales"
                },
                {
                    name: "Cuentas Activas",
                    icon: ShoppingCart,
                    path: "/active-orders"
                },
                {
                    name: "Comprobantes",
                    icon: ShoppingCart,
                    path: "/invoices"
                },
                {
                    name: "Entradas / Salidas",
                    icon: ShoppingCart,
                    path: "/ventas"
                },
                {
                    name: "Cuadrar caja",
                    icon: ShoppingCart,
                    path: "/cash-review"
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
                        <a href={category.path} className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#47C5A6]">
                            {category.name}
                        </a>
                    </li>
                ) : (
                    <li key={index}>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100  hover:text-[#47C5A6]">
                                <span className="text-sm font-medium">{category.name}</span>
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                {category.subCategories?.map((subCategory, index) => (
                                    <li key={index}>
                                        <a href={subCategory.path} className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-[#47C5A6]">
                                            {subCategory.name}
                                        </a>
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

// <section className="flex flex-col w-fullh-full">
//             <ul className="flex flex-col gap-4">
//                 {categories.map((category, index) => (
//                     <li key={index}>
//                         <a to={category.path} className="text-gray-700 font-semibold cursor-pointer hover:text-[#47C5A6] ">
//                             {category.name}
//                         </a>
//                     </li>
//                 ))}
//             </ul>
//         </section>