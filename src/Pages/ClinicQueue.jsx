import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { EditQueuePatientModal } from '@components/EditQueuePatientModal';
import { ConfirmActionModal } from '@components/ConfirmActionModal';
import EraserIcon from '@assets/eraserIcon.svg?react';
import RefreshIcon from '@assets/refreshIcon.svg?react';
import PDFIcon from '@assets/pdfIcon.svg?react';
import BookIcon from '@assets/bookIcon.svg?react';
import ExcelIcon from '@assets/fileExcelIcon.svg?react';
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
            { value: "citado", label: "Citado" },
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
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <BookIcon className="w-9 h-9 text-red-500 mr-2" />
                Sala de Espera
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-auto flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                className="w-[350px] py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="date"
                                className="w-[350px] py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                                <EraserIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                                <RefreshIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-orange-500 py-2 px-4 rounded hover:bg-gray-200">
                                <PDFIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-green-600 py-2 px-4 rounded hover:bg-gray-200">
                                <ExcelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            className="border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2"
                            onClick={() => navigate("/sales/client/no_client")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            AGREGAR PACIENTE
                        </button>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                        {
                            headlinesOptions.map((option, index) => (
                                <div key={index} className=" w-[250px] flex gap-2">
                                    <select
                                        name={option.type}
                                        className="mt-1.5 w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2"
                                    >
                                        <option value="">{option.type}</option>
                                        {option.options.map((option, index) => (
                                            <option key={index} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))
                        }
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
                            {petsInQueueMedical.map((petInQueue, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center border">
                                        <input type="checkbox" className="form-checkbox" />
                                    </td>
                                    <td className="py-2 px-4 text-center border">{index + 1}</td>
                                    <td className="py-2 px-4 text-center border">
                                        <span className="block">{petInQueue?.dateOfAttention}</span>
                                        <span className="block text-gray-500 text-sm">{petInQueue?.timeOfAttention}</span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <Link to={`/pets/pet/${petInQueue?.petData.id}/update`}>
                                            <div>{petInQueue.petData.petName}</div>
                                            <div className="text-gray-500 text-sm">
                                                {petInQueue?.petData.breed}-{petInQueue?.petData.species}-{petInQueue?.petData.sex}
                                            </div>
                                            <div className="text-gray-500 text-sm italic">Notas: {petInQueue?.notes}</div>
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 text-center border ">
                                        <Link className='text-blue-500 cursor-pointer hover:underline' to={`/clients/client/${petInQueue?.petData.ownerId}/update`}>
                                            {petInQueue?.petData.ownerName}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 text-center border">{petInQueue?.assignedDoctor}</td>
                                    <td className="py-2 px-4 text-center border">
                                        <span
                                            className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-white ${getStateColor(petInQueue?.state)} rounded-full cursor-pointer`}
                                            onClick={() => {
                                                setQueueDataToEdit(petInQueue)
                                                setIsEditQueueModalOpen(true)
                                            }
                                            }
                                        >
                                            {petInQueue?.state}
                                        </span>
                                    </td>
                                    <td className="px-8 text-center border justify-center">
                                        <Stethoscope className="w-5 h-5 text-blue-500 cursor-pointer" />
                                    </td>
                                    <td className="py-10 px-4 text-center border flex justify-center space-x-2">
                                        <PenIcon
                                            className="w-4 h-4 text-orange-500 cursor-pointer"
                                            onClick={() => {
                                                setQueueDataToEdit(petInQueue)
                                                setIsEditQueueModalOpen(true)
                                            }}
                                        />
                                        <Stethoscope className="w-4 h-4 text-blue-500 cursor-pointer" />
                                        <TrashIcon
                                            className="w-4 h-4 text-red-500 cursor-pointer"
                                            onClick={() => {
                                                setPatientToDelete(petInQueue)
                                                setIsConfirmActionModalOpen(true)
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {
                    isEditQueueModalOpen && (
                        <EditQueuePatientModal
                            queueData={queueDataToEdit}
                            onClose={() => setIsEditQueueModalOpen(false)}
                        />
                    )
                }

                {
                    isConfirmActionModalOpen && (
                        <ConfirmActionModal
                            elementData={patientToDelete}
                            typeOfOperation="medical"
                            onClose={() => setIsConfirmActionModalOpen(false)}
                        />
                    )
                }
                <div className="flex justify-between items-center mt-4">
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
        </section>
    );
}

export { ClinicQueue };