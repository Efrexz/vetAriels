import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { EditQueuePatientModal } from '@components/EditQueuePatientModal';
import { ConfirmActionModal } from '@components/ConfirmActionModal';
import BookIcon from '@assets/bookIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';

const headlinesOptions = [
    {
        type: "Cualquier-Usuario",
        options: [
            { value: "olga-bustinza", label: "Olga Bustinza" },
            { value: "luis-alvarado", label: "Luis Alvarado" },
            { value: "juan-perez", label: "Juan Pérez" },
        ]
    },
    {
        type: "Cualquier-Estado",
        options: [
            { value: "en-espera", label: "En Espera" },
            { value: "en-atencion", label: "En Atención" },
            { value: "atendido", label: "Atendido" },
            { value: "suspendido", label: "Suspendido" },
        ],
    }
];

const tableHeaders = ["N°", "Fecha de Atención", "Mascota", "Propietario", "Médico Asignado", "Estado", "Alerta", "Opciones"];

function ClinicQueue() {

    const { petsInQueueMedical } = useContext(ClientsContext);
    const [isEditQueueModalOpen, setIsEditQueueModalOpen] = useState(false);
    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [queueDataToEdit, setQueueDataToEdit] = useState(null);

    const navigate = useNavigate();

    // determinar el color de fondo según el estado
    function getStateColor(state) {
        switch (state) {
            case "En espera":
                return "bg-red-500";
            case "En atención":
                return "bg-orange-500";
            case "Atendido":
                return "bg-green-500";
            case "Suspendido":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    }

    return (
        <section className="container mx-auto p-4 sm:p-6">
            <h1 className="text-xl sm:text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <BookIcon className="w-6 sm:w-9 h-6 sm:h-9 text-red-500 mr-2" />
                Sala de Espera
            </h1>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                className="w-full sm:w-[250px]  py-2 px-4 border-gray-200 border-2 rounded-lg hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                            />
                            <input
                                type="date"
                                className="w-full sm:w-[200px] py-2 px-4 border-gray-200 border-2 rounded-lg hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                            />
                        </div>
                        <button
                            className="w-full sm:w-auto border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2 justify-center whitespace-nowrap"
                            onClick={() => navigate("/sales/client/no_client")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            AGREGAR PACIENTE
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {headlinesOptions.map((option, index) => (
                            <div key={index} className="w-full">
                                <select
                                    name={option.type}
                                    className="w-full mt-1.5 rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2 hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
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

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border">
                                    <input type="checkbox" className="form-checkbox" />
                                </th>
                                {tableHeaders.map((header) => (
                                    <th
                                        key={header}
                                        className={`py-2 px-4 ${header === "Mascota" ? "text-left" : "text-center"
                                            } border font-medium text-gray-700`}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {petsInQueueMedical.map((petInQueue, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center border">
                                        <input type="checkbox" className="form-checkbox" />
                                    </td>
                                    <td className="py-2 px-4 text-center border">{index + 1}</td>
                                    <td className="py-2 px-4 text-center border">
                                        <span className="block">{petInQueue?.dateOfAttention}</span>
                                        <span className="block text-gray-500 text-sm">
                                            {petInQueue?.timeOfAttention}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <Link to={`/pets/pet/${petInQueue?.petData.id}/update`}>
                                            <div>{petInQueue.petData.petName}</div>
                                            <div className="text-gray-500 text-sm">
                                                {petInQueue?.petData.breed} - {petInQueue?.petData.species} -{" "}
                                                {petInQueue?.petData.sex}
                                            </div>
                                            <div className="text-gray-500 text-sm italic">
                                                Notas: {petInQueue?.notes}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 text-center border">
                                        <Link
                                            className="text-blue-500 cursor-pointer hover:underline"
                                            to={`/clients/client/${petInQueue?.petData.ownerId}/update`}
                                        >
                                            {petInQueue?.petData.ownerName}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 text-center border">{petInQueue?.assignedDoctor}</td>
                                    <td className="py-2 px-4 text-center border">
                                        <span
                                            className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-white ${getStateColor(
                                                petInQueue?.state
                                            )} rounded-full cursor-pointer`}
                                            onClick={() => {
                                                setQueueDataToEdit(petInQueue);
                                                setIsEditQueueModalOpen(true);
                                            }}
                                        >
                                            {petInQueue?.state}
                                        </span>
                                    </td>
                                    <td className="px-8 text-center border">
                                        <Stethoscope className="w-5 h-5 text-blue-500 cursor-pointer" />
                                    </td>
                                    <td className="py-8 px-4 text-center border">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <PenIcon
                                                className="w-5 h-5 text-orange-500 cursor-pointer"
                                                onClick={() => {
                                                    setQueueDataToEdit(petInQueue);
                                                    setIsEditQueueModalOpen(true);
                                                }}
                                            />
                                            <TrashIcon
                                                className="w-5 h-5 text-red-500 cursor-pointer"
                                                onClick={() => {
                                                    setPatientToDelete(petInQueue);
                                                    setIsConfirmActionModalOpen(true);
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modals */}
                {isEditQueueModalOpen && (
                    <EditQueuePatientModal
                        queueData={queueDataToEdit}
                        onClose={() => setIsEditQueueModalOpen(false)}
                    />
                )}
                {isConfirmActionModalOpen && (
                    <ConfirmActionModal
                        elementData={patientToDelete}
                        typeOfOperation="medical"
                        onClose={() => setIsConfirmActionModalOpen(false)}
                    />
                )}

                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {petsInQueueMedical.length} | Total{" "}
                        {petsInQueueMedical.length}
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

export { ClinicQueue };