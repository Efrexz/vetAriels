import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { Pet } from '@t/client.types';
import { DeleteModal } from '@components/modals/DeleteModal';
import PlusIcon from '@assets/plusIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';

interface FilterOption {
    value: string;
    label: string;
}

interface HeadlineOptionConfig {
    type: string;
    options: FilterOption[];
}

const headlinesOptions : HeadlineOptionConfig[] = [
    {
        type: "Especie",
        options: [
            { value: "perro", label: "Perro" },
            { value: "gato", label: "Gato" },
        ]
    },
    {
        type: "Raza",
        options: [
            { value: "labrador-retriever", label: "Labrador Retriever" },
            { value: "bulldog-ingles", label: "Bulldog Inglés" },
            { value: "pastor-aleman", label: "Pastor Alemán" },
            { value: "beagle", label: "Beagle" },
            { value: "golden-retriever", label: "Golden Retriever" },
            { value: "bulldog-frances", label: "Bulldog Francés" },
            { value: "poodle", label: "Poodle" },
            { value: "rottweiler", label: "Rottweiler" },
            { value: "yorkshire-terrier", label: "Yorkshire Terrier" },
            { value: "dachshund", label: "Dachshund" },
            { value: "chihuahua", label: "Chihuahua" },
            { value: "doberman", label: "Doberman" },
            { value: "boxer", label: "Boxer" },
            { value: "pug", label: "Pug" },
            { value: "border-collie", label: "Border Collie" },
            { value: "schnauzer", label: "Schnauzer" },
            { value: "akita", label: "Akita" },
            { value: "maltes", label: "Maltés" },
            { value: "shih-tzu", label: "Shih Tzu" },
            { value: "cocker-spaniel", label: "Cocker Spaniel" },
            { value: "boston-terrier", label: "Boston Terrier" },
            { value: "husky-siberiano", label: "Husky Siberiano" },
            { value: "dalmata", label: "Dálmata" },
            { value: "caniche", label: "Caniche" },
            { value: "shiba-inu", label: "Shiba Inu" },
            { value: "weimaraner", label: "Weimaraner" },
            { value: "gran-danes", label: "Gran Danés" },
            { value: "mastin-napolitano", label: "Mastín Napolitano" },
            { value: "bichon-frise", label: "Bichón Frisé" },
            { value: "samoyedo", label: "Samoyedo" },
            { value: "collie", label: "Collie" },
            { value: "cavalier-king-charles", label: "Cavalier King Charles" },
            { value: "bull-terrier", label: "Bull Terrier" },
            { value: "galgo", label: "Galgo" },
            { value: "west-highland-white-terrier", label: "West Highland White Terrier" },
            { value: "bulldog-americano", label: "Bulldog Americano" },
            { value: "rottweiler", label: "Rottweiler" },
            { value: "pastor-belga", label: "Pastor Belga" },
            { value: "basset-hound", label: "Basset Hound" },
            { value: "shetland-sheepdog", label: "Shetland Sheepdog" },
            { value: "terrier-airedale", label: "Terrier Airedale" },
            { value: "terrier-irlandes", label: "Terrier Irlandés" },
            { value: "springer-spaniel", label: "Springer Spaniel" },
            { value: "cane-corso", label: "Cane Corso" },
            { value: "pekingese", label: "Pekinese" },
            { value: "french-bulldog", label: "French Bulldog" },
            { value: "saint-bernard", label: "San Bernardo" },
        ],
    },
    {
        type: "Sexo",
        options: [
            { value: "macho", label: "Macho" },
            { value: "hembra", label: "Hembra" },
        ],
    },
];

const tableHeaders: string[] = ["Fecha de Registro", "#H.C", "Nombre", "Especie", "Raza", "Genero", "Fecha de Nacimiento", "Cliente", "Estado", "Opciones"];

function PetsData() {

    const { petsData } = useClients();

    const [petsDataToDelete, setPetsDataToDelete] = useState<Pet | null>(null);
    const navigate = useNavigate();
    return (
        <section className=" w-full p-1 md:p-6 bg-gray-950 text-gray-200">
            <h1 className="text-xl md:text-2xl font-medium mb-4 pb-4 border-b border-cyan-500 flex items-center">
                <PawIcon className="w-8 h-8 sm:w-9 sm:h-9 mr-3 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Mascotas</span>
            </h1>
            <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6 border border-gray-700">
                <div className="p-4 rounded-xl mb-4 bg-gray-800 border-2 border-cyan-500/30">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                className="w-full py-1 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                            />
                            <input
                                type="date"
                                className="w-full py-1 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                            />
                        </div>
                        <button
                            className="w-full sm:w-auto border border-gray-700 text-white bg-emerald-600 py-1 px-4 rounded-xl hover:bg-emerald-700 flex items-center gap-2 justify-center whitespace-nowrap transition-colors"
                            onClick={() => navigate("/pets/create/no_client")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            CREAR NUEVA MASCOTA
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {headlinesOptions.map((option, index) => (
                            <div key={index} className="w-full">
                                <select
                                    name={option.type}
                                    className="w-full mt-1.5 rounded-xl border-2 border-gray-600 bg-gray-700 text-gray-100 sm:text-sm py-1.5 px-5 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                                >
                                    <option value="">{option.type}</option>
                                    {option.options.map((option, idx) => (
                                        <option key={idx} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-700 rounded-lg">
                    <table className="min-w-full bg-gray-800">
                        <thead className="bg-gray-700 border-b border-gray-600">
                            <tr>
                                <th className="py-1 px-4 text-left border-r border-gray-600">
                                    <input type="checkbox" className="form-checkbox bg-gray-900 border-gray-500 text-blue-500 rounded focus:ring-blue-500" />
                                </th>
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-1 px-4 ${header === "Mascota" ? "text-left" : "text-center"} border-r border-gray-600 text-sm font-bold text-gray-300 last:border-r-0`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {petsData.map((petData) => (
                                <tr key={petData.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200 text-sm">
                                    <td className=" px-4 text-center border-b border-r border-gray-600">
                                        <input type="checkbox" className="form-checkbox bg-gray-900 border-gray-500 text-blue-500 rounded focus:ring-blue-500" />
                                    </td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">
                                        <div>{petData.registrationDate}</div>
                                        <div className="text-gray-500">{petData.registrationTime}</div>
                                    </td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400 font-medium">{petData.hc}</td>
                                    <td className=" px-4 text-left border border-gray-600 text-gray-400">{petData.petName}</td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">{petData.species}</td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">{petData.breed}</td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">{petData.sex}</td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400 whitespace-nowrap">{petData.birthDate}</td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">{petData.ownerName}</td>
                                    <td className=" px-4 text-center border border-gray-600">
                                        <span
                                            className={`inline-block w-4 h-4 rounded-full ${petData.active ? "bg-green-500" : "bg-red-500"}`}
                                        />
                                    </td>
                                    <td className="py-1 px-4 border-b border-r border-gray-600 space-x-2">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <Link to={`/pets/pet/${petData.id}/update`}>
                                            <SearchIcon className="w-5 h-5 text-yellow-500 hover:text-yellow-400 transition-colors cursor-pointer" />
                                        </Link>
                                        <Stethoscope className="w-4 h-4 text-blue-500 hover:text-blue-400 transition-colors cursor-pointer" />
                                        <TrashIcon
                                            className="w-4 h-4 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                                            onClick={() => { setPetsDataToDelete(petData) }}
                                        />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {
                    petsDataToDelete && (
                        <DeleteModal
                            elementToDelete={petsDataToDelete}
                            onClose={() => setPetsDataToDelete(null)}
                            mode="pets"
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-400 text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {petsData.length} | Total{" "}
                        {petsData.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Primera</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Anterior</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">1</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Siguiente</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { PetsData };