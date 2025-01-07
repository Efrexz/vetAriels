import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { ConfirmActionModal } from '@components/ConfirmActionModal';
import { UpdateStateModal } from '@components/UpdateStateModal';
import BathIcon from '@assets/bathIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import BanIcon from '@assets/banIcon.svg?react';


const tableHeaders = ["Turno", "Fecha", "Entreda", "Salida", "Cliente", "Mascota", "Raza", "Servicios", "Estado", "Opciones"];

function ActiveOrdersGrooming() {

    const { petsInQueueGrooming } = useContext(ClientsContext);

    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState(false);
    const [isUpdateStateModalOpen, setIsUpdateStateModalOpen] = useState(false);
    const [groomingDataToEdit, setGroomingDataToEdit] = useState(null);
    const [typeOfOperation, setTypeOfOperation] = useState('');
    const navigate = useNavigate();

    // determinar el color de fondo según el estado
    function getStateColor(state) {
        switch (state) {
            case "En atención":
                return "bg-blue-400";
            case "Pendiente":
                return "bg-orange-500";
            case "Terminado":
                return "bg-green-500";
            default:
                return "bg-orange-500";
        }
    }


    return (
        <section className="container mx-auto p-4 sm:p-6 overflow-auto custom-scrollbar">
            <h1 className="text-xl sm:text-3xl font-medium text-blue-400 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-blue-400 mr-2" />
                Peluquería: <span className="text-green-600 font-light pl-1"> Turnos de hoy</span>
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 mb-4">
                        {/* Input de búsqueda */}
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

                        {/* Botón de creación */}
                        <button
                            className="w-full md:w-auto border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-2"
                            onClick={() => navigate("/grooming/order-creation/no_client")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            CREAR ORDEN DE SERVICIO
                        </button>
                    </div>

                    {/* Select de estado */}
                    <div>
                        <select
                            name="status"
                            className="w-full md:w-[30%] rounded-lg border-gray-200 border text-gray-700 sm:text-sm py-2 px-4 hover:border-blue-300 focus:border-blue-300"
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
                            {petsInQueueGrooming.map((groomingData, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-b">
                                    <td className="py-2 px-4 text-center border-2 align-top pt-4">
                                        <input type="checkbox" className="form-checkbox" />
                                    </td>
                                    <td className="py-2 px-4 text-center border-2 align-top pt-4">{groomingData?.turn}</td>
                                    <td className="py-2 px-4 text-center border align-top pt-4">{groomingData?.dateOfAttention}</td>
                                    <td className="py-2 px-4 text-center border-2 align-top pt-4">{groomingData?.timeOfAttention}</td>
                                    <td className="py-2 px-4 text-center border-2 align-top pt-4">{groomingData?.timeOfAttention}</td>
                                    <td className="py-2 px-4 border-b text-center border align-top pt-4">
                                        <Link
                                            className="text-md  cursor-pointer text-blue-500 hover:underline"
                                            to={`/clients/client/${groomingData?.petData?.ownerId}/update`}>
                                            {groomingData?.ownerName}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 border-b text-center border-2 align-top pt-4">
                                        <Link
                                            className="text-md  cursor-pointer text-blue-500 hover:underline"
                                            to={`/pets/pet/${groomingData?.petData.id}/update`}>
                                            {groomingData?.petData?.petName}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 text-center border-2 align-top pt-4">{groomingData?.petData?.breed}</td>
                                    <td className="py-2 pr-3 pl-2 border-2 align-top pt-3 text-sm">
                                        <ul className='list-disc pl-4'>
                                            {groomingData?.productsAndServices?.map((service) => (
                                                <li key={service?.provisionalId} >
                                                    {service?.productName || service?.serviceName}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="py-2 px-4 border-2 align-top pt-5">
                                        <span
                                            className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-white  ${getStateColor(groomingData?.state)} rounded-full whitespace-nowrap cursor-pointer`}
                                            onClick={() => {
                                                setIsUpdateStateModalOpen(true)
                                                setGroomingDataToEdit(groomingData)
                                            }}
                                        >
                                            {groomingData.state}
                                        </span>
                                    </td>
                                    <td className="py-10 px-4 text-center flex justify-center space-x-2 align-top pt-5 border-gray-300">
                                        <PenIcon
                                            className="w-4.5 h-4.5 text-blue-500 cursor-pointer"
                                            onClick={() => navigate(`/grooming/update/${groomingData.id}`)}
                                        />
                                        <CheckIcon
                                            className="w-4.5 h-4.5 text-green-500 cursor-pointer"
                                            onClick={() => {
                                                setGroomingDataToEdit({ ...groomingData, state: "Terminado" })
                                                setTypeOfOperation("finishGrooming")
                                                setIsConfirmActionModalOpen(true)
                                            }}
                                        />
                                        <BanIcon
                                            className="w-4.5 h-4.5 text-red-500 cursor-pointer"
                                            onClick={() => {
                                                setGroomingDataToEdit(groomingData)
                                                setTypeOfOperation("deleteGrooming")
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
                    isConfirmActionModalOpen && (
                        <ConfirmActionModal
                            elementData={groomingDataToEdit}
                            typeOfOperation={typeOfOperation}
                            onClose={() => setIsConfirmActionModalOpen(false)}
                        />
                    )
                }
                {
                    isUpdateStateModalOpen && (
                        <UpdateStateModal
                            dataToUpdate={groomingDataToEdit}
                            mode="grooming"
                            onClose={() => setIsUpdateStateModalOpen(false)}
                        />
                    )
                }

                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {petsInQueueGrooming.length} | Total{" "}
                        {petsInQueueGrooming.length}
                    </p>
                    <div className="flex justify-center space-x-2">
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

export { ActiveOrdersGrooming };