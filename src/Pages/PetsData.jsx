import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { DeleteModal } from '@components/DeleteModal';
import PlusIcon from '@assets/plusIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';


const headlinesOptions = [
    {
        type: "Especie",
        options: [
            { value: "perro", label: "Perro" },
            { value: "gato", label: "Gato" },
            { value: "ave", label: "Ave" },
            { value: "roedor", label: "Roedor" },
            { value: "reptil", label: "Reptil" },
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

const tableHeaders = ["Fecha de Registro", "#H.C", "Nombre", "Especie", "Raza", "Genero", "Fecha de Nacimiento", "Cliente", "Estado", "Opciones"];

function PetsData() {

    const { petsData } = useContext(ClientsContext);

    const [petsDataToDelete, setPetsDataToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-xl md:text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <PawIcon className="w-6 md:w-9 h-6 md:h-9 text-blue-500 mr-2" />
                Mascotas
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="w-full sm:w-auto flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar ..."
                                className="w-full sm:w-[350px] py-2 px-4 border-gray-200 border rounded-lg focus:outline-none focus:border-blue-300"
                            />
                        </div>
                        <button
                            className="w-full sm:w-auto border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2 justify-center"
                            onClick={() => navigate("/pets/create/no_client")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            CREAR NUEVA MASCOTA
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {headlinesOptions.map((option, index) => (
                            <div key={index} className="w-full sm:w-[250px] flex gap-2">
                                <select
                                    name={option.type}
                                    className="w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2"
                                >
                                    <option value="">{option.type}</option>
                                    {option.options.map((subOption, subIndex) => (
                                        <option key={subIndex} value={subOption.value}>
                                            {subOption.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border">
                                    <input type="checkbox" className="form-checkbox" />
                                </th>
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-2 px-4 ${header === "Mascota" ? "text-left" : "text-center"} border font-medium text-gray-700`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {petsData.map((petData, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center border">
                                        <input type="checkbox" className="form-checkbox" />
                                    </td>
                                    <td className="py-2 px-4 text-center border">
                                        <div>{petData.registrationDate}</div>
                                        <div>{petData.registrationTime}</div>
                                    </td>
                                    <td className="py-2 px-4 text-center border">{petData.hc}</td>
                                    <td className="py-2 px-4 text-center border">{petData.petName}</td>
                                    <td className="py-2 px-4 text-center border">{petData.species}</td>
                                    <td className="py-2 px-4 text-center border">{petData.breed}</td>
                                    <td className="py-2 px-4 text-center border">{petData.sex}</td>
                                    <td className="py-2 px-4 text-center border whitespace-nowrap">{petData.birthDate}</td>
                                    <td className="py-2 px-4 text-center border">{petData.ownerName}</td>
                                    <td className="py-2 px-4 text-center border ">
                                        <span
                                            className={`inline-block cursor-pointer w-4 h-4 rounded-full ${petData.active ? "bg-green-500" : "bg-red-500"}`}
                                        />
                                    </td>
                                    <td className="py-10 px-4 text-center border flex justify-center space-x-2">
                                        <Link to={`/pets/pet/${petData.id}/update`}>
                                            <SearchIcon className="w-5 h-5 text-green-500 cursor-pointer" />
                                        </Link>
                                        <Stethoscope className="w-4 h-4 text-blue-500 cursor-pointer" />
                                        <TrashIcon
                                            className="w-4 h-4 text-red-500 cursor-pointer"
                                            onClick={() => {
                                                setPetsDataToDelete(petData)
                                                setIsDeleteModalOpen(true)
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {
                    isDeleteModalOpen && (
                        <DeleteModal
                            elementToDelete={petsDataToDelete}
                            onClose={() => setIsDeleteModalOpen(false)}
                            mode="pets"
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
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
        </section>
    );
}

export { PetsData };