
function PermissionsList() {
    const permissions = [
        {
            title: 'Adelantos',
            items: [
                { label: 'Reembolsar adelanto', enabled: true },
                { label: 'Ver listado de adelantos', enabled: true },
                { label: 'Editar fecha de los registros de adelantos', enabled: true },
            ],
        },
        {
            title: 'Almacenes',
            items: [
                { label: 'Crear un nuevo almacén', enabled: true },
                { label: 'Actualizar información del almacén', enabled: true },
                { label: 'Eliminar un almacén', enabled: true },
            ],
        },
    ];

    return (
        <div className="bg-white shadow-sm rounded-md">
            <ul>
                {permissions.map((permission) => (
                    <li key={permission.title} className="p-4 border-b">
                        <h3 className="font-bold">{permission.title}</h3>
                        <ul>
                            {permission.items.map((item) => (
                                <li key={item.label} className="flex items-center">
                                    X
                                    {/* <CheckIcon className={`h-6 w-6 text-blue-500 ${item.enabled ? 'opacity-100' : 'opacity-50'}`} /> */}
                                    <span className="ml-2">{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export { PermissionsList };