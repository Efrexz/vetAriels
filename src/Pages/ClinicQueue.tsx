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
function getStateStyle(state: string) {
    switch (state) {
        case "En espera":
            return "bg-danger/10 text-danger";
        case "En atención":
            return "bg-amber/10 text-amber";
        case "Atendido":
            return "bg-success/10 text-success";
        case "Suspendido":
            return "bg-slate-100 text-slate";
        default:
            return "bg-slate-100 text-slate";
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
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Atenci&oacute;n cl&iacute;nica
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Sala de Espera
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre..."
                                className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink placeholder:text-slate/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                            <input
                                type="date"
                                name="date"
                                className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                        </div>
                        <button
                            className="ml-auto border border-slate-200 text-white bg-primary py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 justify-center whitespace-nowrap transition-colors font-semibold font-display shadow-sm shadow-primary/25 w-full sm:w-auto"
                            onClick={() => navigate("/sales/client/no_client")}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Agregar paciente
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {headlinesOptions.map((option, index) => (
                            <div key={index} className="w-full">
                                <select
                                    name={option.type.includes('Usuario') ? 'Usuario' : 'Estado'}
                                    onChange={handleFilterChange}
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
                                    <th
                                        key={header}
                                        className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPets.map((petInQueue, index) => (
                                <tr key={petInQueue.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center">
                                        <input type="checkbox" className="form-checkbox h-4 w-4 bg-white border-slate-300 rounded focus:ring-primary" />
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm font-semibold font-display text-ink">{index + 1}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="block text-sm text-ink">{petInQueue?.dateOfAttention}</span>
                                        <span className="block text-xs text-slate">
                                            {petInQueue?.timeOfAttention}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <Link to={`/pets/pet/${petInQueue?.petData?.id}/update`}>
                                            <div className="text-sm font-semibold text-ink">{petInQueue?.petData?.petName}</div>
                                            <div className="text-xs text-slate">
                                                {petInQueue?.petData?.breed} &middot; {petInQueue?.petData?.species} &middot;{" "}
                                                {petInQueue?.petData?.sex}
                                            </div>
                                            {petInQueue?.notes && (
                                                <div className="text-xs text-slate italic max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                                                    {petInQueue?.notes}
                                                </div>
                                            )}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            className="text-sm text-primary hover:underline cursor-pointer"
                                            to={`/clients/client/${petInQueue?.petData?.ownerId}/update`}
                                        >
                                            {petInQueue?.petData?.ownerName}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-ink">{petInQueue?.assignedDoctor}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-all hover:scale-105 ${getStateStyle(
                                                petInQueue?.state
                                            )}`}
                                            onClick={() => openEditModal(petInQueue)}
                                        >
                                            {petInQueue?.state}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center">
                                            <button className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                                                <Stethoscope className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-1">
                                            <button
                                                className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors"
                                                onClick={() => openEditModal(petInQueue)}
                                            >
                                                <PenIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1.5 rounded-lg text-slate hover:text-danger hover:bg-danger/10 transition-colors"
                                                onClick={() => openDeleteModal(petInQueue)}
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
                <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
                    <p className="text-slate text-sm">
                        Registros 1&ndash;{petsInQueueMedical.length} de {petsInQueueMedical.length}
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

export { ClinicQueue };