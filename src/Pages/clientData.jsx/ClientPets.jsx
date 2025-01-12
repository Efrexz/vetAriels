import { Link, useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { useContext } from 'react';
import SearchIcon from '@assets/searchIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import RefreshIcon from '@assets/refreshIcon.svg?react';

function ClientPets() {

    const navigate = useNavigate();
    const { petsData } = useContext(ClientsContext);
    const { id } = useParams();
    const petsByOwner = petsData.filter(pet => pet.ownerId === Number(id));

    const tableHeaders = [
        "Fecha de Registro",
        "#HC",
        "Nombre",
        "Especie - Raza",
        "Sexo",
        "Fecha de Nacimiento",
        "Opciones",
    ];

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
                                {petsByOwner.map((petData, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 text-center border">
                                            <input type="checkbox" className="form-checkbox" />
                                        </td>
                                        <td className="py-2 px-4 border-b text-center border whitespace-nowrap">
                                            <span className="block">{petData.registrationDate}</span>
                                            <span className="block">{petData.registrationTime}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b text-center border">{petData.hc}</td>
                                        <td className="py-2 px-4 border-b text-center border">{petData.petName}</td>
                                        <td className="py-2 px-4 border-b text-center border whitespace-nowrap">{petData.species}-{petData.breed}</td>
                                        <td className="py-2 px-4 border-b text-center border">{petData.sex}</td>
                                        <td className="py-2 px-4 border-b text-center border whitespace-nowrap">{petData.birthDate}</td>
                                        <td className="py-6 px-4 text-center border flex justify-center">
                                            <Link to={`/pets/pet/${petData.id}/update`}>
                                                <SearchIcon className="w-5 h-5 text-green-500 cursor-pointer" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
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

