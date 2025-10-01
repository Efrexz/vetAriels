import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { GroomingQueueItem } from '@t/clinical.types';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import { UpdateStateModal } from '@components/modals/UpdateStateModal';
import BathIcon from '@assets/bathIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import BanIcon from '@assets/banIcon.svg?react';

type OperationType = "finishGrooming" | "deleteGrooming";

type GroomingState = GroomingQueueItem['state']

const tableHeaders = ["Turno", "Fecha", "Entrada", "Salida", "Cliente", "Mascota", "Raza", "Servicios", "Estado", "Opciones"];

function ActiveOrdersGrooming() {

    const { petsInQueueGrooming } = useClients();
    const navigate = useNavigate();

    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState<boolean>(false);
    const [isUpdateStateModalOpen, setIsUpdateStateModalOpen] = useState<boolean>(false);
    const [groomingDataToEdit, setGroomingDataToEdit] = useState<GroomingQueueItem | null>(null);
    const [typeOfOperation, setTypeOfOperation] = useState<OperationType>("finishGrooming");

    // determinar el color de fondo según el estado
    function getStateColor(state: GroomingState): string {
        switch (state) {
            case "En Atención": return "bg-rose-600";
            case "Pendiente": return "bg-amber-500";
            case "Terminado": return "bg-emerald-600";
            case "Entregado": return "bg-blue-500";
            case "En espera": return "bg-yellow-500";
            default: return "bg-gray-400";
        }
    }

    return (
        <section className="w-full p-1 md:p-6  overflow-auto custom-scrollbar bg-gray-950 text-gray-200">
            <h1 className="text-xl md:text-2xl font-medium text-cyan-500 mb-4 pb-4 border-b border-cyan-500 flex items-center">
                <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-cyan-500 mr-2" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400"> Peluquería:</span> <span className=" font-light pl-1"> Turnos de hoy</span>
            </h1>
            <div className="bg-gray-800 px-4 py-3 rounded-xl mb-4 border border-gray-700">
                <div className="p-4 rounded-xl mb-4 bg-gray-800 border-2 border-cyan-500/30">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 mb-4 ">
                        <div className="flex w-full md:w-[350px] bg-gray-700 border border-gray-600 rounded-xl overflow-hidden hover:border-cyan-500 focus-within:border-cyan-500 transition-colors">
                            <div className="flex items-center justify-center px-3 border-r border-gray-600">
                                <SearchIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por cliente o mascota......"
                                className="w-full py-1 px-4 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <button
                            className="w-full md:w-auto border border-gray-700 text-white bg-emerald-600 py-1 px-4 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors"
                            onClick={() => navigate("/grooming/order-creation/no_client")}
                        >
                            <PlusIcon className="w-4 h-4" />
                            CREAR ORDEN DE SERVICIO
                        </button>
                    </div>
                    <div>
                        <select
                            name="status"
                            className="w-full md:w-[25%] rounded-xl border-gray-600 border bg-gray-700 text-gray-200 sm:text-sm py-1 px-4 hover:border-cyan-500 focus:border-cyan-500 focus:outline-none transition-colors"
                        >
                            <option className="bg-gray-700" value="">--Seleccionar estado--</option>
                            <option className="bg-gray-700" value="Pendiente">Pendiente</option>
                            <option className="bg-gray-700" value="En Atención">En Atención</option>
                            <option className="bg-gray-700" value="Terminado">Terminado</option>
                            <option className="bg-gray-700" value="Entregado">Entregado</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-700 rounded-lg">
                    <table className="min-w-full bg-gray-800 border rounded-lg">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="py-1 px-4 border-r border-gray-700">
                                    <input type="checkbox" className="form-checkbox bg-gray-900 border-gray-500 text-cyan-500 rounded focus:ring-cyan-500" />
                                </th>
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-1 px-4 ${header === "Mascota" ? "text-left" : "text-center"} border-r border-gray-600 font-bold text-gray-300 text-sm`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {petsInQueueGrooming.map((groomingData) => (
                                <tr key={groomingData.id} className="hover:bg-gray-700 transition-colors duration-200 text-sm">
                                    <td className=" px-4 text-center border border-gray-600 align-top pt-4">
                                        <input type="checkbox" className="form-checkbox bg-gray-900 border-gray-500 text-cyan-500 rounded focus:ring-cyan-500" />
                                    </td>
                                    <td className=" px-4 text-center border border-gray-600 align-top pt-4">{groomingData?.turn}</td>
                                    <td className=" px-4 text-center border border-gray-600 align-top pt-4">{groomingData?.dateOfAttention}</td>
                                    <td className=" px-4 text-center border border-gray-600 align-top pt-4">{groomingData?.timeOfAttention}</td>
                                    <td className=" px-4 text-center border border-gray-600 align-top pt-4">{groomingData?.timeOfAttention}</td>
                                    <td className=" px-4 border border-gray-600 align-top pt-4">
                                        <Link
                                            className="text-md cursor-pointer text-cyan-500 hover:text-cyan-400 hover:underline transition-colors"
                                            to={`/clients/client/${groomingData?.petData?.ownerId}/update`}>
                                            {groomingData?.ownerName}
                                        </Link>
                                    </td>
                                    <td className=" px-4 border border-gray-600 align-top pt-4">
                                        <Link
                                            className="text-md cursor-pointer text-cyan-500 hover:text-cyan-400 hover:underline transition-colors"
                                            to={`/pets/pet/${groomingData?.petData.id}/update`}>
                                            {groomingData?.petData?.petName}
                                        </Link>
                                    </td>
                                    <td className=" px-4 text-center border border-gray-600 align-top pt-4">{groomingData?.petData?.breed}</td>
                                    <td className=" pr-3 pl-2 border border-gray-600 align-top pt-3 text-sm">
                                        <ul className='list-disc pl-4 text-gray-300'>
                                            {groomingData?.productsAndServices?.map((service) => (
                                                <li key={service?.provisionalId} >
                                                    {service?.productName || service?.serviceName}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className=" px-4 text-center border border-gray-600">
                                        <span
                                            className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-white ${getStateColor(groomingData?.state)} rounded-full whitespace-nowrap cursor-pointer transition-all hover:scale-105`}
                                            onClick={() => {
                                                setIsUpdateStateModalOpen(true)
                                                setGroomingDataToEdit(groomingData)
                                            }}
                                        >
                                            {groomingData.state}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center border-gray-600 border">
                                        <div className="flex justify-center space-x-2">
                                            <PenIcon
                                            className="w-5 h-5 text-orange-500 cursor-pointer hover:text-orange-400 transition-colors"
                                            onClick={() => navigate(`/grooming/update/${groomingData.id}`)}
                                            />
                                            <CheckIcon
                                            className="w-5 h-5 text-green-500 cursor-pointer hover:text-green-400 transition-colors"
                                            onClick={() => {
                                                setGroomingDataToEdit({ ...groomingData, state: "Terminado" })
                                                setTypeOfOperation("finishGrooming")
                                                setIsConfirmActionModalOpen(true)
                                            }}
                                            />
                                            <BanIcon
                                            className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-400 transition-colors"
                                            onClick={() => {
                                                setGroomingDataToEdit(groomingData)
                                                setTypeOfOperation("deleteGrooming")
                                                setIsConfirmActionModalOpen(true)
                                            }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {
                    isConfirmActionModalOpen && groomingDataToEdit && (
                        <ConfirmActionModal
                            elementData={groomingDataToEdit}
                            typeOfOperation={typeOfOperation}
                            onClose={() => setIsConfirmActionModalOpen(false)}
                        />
                    )
                }
                {
                    isUpdateStateModalOpen && groomingDataToEdit && (
                        <UpdateStateModal
                            dataToUpdate={groomingDataToEdit}
                            mode="grooming"
                            onClose={() => setIsUpdateStateModalOpen(false)}
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-400 text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {petsInQueueGrooming.length} | Total{" "}
                        {petsInQueueGrooming.length}
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

export { ActiveOrdersGrooming };