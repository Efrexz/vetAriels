import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAndServicesContext } from '@context/ProductsAndServicesContext';
import { AddNewServiceModal } from '@components/modals/AddNewServiceModal.jsx';
import { DeleteModal } from '@components/modals/DeleteModal.jsx';
import PlusIcon from '@assets/plusIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import KitMedical from '@assets/kitMedical.svg?react';


const filterOptions = [
    {
        type: "Línea...",
        options: [
            { value: "alimentos", label: "ALIMENTOS" },
            { value: "farmacia", label: "FARMACIA" },
            { value: "laboratorio", label: "LABORATORIO" },
            { value: "medica", label: "MEDICA" },
            { value: "pet-shop", label: "PET SHOP" },
            { value: "spa", label: "SPA" },
        ]
    },
    {
        type: "Categorías",
        options: [
            { value: "categoria1", label: "Categoría 1" },
            { value: "categoria2", label: "Categoría 2" },
        ]
    },
];



const tableHeaders = ["Cod. de sistema", "Fecha de Registro", "Nombre", "Línea", "Categoría", "Precio de venta", "Estado", "Opciones"];

function Services() {
    const { servicesData } = useContext(ProductsAndServicesContext);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const navigate = useNavigate();
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-xl sm:text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <KitMedical className="text-blue-500 w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                Servicios
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2 mb-4">
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
                        <button
                            className="border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2 w-full md:w-auto"
                            onClick={() => setIsSuccessModalOpen(true)}
                        >
                            <PlusIcon className="w-5 h-5" />
                            CREAR NUEVO SERVICIO
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                        {filterOptions.map((option, index) => (
                            <div key={index} className="w-full sm:w-[48%] lg:w-[30%]">
                                <select
                                    name={option.type}
                                    className="mt-1.5 w-full rounded-lg hover:border-blue-300 focus-within:border-blue-300 border-2 text-gray-700 sm:text-sm p-2"
                                >
                                    <option value="">{option.type}</option>
                                    {option.options.map((opt, idx) => (
                                        <option key={idx} value={opt.value}>{opt.label}</option>
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
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 text-center border-2 font-medium text-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {servicesData.map((service, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center border-2">{service?.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="py-2 px-4 text-center border-2">
                                        <span className="block">{service?.registrationDate}</span>
                                        <span className="block text-sm text-gray-600">{service?.registrationTime}</span>
                                    </td>
                                    <td className="py-2 px-4 text-center border-2">{service?.serviceName}</td>
                                    <td className="py-2 px-4 text-center border-2">{service?.line}</td>
                                    <td className="py-2 px-4 text-center border-2">{service?.category}</td>
                                    <td className="py-2 px-4 text-center border-2">{service?.salePrice}</td>
                                    <td className="py-2 px-4 text-center border-2 ">
                                        <span
                                            className={`inline-block cursor-pointer w-4 h-4 rounded-full ${service?.status ? "bg-green-500" : "bg-red-500"}`}
                                        />
                                    </td>
                                    <td className="py-8 px-4 text-center border">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <PenIcon
                                                className="w-4 h-4 text-green-500 cursor-pointer"
                                                onClick={() => navigate(`/service/${service.id}/update`)}
                                            />
                                            <TrashIcon
                                                className="w-4 h-4 text-red-500 cursor-pointer"
                                                onClick={() => {
                                                    setIsDeleteModalOpen(true)
                                                    setServiceToDelete(service)
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        isSuccessModalOpen && (
                            <AddNewServiceModal
                                onClose={() => setIsSuccessModalOpen(false)}
                            />
                        )
                    }
                    {
                        isDeleteModalOpen && (
                            <DeleteModal
                                onClose={() => setIsDeleteModalOpen(false)}
                                elementToDelete={serviceToDelete}
                                mode="services"
                            />
                        )
                    }
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {servicesData.length} | Total{" "}
                        {servicesData.length}
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

export { Services };