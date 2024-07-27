import ShoppingCart from '../assets/shoppingCart.svg?react';
import BagShoppingIcon from '../assets/bagShopping.svg?react';
import BookIcon from '../assets/bookIcon.svg?react';
import ScissorsIcon from '../assets/scissorsIcon.svg?react';
import UserGroupIcon from '../assets/userGroupIcon.svg?react';
import PetIcon from '../assets/petIcon.svg?react';
import BoxesIcon from '../assets/boxesIcon.svg?react';
import PillsIcon from '../assets/pillsIcon.svg?react';
import FileInvoiceIcon from '../assets/file-invoice.svg?react';
import ConfigurationIcon from '../assets/configurationIcon.svg?react';

function DashBoard() {


    const dashBoardCategories = [
        {
            name: "Ventas",
            icon: ShoppingCart,
            color: "bg-green-500",
            link: "/ventas"
        },
        {
            name: "Cuentas activas",
            icon: BagShoppingIcon,
            color: "bg-orange-500",
            link: "/cuentas"
        },
        {
            name: "Sala de espera",
            icon: BookIcon,
            color: "bg-red-500",
            link: "/cuentas"
        },
        {
            name: "Peluquería",
            icon: ScissorsIcon,
            color: "bg-blue-500",
            link: "/peluqueria"
        },
        {
            name: "Comprobantes",
            icon: FileInvoiceIcon,
            color: "bg-green-700",
            link: "/ventas"
        },
        {
            name: "Clientes",
            icon: UserGroupIcon,
            color: "bg-blue-400",
            link: "/clientes"
        },
        {
            name: "Mascotas",
            icon: PetIcon,
            color: "bg-pink-500",
            link: "/mascotas"
        },
        {
            name: "Productos",
            icon: BoxesIcon,
            color: "bg-purple-400",
            link: "/productos"
        },
        {
            name: "Servicios",
            icon: PillsIcon,
            color: "bg-gray-900",
            link: "/servicios"
        },
        {
            name: "Configuración",
            icon: ConfigurationIcon,
            color: "bg-gray-400",
            link: "/configuracion"
        },
    ]
    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-[#03A9F4] mb-4">Escritorio</h1>
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 border-t-2 border-gray-100 pt-6">
                {dashBoardCategories.map((category) => (
                    <div key={category.name} className={`${category.color} text-white rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer transform transition-transform duration-300 hover:scale-105`}>
                        {<category.icon className="h-12 w-12 mb-2" />}
                        <p className="font-semibold">{category.name}</p>
                    </div>
                ))}
            </section>
        </main>
    )
}

export { DashBoard }