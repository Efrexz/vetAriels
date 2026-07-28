import { useState } from 'react';
import { useClients } from '@context/ClientsContext';
import { GroomingQueueItem } from '@t/clinical.types';
import { UpdateStateModal } from '@components/modals/UpdateStateModal';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import BathIcon from '@assets/bathIcon.svg?react';
// import PenIcon from '@assets/penIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';

type GroomingState = GroomingQueueItem['state'];

const tableHeaders = ["Codigo", "Fecha", "Entrada", "Salida", "Cliente", "Mascota", "Raza", "Servicios", "Estado", "Opciones"];

function GroomingHistory() {

    const { petsInQueueGroomingHistory } = useClients();

    const [isUpdateStateModalOpen, setIsUpdateStateModalOpen] = useState<boolean>(false);
    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState<boolean>(false);
    const [groomingDataToUpdate, setGroomingDataToUpdate] = useState<GroomingQueueItem | null>(null);

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
        <section className="w-full p-1 md:p-6 overflow-auto custom-scrollbar">
            <div className="mb-4 pb-4 border-b border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber mb-1">Peluquería</p>
                <h1 className="text-xl md:text-2xl font-medium text-ink flex items-center">
                    <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-amber mr-2" />
                    <span className="font-light">Historial</span>
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-4 mb-6 border border-slate-200">
                <div className="p-4 rounded-xl mb-4 bg-paper border-2 border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <div className="flex w-full md:w-[350px] bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-primary focus-within:border-primary transition-colors">
                            <div className="flex items-center justify-center px-3 border-r border-slate-200">
                                <SearchIcon className="w-4 h-4 text-slate" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full py-1 px-4 bg-white text-ink placeholder-slate focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <input
                            type="date"
                            className="w-full md:w-[30%] py-0.5 px-5 bg-white border border-slate-200 rounded-xl text-ink hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        <select
                            name="status"
                            className="w-full md:w-[30%] rounded-xl border border-slate-200 bg-white text-ink sm:text-sm py-1 px-5 hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all"
                        >
                            <option className="bg-white" value="">--Seleccionar estado--</option>
                            <option className="bg-white" value="pendiente">Pendiente</option>
                            <option className="bg-white" value="en-atencion">En Atención</option>
                            <option className="bg-white" value="finalizado">Finalizado</option>
                            <option className="bg-white" value="entregado">Entregado</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200">
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-1 px-4 ${header === "Mascota" ? "text-left" : "text-center"} font-bold text-sm text-slate`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {petsInQueueGroomingHistory.map((groomingData) => (
                                <tr key={groomingData.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-sm">
                                    <td className="px-4 text-center align-top pt-4 text-ink">
                                        {groomingData.systemCode.slice(0, 9).toUpperCase()}
                                    </td>
                                    <td className="px-4 text-center align-top pt-4 text-ink">{groomingData.dateOfAttention}</td>
                                    <td className="px-4 text-center align-top pt-4 text-ink">{groomingData.timeOfAttention}</td>
                                    <td className="px-4 text-center align-top pt-4 text-ink">{groomingData.timeOfAttention}</td>
                                    <td className="px-4 text-center align-top pt-4 text-primary hover:underline cursor-pointer">
                                        {groomingData.ownerName}
                                    </td>
                                    <td className="px-4 text-center align-top pt-4 text-primary hover:underline cursor-pointer">
                                        {groomingData.petData?.petName}
                                    </td>
                                    <td className="px-4 text-center align-top pt-4 text-ink">{groomingData.petData?.breed}</td>
                                    <td className="px-4 align-top pt-3 text-ink">
                                        <ul className='list-disc pl-4'>
                                            {groomingData.productsAndServices.map((item) => (
                                                <li key={item.provisionalId} >
                                                    {item.serviceName || item.productName}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-4 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none rounded-full cursor-pointer whitespace-nowrap ${getStateColor(groomingData?.state)}`}
                                            onClick={() => {
                                                setIsUpdateStateModalOpen(true)
                                                setGroomingDataToUpdate(groomingData)
                                            }}
                                        >
                                            {groomingData.state}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center items-center space-x-2">
                                        {/* <PenIcon className="w-5 h-5 text-blue-500 cursor-pointer" /> */}
                                        <button
                                            aria-label="Regresar a la cola"
                                            onClick={() => {
                                                setIsConfirmActionModalOpen(true);
                                                setGroomingDataToUpdate(groomingData);
                                            }}
                                        >
                                            <ReturnIcon className="w-5 h-5 text-orange-400 cursor-pointer" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {
                    isUpdateStateModalOpen && groomingDataToUpdate && (
                        <UpdateStateModal
                            dataToUpdate={groomingDataToUpdate}
                            mode="history"
                            onClose={() => setIsUpdateStateModalOpen(false)}
                        />
                    )
                }
                {
                    isConfirmActionModalOpen && groomingDataToUpdate && (
                        <ConfirmActionModal
                            elementData={groomingDataToUpdate}
                            typeOfOperation="returnGrooming"
                            onClose={() => setIsConfirmActionModalOpen(false)}
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-slate text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {petsInQueueGroomingHistory.length} | Total{" "}
                        {petsInQueueGroomingHistory.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-1 px-4 border border-slate-200 rounded-lg text-slate bg-paper hover:bg-slate-50 transition-colors">Primera</button>
                        <button className="py-1 px-4 border border-slate-200 rounded-lg text-slate bg-paper hover:bg-slate-50 transition-colors">Anterior</button>
                        <button className="py-1 px-4 border border-slate-200 rounded-lg bg-primary text-white hover:opacity-90 transition-colors">1</button>
                        <button className="py-1 px-4 border border-slate-200 rounded-lg text-slate bg-paper hover:bg-slate-50 transition-colors">Siguiente</button>
                        <button className="py-1 px-4 border border-slate-200 rounded-lg text-slate bg-paper hover:bg-slate-50 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { GroomingHistory };
