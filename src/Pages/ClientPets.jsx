import SearchIcon from '../assets/searchIcon.svg?react';
import PlusIcon from '../assets/plusIcon.svg?react';
import RefreshIcon from '../assets/refreshIcon.svg?react';
import { useNavigate } from 'react-router-dom';

function ClientPets() {

    const navigate = useNavigate();

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
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-t-lg overflow-hidden px-10 py-4">
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                            onClick={() => navigate("/clients/create")}
                        >
                            <PlusIcon className="w-5 h-5 text-white" />
                            CREAR NUEVA MASCOTA
                        </button>
                        <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto border border-gray-300 rounded-lg hover:cursor-pointer">
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
                                        <td className="py-2 px-4 border-b text-center border whitespace-nowrap ">{petData.registrationDate}-{petData.registrationTime}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.hc}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.name}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.species}-{petData.breed}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.sex}</td>
                                        <td className="py-2 px-4 border-b text-center border whitespace-nowrap ">{petData.birthDate}</td>
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

