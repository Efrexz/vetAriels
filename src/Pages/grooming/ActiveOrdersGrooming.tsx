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

    function getStateColor(state: GroomingState): string {
        switch (state) {
            case "En Atención": return "bg-rose-50 text-rose-700";
            case "Pendiente": return "bg-amber-50 text-amber-700";
            case "Terminado": return "bg-emerald-50 text-emerald-700";
            case "Entregado": return "bg-blue-50 text-blue-700";
            case "En espera": return "bg-yellow-50 text-yellow-700";
            default: return "bg-slate-100 text-slate-500";
        }
    }

    return (
        <section className="w-full p-1 md:p-6  overflow-auto custom-scrollbar bg-mist text-ink">
            <div className="mb-4 pb-4 border-b border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber mb-1">Peluquería</p>
                <h1 className="text-xl md:text-2xl font-medium text-ink flex items-center">
                    <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-amber mr-2" />
                    <span className="font-light">Turnos de hoy</span>
                </h1>
            </div>
            <div className="bg-paper px-4 py-3 rounded-2xl mb-4 border border-slate-200 shadow-sm">
                <div className="p-4 rounded-xl mb-4 bg-paper border-2 border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 mb-4 ">
                        <div className="flex w-full md:w-[350px] bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-primary focus-within:border-primary transition-colors">
                            <div className="flex items-center justify-center px-3 border-r border-slate-200">
                                <SearchIcon className="w-4 h-4 text-slate" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por cliente o mascota......"
                                className="w-full py-1 px-4 bg-white text-ink placeholder-slate focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <button
                            className="w-full md:w-auto border border-slate-200 text-white bg-primary py-1 px-4 rounded-xl hover:opacity-90 font-semibold font-display shadow-sm shadow-primary/25 flex items-center justify-center gap-2 transition-colors"
                            onClick={() => navigate("/grooming/order-creation/no_client")}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Crear orden de servicio
                        </button>
                    </div>
                    <div>
                        <select
                            name="status"
                            className="w-full md:w-[25%] rounded-xl border-slate-200 border bg-white text-ink sm:text-sm py-1 px-4 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
                        >
                            <option className="bg-white" value="">--Seleccionar estado--</option>
                            <option className="bg-white" value="Pendiente">Pendiente</option>
                            <option className="bg-white" value="En Atención">En Atención</option>
                            <option className="bg-white" value="Terminado">Terminado</option>
                            <option className="bg-white" value="Entregado">Entregado</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200">
                                <th className="py-1 px-4">
                                    <input type="checkbox" className="form-checkbox bg-white border-slate-200 text-amber rounded focus:ring-primary/30 focus:border-primary" />
                                </th>
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-1 px-4 ${header === "Mascota" ? "text-left" : "text-center"} font-bold text-slate text-sm`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {petsInQueueGrooming.map((groomingData) => (
                                <tr key={groomingData.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200 text-sm">
                                    <td className="px-4 text-center align-top pt-4">
                                        <input type="checkbox" className="form-checkbox bg-white border-slate-200 text-amber rounded focus:ring-primary/30 focus:border-primary" />
                                    </td>
                                    <td className="px-4 text-center align-top pt-4">{groomingData?.turn}</td>
                                    <td className="px-4 text-center align-top pt-4">{groomingData?.dateOfAttention}</td>
                                    <td className="px-4 text-center align-top pt-4">{groomingData?.timeOfAttention}</td>
                                    <td className="px-4 text-center align-top pt-4">{groomingData?.timeOfAttention}</td>
                                    <td className="px-4 align-top pt-4">
                                        <Link
                                            className="text-md cursor-pointer text-primary hover:text-primary/80 hover:underline transition-colors"
                                            to={`/clients/client/${groomingData?.petData?.ownerId}/update`}>
                                            {groomingData?.ownerName}
                                        </Link>
                                    </td>
                                    <td className="px-4 align-top pt-4">
                                        <Link
                                            className="text-md cursor-pointer text-primary hover:text-primary/80 hover:underline transition-colors"
                                            to={`/pets/pet/${groomingData?.petData.id}/update`}>
                                            {groomingData?.petData?.petName}
                                        </Link>
                                    </td>
                                    <td className="px-4 text-center align-top pt-4">{groomingData?.petData?.breed}</td>
                                    <td className="pr-3 pl-2 align-top pt-3 text-sm">
                                        <ul className='list-disc pl-4 text-slate'>
                                            {groomingData?.productsAndServices?.map((service) => (
                                                <li key={service?.provisionalId} >
                                                    {service?.productName || service?.serviceName}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-4 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none rounded-full whitespace-nowrap cursor-pointer transition-all hover:scale-105 ${getStateColor(groomingData?.state)}`}
                                            onClick={() => {
                                                setIsUpdateStateModalOpen(true)
                                                setGroomingDataToEdit(groomingData)
                                            }}
                                        >
                                            {groomingData.state}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
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
                    <p className="text-slate text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {petsInQueueGrooming.length} | Total{" "}
                        {petsInQueueGrooming.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-1 px-3 border border-slate-200 rounded-lg text-slate bg-paper hover:bg-slate-50 transition-colors">Primera</button>
                        <button className="py-1 px-3 border border-slate-200 rounded-lg text-slate bg-paper hover:bg-slate-50 transition-colors">Anterior</button>
                        <button className="py-1 px-3 border border-slate-200 rounded-lg bg-primary text-white hover:opacity-90 transition-colors">1</button>
                        <button className="py-1 px-3 border border-slate-200 rounded-lg text-slate bg-paper hover:bg-slate-50 transition-colors">Siguiente</button>
                        <button className="py-1 px-3 border border-slate-200 rounded-lg text-slate bg-paper hover:bg-slate-50 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { ActiveOrdersGrooming };
