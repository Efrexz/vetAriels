import { useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { MedicalQueueItem } from '@t/clinical.types';
import { EditQueuePatientModal } from '@components/modals/EditQueuePatientModal';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import BookIcon from '@assets/bookIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';


interface HeadlineOption {
    type: string;
    options: { value: string; label: string }[];
}

const headlinesOptions: HeadlineOption[] = [
    {
        type: "Usuario",
        options: [
            { value: "olga-bustinza", label: "Olga Bustinza" },
            { value: "luis-alvarado", label: "Luis Alvarado" },
            { value: "juan-perez", label: "Juan Pérez" },
        ]
    },
    {
        type: "Estado",
        options: [
            { value: "en-espera", label: "En Espera" },
            { value: "en-atencion", label: "En Atención" },
            { value: "atendido", label: "Atendido" },
            { value: "suspendido", label: "Suspendido" },
        ],
    }
];

const tableHeaders = ["N°", "Fecha de Atención", "Mascota", "Propietario", "Médico Asignado", "Estado", "Alerta", "Opciones"];

// determinar el color de fondo según el estado
function getStateColor(state: string) {
    switch (state) {
        case "En espera":
            return "bg-rose-600";
        case "En atención":
            return "bg-amber-500";
        case "Atendido":
            return "bg-emerald-600";
        case "Suspendido":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
}

function ClinicQueue() {

    const { petsInQueueMedical } = useClients();
    const [isEditQueueModalOpen, setIsEditQueueModalOpen] = useState(false);
    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<MedicalQueueItem | null>(null);
    const [queueDataToEdit, setQueueDataToEdit] = useState<MedicalQueueItem | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const navigate = useNavigate();

    const [filters, setFilters] = useState<Record<string, string>>({
        date: '',
        user: '',
        state: ''
    });
    console.log(petsInQueueMedical);

    // aca si no usemos el useMemo porque tampoco son muchos pacientes en cola de espera
    const filteredPets = petsInQueueMedical.filter(petInQueue => {
        const matchesSearch = searchTerm === '' ||
            petInQueue?.petData?.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            petInQueue?.petData?.ownerName.toLowerCase().includes(searchTerm.toLowerCase())

        // const matchesDate = filters.dateOfAttention === '' || petInQueue?.dateOfAttention === filters.dateOfAttention;
        const matchesUser = filters.user === '' || petInQueue?.assignedDoctor.toLowerCase().includes(filters.user.toLowerCase());
        const matchesState = filters.state === '' || petInQueue?.state.toLowerCase().includes(filters.state.toLowerCase());

        return matchesSearch  && matchesUser && matchesState;
    });


    function handleFilterChange (e: ChangeEvent<HTMLSelectElement> ) { {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    }}

    function openEditModal (queueItem: MedicalQueueItem){
        setQueueDataToEdit(queueItem);
        setIsEditQueueModalOpen(true);
    };

    function openDeleteModal (queueItem: MedicalQueueItem){
        setPatientToDelete(queueItem);
        setIsConfirmActionModalOpen(true);
    };

    return (
        <section className="w-full p-4 sm:p-6 bg-gray-950 text-gray-200">
            <h1 className="text-xl sm:text-2xl font-medium text-cyan-500 mb-4 pb-4 border-b border-cyan-500 flex items-center">
                <BookIcon className="w-8 h-8 sm:w-9 sm:h-9 mr-3 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Sala de Espera</span>
            </h1>
            <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6 border border-gray-700">
                <div className="p-3 rounded-xl mb-4 bg-gray-800 border-2 border-cyan-500/30">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre..."
                                className="w-full py-1 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                            />
                            <input
                                type="date"
                                // value={filters.dateOfAttention}
                                name="date"
                                // onChange={handleFilterChange}
                                className="w-full py-1 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                            />
                        </div>
                        <button
                            className="w-full sm:w-auto border border-gray-700 text-white bg-emerald-600 py-1 px-4 rounded-xl hover:bg-emerald-700 flex items-center gap-2 justify-center whitespace-nowrap transition-colors"
                            onClick={() => navigate("/sales/client/no_client")}
                        >
                            <PlusIcon className="w-4 h-4" />
                            AGREGAR PACIENTE
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {headlinesOptions.map((option, index) => (
                            <div key={index} className="w-full">
                                <select
                                    name={option.type.includes('Usuario') ? 'Usuario' : 'Estado'}
                                    onChange={handleFilterChange}
                                    className="w-full mt-1.5 rounded-xl border-2 border-gray-600 bg-gray-700 text-gray-100 sm:text-sm py-1 px-5 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
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
                                    <th
                                        key={header}
                                        className="py-1 px-4 text-center text-xs font-bold text-gray-300 uppercase tracking-wider border-r border-gray-600 last:border-r-0"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPets.map((petInQueue, index) => (
                                <tr key={petInQueue.id} className="hover:bg-gray-700 transition-colors duration-200">
                                    <td className=" px-4 text-center border-b border-r border-gray-600">
                                        <input type="checkbox" className="form-checkbox bg-gray-900 border-gray-500 text-blue-500 rounded focus:ring-blue-500" />
                                    </td>
                                    <td className=" px-4 text-center border-b border-r border-gray-600">{index + 1}</td>
                                    <td className=" px-4 text-center border-b border-r border-gray-600">
                                        <span className="block">{petInQueue?.dateOfAttention}</span>
                                        <span className="block text-gray-400 text-sm">
                                            {petInQueue?.timeOfAttention}
                                        </span>
                                    </td>
                                    <td className=" px-2 border-b border-r border-gray-600">
                                        <Link to={`/pets/pet/${petInQueue?.petData?.id}/update`}>
                                            <div>{petInQueue?.petData?.petName}</div>
                                            <div className="text-gray-400 text-sm">
                                                {petInQueue?.petData?.breed} - {petInQueue?.petData?.species} -{" "}
                                                {petInQueue?.petData?.sex}
                                            </div>
                                            <div className="text-gray-400 text-sm italic max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                                                Notas: {petInQueue?.notes}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="py-1 px-4 text-center border-b border-r border-gray-600">
                                        <Link
                                            className="text-cyan-500 hover:text-cyan-400 transition-colors cursor-pointer hover:underline"
                                            to={`/clients/client/${petInQueue?.petData?.ownerId}/update`}
                                        >
                                            {petInQueue?.petData?.ownerName}
                                        </Link>
                                    </td>
                                    <td className=" px-4 text-center border-b border-r border-gray-600">{petInQueue?.assignedDoctor}</td>
                                    <td className=" px-4 text-center border-b border-r border-gray-600">
                                        <span
                                            className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-white ${getStateColor(
                                                petInQueue?.state
                                            )} rounded-full cursor-pointer transition-all hover:scale-105`}
                                            onClick={() => openEditModal(petInQueue)}
                                        >
                                            {petInQueue?.state}
                                        </span>
                                    </td>
                                    <td className="py-4 px-8 text-center border-b border-r border-gray-600 ">
                                        <div className="flex justify-center space-x-2 w-full">
                                            <Stethoscope className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-400 transition-colors" />
                                        </div>
                                    </td>
                                    <td className="py-1 px-4 text-center border-b border-r border-gray-600 last:border-r-0">
                                        <div className="flex justify-center space-x-2">
                                            <PenIcon
                                                className="w-4 h-4 text-emerald-500 cursor-pointer hover:text-esmerald-600 transition-colors"
                                                onClick={() => openEditModal(petInQueue)}
                                            />
                                            <TrashIcon
                                                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-400 transition-colors"
                                                onClick={() => openDeleteModal(petInQueue)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Modals */}
                {isEditQueueModalOpen && queueDataToEdit && (
                    <EditQueuePatientModal
                        queueData={queueDataToEdit}
                        onClose={() => setIsEditQueueModalOpen(false)}
                    />
                )}
                {isConfirmActionModalOpen && patientToDelete && (
                    <ConfirmActionModal
                        elementData={patientToDelete}
                        typeOfOperation="medical"
                        onClose={() => setIsConfirmActionModalOpen(false)}
                    />
                )}
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-400 text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {petsInQueueMedical.length} | Total{" "}
                        {petsInQueueMedical.length}
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
        </section>
    );
}

export { ClinicQueue };