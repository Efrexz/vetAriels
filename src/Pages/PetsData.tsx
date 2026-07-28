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
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Gesti&oacute;n de mascotas
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Mascotas
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink placeholder:text-slate/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                            <input
                                type="date"
                                className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                        </div>
                        <button
                            className="ml-auto border border-slate-200 text-white bg-primary py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 justify-center whitespace-nowrap transition-colors font-semibold font-display shadow-sm shadow-primary/25 w-full sm:w-auto"
                            onClick={() => navigate("/pets/create/no_client")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nueva mascota
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {headlinesOptions.map((option, index) => (
                            <div key={index} className="w-full">
                                <select
                                    name={option.type}
                                    className="w-full rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
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

                <div className="overflow-x-auto">
                    <table className="min-w-full">
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
                            {petsData.map((petData) => (
                                <tr key={petData.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center">
                                        <input type="checkbox" className="form-checkbox h-4 w-4 bg-white border-slate-300 rounded focus:ring-primary" />
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">
                                        <div>{petData.registrationDate}</div>
                                        <div className="text-xs">{petData.registrationTime}</div>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-semibold font-display">{petData.hc}</td>
                                    <td className="py-3 px-4 text-left text-sm text-ink font-medium">{petData.petName}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{petData.species}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{petData.breed}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{petData.sex}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate whitespace-nowrap">{petData.birthDate}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{petData.ownerName}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`inline-block w-3 h-3 rounded-full ${petData.active ? "bg-success" : "bg-danger"}`}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <Link to={`/pets/pet/${petData.id}/update`}>
                                                <button
                                                    aria-label={`Ver ${petData.petName}`}
                                                    className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors"
                                                >
                                                    <SearchIcon className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button
                                                aria-label={`Historia cl&iacute;nica de ${petData.petName}`}
                                                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                <Stethoscope className="w-4 h-4" />
                                            </button>
                                            <button
                                                aria-label={`Eliminar ${petData.petName}`}
                                                className="p-1.5 rounded-lg text-slate hover:text-danger hover:bg-danger/10 transition-colors"
                                                onClick={() => { setPetsDataToDelete(petData) }}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
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
        </section>
    );
}

export { PetsData };