

function SideBarMenu() {

    const categories = [
        {
            name: "Inicio",
            path: "/"
        },
        {
            name: "Ventas",
            path: "/ventas"
        },
        {
            name: "Sala de estar",
            path: "/sala-de-estar"
        },
        {
            name: "Internamientos",
            path: "/internamientos"
        },
        {
            name: "Peluqueria",
            path: "/peluqueria"
        },
        {
            name: "Clientes",
            path: "/clientes"
        },
        {
            name: "Mascotas",
            path: "/mascotas"
        },
        {
            name: "Productos",
            path: "/productos"
        },
        {
            name: "Servicios",
            path: "/servicios"
        },
        {
            name: "Configuración",
            path: "/configuracion"
        },
    ]

    return (
        <section className="flex flex-col w-fullh-full">
            <ul className="flex flex-col gap-4">
                {categories.map((category, index) => (
                    <li key={index}>
                        <a to={category.path} className="text-gray-700 font-semibold cursor-pointer hover:text-[#47C5A6] ">
                            {category.name}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export { SideBarMenu }