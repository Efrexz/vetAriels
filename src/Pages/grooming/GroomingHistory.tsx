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
        <section className="w-full px-4 sm:px-6 lg:px-8 overflow-auto custom-scrollbar mt-6">
            <h1 className="text-xl sm:text-2xl font-medium text-cyan-400 mb-4 pb-4 border-b border-cyan-500 flex items-center">
                <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-cyan-500 mr-2" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400"> Peluquería:</span> <span className="text-esmerald-400 font-light pl-1"> historial</span>
            </h1>
            <div className="bg-gray-900 rounded-xl shadow-xl p-4 mb-6 border-2 border-cyan-500/30">
                <div className="p-4 rounded-xl mb-4 bg-gray-800 border-2 border-cyan-500/30">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <div className="flex w-full md:w-[350px] bg-gray-700 border border-gray-600 rounded-xl overflow-hidden hover:border-cyan-500 focus-within:border-cyan-500 transition-colors">
                            <div className="flex items-center justify-center px-3 border-r border-gray-600">
                                <SearchIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full py-1 px-4 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <input
                            type="date"
                            className="w-full md:w-[30%] py-0.5 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 hover:border-cyan-500 focus:outline-none focus:ring-1  focus:ring-cyan-500 transition-all"
                        />
                        <select
                            name="status"
                            className="w-full md:w-[30%] rounded-xl border border-gray-600 bg-gray-700 text-gray-100 sm:text-sm py-1 px-5 hover:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                        >
                            <option className="bg-gray-700" value="">--Seleccionar estado--</option>
                            <option className="bg-gray-700" value="pendiente">Pendiente</option>
                            <option className="bg-gray-700" value="en-atencion">En Atención</option>
                            <option className="bg-gray-700" value="finalizado">Finalizado</option>
                            <option className="bg-gray-700" value="entregado">Entregado</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-700 rounded-xl">
                    <table className="min-w-full bg-gray-800 rounded-xl">
                        <thead className="bg-gray-700">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-1 px-4 ${header === "Mascota" ? "text-left" : "text-center"} border border-gray-600 font-bold text-sm text-gray-300`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {petsInQueueGroomingHistory.map((groomingData) => (
                                <tr key={groomingData.id} className="hover:bg-gray-700 border-b border-gray-600 transition-colors text-sm">
                                    <td className="px-4 text-center border border-gray-600 align-top pt-4 text-gray-200">
                                        {groomingData.systemCode.slice(0, 9).toUpperCase()}
                                    </td>
                                    <td className="px-4 text-center border border-gray-600 align-top pt-4 text-gray-200">{groomingData.dateOfAttention}</td>
                                    <td className="px-4 text-center border border-gray-600 align-top pt-4 text-gray-200">{groomingData.timeOfAttention}</td>
                                    <td className="px-4 text-center border border-gray-600 align-top pt-4 text-gray-200">{groomingData.timeOfAttention}</td>
                                    <td className="px-4 text-center border border-gray-600 align-top pt-4 text-cyan-500 hover:underline cursor-pointer">
                                        {groomingData.ownerName}
                                    </td>
                                    <td className="px-4 text-center border border-gray-600 align-top pt-4 text-cyan-500 hover:underline cursor-pointer">
                                        {groomingData.petData?.petName}
                                    </td>
                                    <td className="px-4 text-center border border-gray-600 align-top pt-4 text-gray-200">{groomingData.petData?.breed}</td>
                                    <td className="px-4 border border-gray-600 align-top pt-3 text-gray-200">
                                        <ul className='list-disc pl-4'>
                                            {groomingData.productsAndServices.map((item) => (
                                                <li key={item.provisionalId} >
                                                    {item.serviceName || item.productName}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-4 border border-gray-600 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-white ${getStateColor(groomingData?.state)} rounded-full cursor-pointer whitespace-nowrap`}
                                            onClick={() => {
                                                setIsUpdateStateModalOpen(true)
                                                setGroomingDataToUpdate(groomingData)
                                            }}
                                        >
                                            {groomingData.state}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center items-center space-x-2 border-gray-600 ">
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
                    <p className="text-gray-400 text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {petsInQueueGroomingHistory.length} | Total{" "}
                        {petsInQueueGroomingHistory.length}
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

export { GroomingHistory };