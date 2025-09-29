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
        <div className="flex flex-col w-full">
            <div className="p-2 lg:px-6">
                <div className="bg-gray-800 rounded-lg shadow-lg p-3 w-full border border-gray-700">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                        <button
                            className="bg-emerald-600 text-white py-1.5 px-4 rounded-lg hover:bg-emerald-700 flex items-center gap-3 transition-colors font-semibold"
                            onClick={() => navigate(`/pets/create/${id}`)}
                        >
                            <PlusIcon className="w-5 h-5 text-white" />
                            CREAR NUEVA MASCOTA
                        </button>
                        <button className="bg-gray-700 border border-gray-600 text-gray-300 py-1.5 px-3 rounded-lg hover:bg-gray-600 transition-colors">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto border border-gray-700 rounded-lg hover:cursor-pointer custom-scrollbar">
                        <table className="w-full table-auto bg-gray-800">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="py-1 px-4 text-left border border-gray-600">
                                        <input type="checkbox" className="form-checkbox h-3 w-3 text-cyan-500 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500" />
                                    </th>
                                    {tableHeaders.map((header) => (
                                        <th key={header} className="py-1 px-4 border border-gray-600 text-gray-300 text-center text-xs font-bold">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {petsByOwner.length > 0 ? (
                                    petsByOwner.map((pet) => (
                                        <tr key={pet.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                                            <td className="py-1 px-4 text-center border-b border-gray-600">
                                                <input type="checkbox" className="form-checkbox h-3 w-3 text-cyan-500 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500" />
                                            </td>
                                            <td className="py-1 px-4 border border-gray-600 text-center text-gray-400 text-sm whitespace-nowrap">
                                                <span className="block">{pet.registrationDate}</span>
                                                <span className="block text-gray-500">{pet.registrationTime}</span>
                                            </td>
                                            <td className="py-1 px-4 border border-gray-600 text-center text-gray-400 font-medium">{pet.hc}</td>
                                            <td className="py-1 px-4 border border-gray-600 text-center text-gray-400">{pet.petName}</td>
                                            <td className="py-1 px-4 border border-gray-600 text-center text-gray-400 text-sm whitespace-nowrap">{pet.species} - {pet.breed}</td>
                                            <td className="py-1 px-4 border border-gray-600 text-center text-gray-400 text-sm">{pet.sex}</td>
                                            <td className="py-1 px-4 border border-gray-600 text-center text-gray-400 text-sm whitespace-nowrap">{pet.birthDate}</td>
                                            <td className="py-1 px-4 border border-gray-600">
                                                <div className="flex justify-center items-center h-full space-x-2">
                                                    <Link to={`/pets/pet/${pet.id}/update`} className="text-yellow-500 hover:text-yellow-400 transition-colors">
                                                        <SearchIcon className="w-5 h-5 cursor-pointer" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={tableHeaders.length + 2} className="text-center py-10 text-gray-400">
                                            Este cliente aún no tiene mascotas registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                        <p className="text-gray-400 text-center md:text-left text-sm">
                            Página: 1 de 1 | Registros del 1 al {petsData.length} | Total{" "}
                            {petsData.length}
                        </p>
                        <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                            <button className="py-1 px-3 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Primera</button>
                            <button className="py-1 px-3 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Anterior</button>
                            <button className="py-1 px-3 border border-gray-600 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">1</button>
                            <button className="py-1 px-3 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Siguiente</button>
                            <button className="py-1 px-3 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Última</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { ClientPets };

