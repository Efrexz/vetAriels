import {ComponentType} from 'react';
import { Link } from 'react-router-dom';
import ShoppingCart from '@assets/shoppingCart.svg?react';
import BagShoppingIcon from '@assets/bagShopping.svg?react';
import BookIcon from '@assets/bookIcon.svg?react';
import ScissorsIcon from '@assets/scissorsIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import BoxesIcon from '@assets/boxesIcon.svg?react';
import PillsIcon from '@assets/pillsIcon.svg?react';
import FileInvoiceIcon from '@assets/file-invoice.svg?react';
import ConfigurationIcon from '@assets/configurationIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';

interface DashboardCategory {
    name: string;
    icon: ComponentType<React.SVGProps<SVGSVGElement>>
    color: string;
    link: string;
}

const dashBoardCategories: DashboardCategory[] = [
    {
        name: "Ventas",
        icon: ShoppingCart,
        color: "bg-green-500",
        link: "/sales/client/no_client"
    },
    {
        name: "Cuentas activas",
        icon: BagShoppingIcon,
        color: "bg-orange-500",
        link: "/sales/active-orders"
    },
    {
        name: "Sala de espera",
        icon: BookIcon,
        color: "bg-red-500",
        link: "/clinic-queue"
    },
    {
        name: "Peluquería",
        icon: ScissorsIcon,
        color: "bg-blue-500",
        link: "/grooming"
    },
    {
        name: "Comprobantes",
        icon: FileInvoiceIcon,
        color: "bg-green-700",
        link: "/sales/invoices"
    },
    {
        name: "Clientes",
        icon: UserGroupIcon,
        color: "bg-blue-400",
        link: "/clients"
    },
    {
        name: "Mascotas",
        icon: PawIcon,
        color: "bg-pink-500",
        link: "/pets"
    },
    {
        name: "Productos",
        icon: BoxesIcon,
        color: "bg-purple-400",
        link: "/products"
    },
    {
        name: "Servicios",
        icon: PillsIcon,
        color: "bg-gray-900",
        link: "/services"
    },
    {
        name: "Configuración",
        icon: ConfigurationIcon,
        color: "bg-gray-400",
        link: "/config/subsidiary"
    },
];

function DashBoard() {

    return (
        <main className="container mx-auto p-4 sm:p-6 bg-gray-950 text-gray-50 min-h-screen">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-wide border-b border-cyan-500 pb-3">Escritorio <span className="text-cyan-400">Veterinario</span></h1>
            <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 pt-6">
                {dashBoardCategories.map((category) => (
                    <Link key={category.link} to={category.link}>
                        <div className={
                            `relative bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 min-h-[140px] sm:min-h-[160px] cursor-pointer
                            transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 shadow-lg
                            border border-gray-700 hover:border-cyan-500 group`
                        }>
                            <div className="absolute inset-0 rounded-lg group-hover:ring-2 group-hover:ring-cyan-500 group-hover:ring-offset-2 group-hover:ring-offset-gray-950 transition-all duration-300"></div>
                            {<category.icon className="h-10 w-10 sm:h-14 sm:w-14 mb-3 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 filter group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]" />}
                            <p className="font-bold text-lg sm:text-xl text-center text-gray-100 group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                                {category.name}
                            </p>
                            <span className="absolute bottom-2 right-2 text-cyan-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">Ir &rarr;</span>
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}

export { DashBoard }