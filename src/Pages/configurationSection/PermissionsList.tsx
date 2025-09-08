import { ToggleSwitchButton } from "@components/ui/ToggleSwitchButton";
import KeyIcon from '@assets/keyIcon.svg?react';

function PermissionsList() {
    const sections = [
        {
            title: 'Adelantos',
            actions: ['Reembolsar adelanto', 'Ver listado de adelantos', 'Editar fecha de los registros de adelantos'],
        },
        {
            title: 'Almacenes',
            actions: ['Crear un nuevo almacén', 'Actualizar información del almacén', 'Eliminar un almacén'],
        },
        {
            title: 'Clientes',
            actions: [
                'Crear nuevo cliente',
                'Eliminar clientes',
                'Actualizar datos de un cliente',
                'Ver listado de clientes',
                'Ver información de un cliente',
                'Exportar listado de clientes',
                'Imprimir listado de clientes',
                'Acceso a la papelera',
                'Restaurar clientes eliminados',
                'Fusionar clientes',
                'Clientes (permiso global)',
                'Gestión de clientes',
                'Acceder a la herramienta de auditoria',
            ],
        },
        {
            title: 'Cloud',
            actions: ['Actualizar registro', 'Eliminar registro', 'Cloud (permiso global)'],
        },
        {
            title: 'Configuracion',
            actions: [
                'Eliminar un usuario',
                'Actualizar información de un usuario',
                'Crear una línea',
                'Eliminar una línea',
                'Actualizar información de una línea',
                'Crear una nueva empresa',
                'Actualizar información de una empresa',
                'Crear un nuevo rol',
                'Actualizar información de un rol',
                'Acceso a configuración',
            ],
        },
        {
            title: 'Eventos',
            actions: [
                'Crear un evento',
                'Eliminar un evento',
                'Actualizar informacion de un evento',
                'Exportar listado de Eventos',
                'Imprimir listado de eventos',
                'Eventos (permiso global)',
                'Eventos (listar)',
                'Visualizar calendario por mes',
            ],
        },
        {
            title: 'Historial Clínico',
            actions: [
                'Historia clínica - crear registro',
                'Historia clínica - Actualizar registro',
                'Historia clínica - Eliminar registro',
                'Historia clínica - Adjuntar archivo',
                'Historia clínica - Descargar archivos',
                'Historia Clínica - Descargar historia clínica',
                'Historia Clínica - Imprimir Ficha y Receta',
            ],
        },
        {
            title: 'Internamientos',
            actions: [
                'Internamientos (permiso global)',
                'Ver listado de pacientes',
                'Ver listado de tratamientos',
            ],
        },
        {
            title: 'Mascotas',
            actions: [
                'Crear mascotas',
                'Actualizar mascota',
                'Eliminar mascota',
                'Exportar listado de mascotas',
                'Imprimir listado de mascotas',
                'Mascotas (permiso global)',
                'Ver historial de compras de una mascota',
                'Fusionar Mascotas',
                'Restaurar mascotas',
                'Ver listado de Mascotas',
                'Acceder a la papelera',
                'Gestión de mascotas',
                'Acceder a la herramienta auditoria',
            ],
        },
        {
            title: 'Ordenes de Servicio',
            actions: [
                'Actualizar datos de una orden de servicio',
                'Imprimir listado de ordenes de servicio',
                'Exportar listado de ordenes de servicio',
                'Ver datos orden de peluqueria',
                'Anular una orden de servicio',
                'Peluqueria (permiso global)',
                'Transporte (permiso global)',
                'Hotel (permiso global)',
            ],
        },
        {
            title: 'Productos',
            actions: [
                'Crear producto',
                'Actualizar información de un producto',
                'Eliminar producto',
                'Exportar listado de productos',
                'Imprimir listado de productos',
                'Ver listado de productos',
                'Generar cargas de stock',
                'Generar descargas de stock',
                'Productos (permiso global)',
                'Ver el listado de cargas y descargas de stock',
                'Stock por Almacén (ver)',
                'Transferencias (ver)',
                'Acceso a la papelera',
                'Restaurar productos eliminados',
                'Ver lotes de productos',
                'Asignar usuario al cargar o descargar stock',
                'Acceder a la herramienta de auditoria',
            ],
        },
    ];

    return (
        <div className="p-6 bg-gray-100 ">
            <h1 className="text-2xl sm:text-3xl font-medium items-center text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <KeyIcon className="w-9 h-9 mr-2" />
                Permisos
            </h1>
            <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
                {sections.map((section, index) => (
                    <div key={index} className="mb-3 border-b border-gray-200 pb-3">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {section.actions.map((action, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border"
                                >
                                    <span className="text-gray-700">{action}</span>
                                    <ToggleSwitchButton />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { PermissionsList };