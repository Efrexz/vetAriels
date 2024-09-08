import { HorizontalMenu } from '../components/HorizontalMenu';
import RoleUserIcon from '../assets/roleUserIcon.svg?react';
import SearchIcon from '../assets/searchIcon.svg?react';
import PlusIcon from '../assets/plusIcon.svg?react';
import RefreshIcon from '../assets/refreshIcon.svg?react';

function ClientPets() {

    const tableHeaders = [
        "Fecha de Registro",
        "#HC",
        "Nombre",
        "Especie - Raza",
        "Sexo",
        "Fecha de Nacimiento",
        "Opciones",
    ];

    const petsInfo = [
        {
            registrationDate: '29-07-2024',
            registrationTime: '11:00 AM',
            hc: '123456',
            name: 'Canela',
            species: "Canino",
            breed: "Mestizo",
            sex: "MACHO",
            birthDate: '29-07-2024',
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-5">
                <h1 className="text-2xl font-semibold text-gray-800">Mascotas del Cliente</h1>
                <HorizontalMenu />
            </div>

            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-t-lg overflow-hidden">
                <div className="w-full md:w-1/4 p-6 bg-gray-100 flex flex-col items-center justify-center mr-3">
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Maduro Presidente xd</h2>
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                        <span className="mr-2">&#x1F6AB;</span> Correo electrónico no confirmado
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3">
                            <PlusIcon className="w-5 h-5 text-white" />
                            CREAR NUEVA MASCOTA
                        </button>
                        <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto border border-gray-300 rounded-lg">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 text-left border">
                                        <input type="checkbox" className="form-checkbox" />
                                    </th>
                                    {tableHeaders.map((header) => (
                                        <th key={header} className="py-2 px-4 border text-gray-700 text-center">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {petsInfo.map((petData, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 text-center border">
                                            <input type="checkbox" className="form-checkbox" />
                                        </td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.registrationDate}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.hc}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.name}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.species}-{petData.breed}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.birthDate}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.birthDate}</td>
                                        <td className="py-3 px-4 text-center border flex justify-center">
                                            <SearchIcon className="w-5 h-5 text-green-500 cursor-pointer" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4 ">
                        <p className="text-gray-600">Página: 1 de 1 | Registros del 1 al 4 | Total 4</p>
                        <div className="flex space-x-2">
                            <button className="py-2 px-4 border rounded">Primera</button>
                            <button className="py-2 px-4 border rounded">Anterior</button>
                            <button className="py-2 px-4 border rounded bg-blue-500 text-white">1</button>
                            <button className="py-2 px-4 border rounded">Siguiente</button>
                            <button className="py-2 px-4 border rounded">Última</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export { ClientPets };

