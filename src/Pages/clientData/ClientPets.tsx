import { Link, useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { Pet } from '@t/client.types';
import SearchIcon from '@assets/searchIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import RefreshIcon from '@assets/refreshIcon.svg?react';

const tableHeaders: string[] = [
    "Fecha de Registro",
    "#HC",
    "Nombre",
    "Especie - Raza",
    "Sexo",
    "Fecha de Nacimiento",
    "Opciones",
];

function ClientPets() {

    const navigate = useNavigate();
    const { petsData } = useClients();
    const { id } = useParams<{ id: string }>();
    const petsByOwner : Pet[] = petsData.filter(pet => pet.ownerId === id);

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-t-lg p-2 lg:px-10">
                <div className="bg-white rounded-lg shadow p-2 mb-6 w-full">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                            onClick={() => navigate(`/pets/create/${id}`)}
                        >
                            <PlusIcon className="w-5 h-5 text-white" />
                            CREAR NUEVA MASCOTA
                        </button>
                        <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto border border-gray-300 rounded-lg hover:cursor-pointer custom-scrollbar">
                        <table className="w-full table-auto bg-white">
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
                                {petsByOwner.length > 0 ? (
                                    petsByOwner.map((pet) => (
                                        <tr key={pet.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="py-2 px-4 text-center border-b">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                                            </td>
                                            <td className="py-2 px-4 border-b text-center text-gray-700 text-sm whitespace-nowrap">
                                                <span className="block">{pet.registrationDate}</span>
                                                <span className="block text-gray-500">{pet.registrationTime}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b text-center text-gray-700 font-medium">{pet.hc}</td>
                                            <td className="py-2 px-4 border-b text-center text-gray-700">{pet.petName}</td>
                                            <td className="py-2 px-4 border-b text-center text-gray-700 text-sm whitespace-nowrap">{pet.species} - {pet.breed}</td>
                                            <td className="py-2 px-4 border-b text-center text-gray-700 text-sm">{pet.sex}</td>
                                            <td className="py-2 px-4 border-b text-center text-gray-700 text-sm whitespace-nowrap">{pet.birthDate}</td>
                                            <td className="py-4 px-4 text-center border-b flex justify-center">
                                                <Link to={`/pets/pet/${pet.id}/update`} className="text-green-500 hover:text-green-700">
                                                    <SearchIcon className="w-5 h-5 cursor-pointer" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={tableHeaders.length + 2} className="text-center py-10 text-gray-500">
                                            Este cliente aún no tiene mascotas registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col xl:flex-row justify-between items-center mt-4 gap-4">
                        <p className="text-gray-600 text-center md:text-left">
                            Página: 1 de 1 | Registros del 1 al {petsData.length} | Total{" "}
                            {petsData.length}
                        </p>
                        <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
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

