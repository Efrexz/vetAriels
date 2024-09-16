import { useState } from 'react';
import TrashIcon from '../../assets/trashIcon.svg?react';
import RefreshIcon from '../../assets/refreshIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import UserGroupIcon from '../../assets/userGroupIcon.svg?react';


const usersData = [
    { id: 1, name: 'Juan Perez', email: 'juanperez@gmail.com', role: 'Administrador', status: true, dateRegistered: '2022-05-01', timeRegistered: '20:00' },
    { id: 2, name: 'Maria Perez', email: 'mariaperez@gmail.com', role: 'Administrador', status: true, dateRegistered: '2022-05-01', timeRegistered: '20:00' },
    { id: 3, name: 'Carlos Perez', email: 'carlosperez@gmail.com', role: 'Administrador', status: false, dateRegistered: '2022-05-01', timeRegistered: '20:00' },
];


const tableHeaders = ["Fecha de creación", "Nombre y Apellidos", "Correo", "Rol", "Estado", "Opciones"];

function Users() {
    const [users, setUsers] = useState(usersData);

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <UserGroupIcon className="w-9 h-9 mr-2" />
                Usuarios
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="overflow-x-auto border border-gray-300 rounded-lg p-3">
                    <div className='flex gap-2'>
                        <button
                            className="border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2 mb-4"
                        >
                            <PlusIcon className="w-5 h-5" />
                            AGREGAR USUARIO
                        </button>
                        <button className="bg-transparent border border-gray-300 px-4 py-2 text-gray-700 rounded hover:bg-gray-200">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 text-center border font-medium text-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center border">{user.dateRegistered}</td>
                                    <td className="py-2 px-4 text-center border">{user.name}</td>
                                    <td className="py-2 px-4 text-center border">{user.email}</td>
                                    <td className="py-2 px-4 text-center border">{user.role}</td>
                                    <td className="py-2 px-4 text-center border ">
                                        <span
                                            className={`inline-block cursor-pointer py-0.5 px-4 text-white rounded-full ${user.status ? "bg-green-500" : "bg-red-500"}`}
                                        >
                                            {user.status ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center border flex justify-center">
                                        <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-600">Página: 1 de 1 | Registros del 1 al 2 | Total 2</p>
                    <div className="flex space-x-2">
                        <button className="py-2 px-4 border rounded">Primera</button>
                        <button className="py-2 px-4 border rounded">Anterior</button>
                        <button className="py-2 px-4 border rounded bg-blue-500 text-white">1</button>
                        <button className="py-2 px-4 border rounded">Siguiente</button>
                        <button className="py-2 px-4 border rounded">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Users };