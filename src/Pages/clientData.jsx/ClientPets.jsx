import { Link, useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '../../context/ClientsContext';
import { useContext } from 'react';
import SearchIcon from '../../assets/searchIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import RefreshIcon from '../../assets/refreshIcon.svg?react';

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
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-t-lg overflow-hidden px-10 py-4">
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center space-x-4 mb-4">
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
                                {petsByOwner.map((petData, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 text-center border">
                                            <input type="checkbox" className="form-checkbox" />
                                        </td>
                                        <td className="py-2 px-4 border-b text-center border ">
                                            <span className='block'>{petData.registrationDate}</span>
                                            <span className='block'>{petData.registrationTime}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.hc}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.petName}</td>
                                        <td className="py-2 px-4 border-b text-center border whitespace-nowrap">{petData.species}-{petData.breed}</td>
                                        <td className="py-2 px-4 border-b text-center border ">{petData.sex}</td>
                                        <td className="py-2 px-4 border-b text-center border whitespace-nowrap ">{petData.birthDate}</td>
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

