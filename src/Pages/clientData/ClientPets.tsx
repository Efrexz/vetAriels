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
                <div className="bg-paper rounded-2xl shadow-sm p-5 w-full border border-slate-200">
                    <div className="flex flex-row justify-center sm:justify-start items-center gap-3 mb-4">
                        <button
                            className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25"
                            onClick={() => navigate(`/pets/create/${id}`)}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nueva mascota
                        </button>
                        <button className="border border-slate-200 text-slate py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto hover:cursor-pointer custom-scrollbar">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 px-4 text-left w-8">
                                        <input type="checkbox" className="form-checkbox h-4 w-4 bg-white border-slate-300 rounded focus:ring-primary" />
                                    </th>
                                    {tableHeaders.map((header) => (
                                        <th key={header} className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {petsByOwner.length > 0 ? (
                                    petsByOwner.map((pet) => (
                                        <tr key={pet.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4 text-center">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 bg-white border-slate-300 rounded focus:ring-primary" />
                                            </td>
                                            <td className="py-3 px-4 text-center text-sm text-slate whitespace-nowrap">
                                                <span className="block">{pet.registrationDate}</span>
                                                <span className="block text-xs text-slate">{pet.registrationTime}</span>
                                            </td>
                                            <td className="py-3 px-4 text-center text-sm text-ink font-semibold font-display">{pet.hc}</td>
                                            <td className="py-3 px-4 text-center text-sm text-ink font-medium">{pet.petName}</td>
                                            <td className="py-3 px-4 text-center text-sm text-slate whitespace-nowrap">{pet.species} &middot; {pet.breed}</td>
                                            <td className="py-3 px-4 text-center text-sm text-slate">{pet.sex}</td>
                                            <td className="py-3 px-4 text-center text-sm text-slate whitespace-nowrap">{pet.birthDate}</td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex justify-center">
                                                    <Link to={`/pets/pet/${pet.id}/update`} className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors">
                                                        <SearchIcon className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={tableHeaders.length + 2} className="text-center py-10 text-slate text-sm">
                                            Este cliente a&uacute;n no tiene mascotas registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
                        <p className="text-slate text-sm">
                            Registros 1&ndash;{petsData.length} de {petsData.length}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Primera</button>
                            <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Anterior</button>
                            <button className="py-1.5 px-3 rounded-lg text-sm bg-primary text-white font-semibold transition-colors">1</button>
                            <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Siguiente</button>
                            <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">&Uacute;ltima</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { ClientPets };

