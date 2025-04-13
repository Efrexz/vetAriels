import { useContext, useState } from 'react';
import { ClientsContext } from '@context/ClientsContext';
import { UpdateStateModal } from '@components/UpdateStateModal';
import { ConfirmActionModal } from '@components/ConfirmActionModal';
import BathIcon from '@assets/bathIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';


const tableHeaders = ["Cod. de Sistema", "Fecha", "Entrada", "Salida", "Cliente", "Mascota", "Raza", "Servicios", "Estado", "Opciones"];

function GroomingHistory() {

    const { petsInQueueGroomingHistory } = useContext(ClientsContext);

    const [isUpdateStateModalOpen, setIsUpdateStateModalOpen] = useState(false);
    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState(false);
    const [groomingDataToUpdate, setGroomingDataToUpdate] = useState(null);

    // determinar el color de fondo según el estado
    function getStateColor(state) {
        switch (state) {
            case "En atención":
                return "bg-blue-400";
            case "Pendiente":
                return "bg-orange-500";
            case "Terminado":
                return "bg-green-500";
            case "Entregado":
                return "bg-blue-400";
            default:
                return "bg-orange-500";
        }
    }

    return (
        <section className="w-full max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8  overflow-auto custom-scrollbar mt-6">
            <h1 className="text-xl sm:text-3xl font-medium text-blue-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-blue-400 mr-2" />
                Peluquería: historial
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="p-4 rounded-lg mb-2 bg-white shadow">
                    <div className="flex flex-col md:flex-row md:items-center  gap-4 mb-4">
                        <div className="flex w-full md:w-[350px] border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                            <div className="flex items-center justify-center bg-gray-100 px-3">
                                <SearchIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <input
                            type="date"
                            className="w-full md:w-[30%] py-1 px-4 border-gray-200 border rounded-lg focus:outline-none focus:border-blue-300"
                        />
                        <select
                            name="status"
                            className="w-full md:w-[30%] rounded-lg border-gray-200 border text-gray-700 sm:text-sm py-2 px-4 hover:border-blue-300 focus:border-blue-300 focus:outline-none"
                        >
                            <option value="">--Seleccionar estado--</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="en-atencion">En Atención</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="entregado">Entregado</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-2 px-4 ${header === "Mascota" ? "text-left" : "text-center"} border font-medium text-gray-700`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {petsInQueueGroomingHistory.map((groomingData, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-b">
                                    <td className="py-2 px-4 text-center border align-top pt-4">
                                        {groomingData.systemCode.slice(0, 9).toUpperCase()}
                                    </td>
                                    <td className="py-2 px-4 text-center border align-top pt-4">{groomingData.dateOfAttention}</td>
                                    <td className="py-2 px-4 text-center border-2 align-top pt-4">{groomingData.timeOfAttention}</td>
                                    <td className="py-2 px-4 text-center border-2 align-top pt-4">{groomingData.timeOfAttention}</td>
                                    <td className="py-2 px-4 border-b text-center border align-top pt-4">
                                        <span className="text-md  cursor-pointer text-blue-500 hover:underline ">
                                            {groomingData.ownerName}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b text-center border-2 align-top pt-4">
                                        <span className="text-md cursor-pointer text-blue-500 hover:underline">
                                            {groomingData.petData?.petName}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center border-2 align-top pt-4">{groomingData.petData?.breed}</td>
                                    <td className="py-2 px-4 border-2 align-top pt-3">
                                        <ul className='list-disc pl-4'>
                                            {groomingData.productsAndServices.map((item) => (
                                                <li key={item.provisionalId} >
                                                    {item.serviceName}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="py-2 px-4 border-2 align-top pt-5">
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
                                    <td className="py-10 px-4 text-center flex justify-center space-x-2 align-top pt-5 border-gray-300">
                                        <PenIcon className="w-5 h-5 text-blue-500 cursor-pointer" />
                                        <ReturnIcon
                                            className="w-5 h-5 text-orange-400 cursor-pointer"
                                            onClick={() => {
                                                setIsConfirmActionModalOpen(true)
                                                setGroomingDataToUpdate(groomingData)
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {
                    isUpdateStateModalOpen && (
                        <UpdateStateModal
                            dataToUpdate={groomingDataToUpdate}
                            mode="history"
                            onClose={() => setIsUpdateStateModalOpen(false)}
                        />
                    )
                }
                {
                    isConfirmActionModalOpen && (
                        <ConfirmActionModal
                            elementData={groomingDataToUpdate}
                            typeOfOperation="returnGrooming"
                            onClose={() => setIsConfirmActionModalOpen(false)}
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {petsInQueueGroomingHistory.length} | Total{" "}
                        {petsInQueueGroomingHistory.length}
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

export { GroomingHistory };