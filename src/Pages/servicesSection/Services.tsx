import { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { Service } from '@t/inventory.types';
import { AddNewServiceModal } from '@components/modals/AddNewServiceModal.jsx';
import { DeleteModal } from '@components/modals/DeleteModal.jsx';
import PlusIcon from '@assets/plusIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import KitMedical from '@assets/kitMedical.svg?react';


const filterOptions = [
    { type: "line", label: "Línea...", options: [ "ALIMENTOS", "FARMACIA", "LABORATORIO", "MEDICA", "PET SHOP", "SPA" ] },
    { type: "category", label: "Categorías...", options: [ "Categoría 1", "Categoría 2" ] },
];

const tableHeaders = ["Cod. de sistema", "Fecha de Registro", "Nombre", "Línea", "Categoría", "Precio de venta", "Estado", "Opciones"];

function Services() {
    const { servicesData } = useProductsAndServices();
    const navigate = useNavigate();

    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filters, setFilters] = useState<Record<string, string>>({
        line: '',
        category: '',
    });

    const filteredServices = useMemo(() => {
        return servicesData.filter(service => {
            const matchesSearch = service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLine = filters.line ? service.line === filters.line : true;
            const matchesCategory = filters.category ? service.category === filters.category : true;
            return matchesSearch && matchesLine && matchesCategory;
        });
    }, [servicesData, searchTerm, filters]);

    function handleFilterChange (e: ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <section className="w-full p-6 bg-gray-950 text-gray-200">
            <h1 className="text-xl sm:text-3xl font-medium text-gray-200 mb-4 pb-4 border-b-2 border-cyan-500 flex bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                <KitMedical className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Servicios</span>
            </h1>
            <div className="bg-gray-900 rounded-lg shadow-xl p-3 mb-6">
                <div className="p-4 rounded-lg mb-6 bg-gray-800 border-2 border-cyan-500/50">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2 mb-4">
                        <div className="flex w-full md:w-[350px] border border-gray-600 rounded-lg overflow-hidden hover:border-cyan-500 focus-within:border-cyan-500">
                            <div className="flex items-center justify-center bg-gray-700 px-3">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent bg-gray-700 text-gray-200"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className="border border-gray-700 text-white bg-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-700 flex items-center gap-2 w-full md:w-auto transition-colors"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <PlusIcon className="w-5 h-5" />
                            CREAR NUEVO SERVICIO
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                        {filterOptions.map((filter) => (
                            <div key={filter.type} className="w-full sm:w-[48%] lg:w-[30%]">
                                <select
                                    name={filter.type}
                                    onChange={handleFilterChange}
                                    className="mt-1.5 w-full rounded-lg hover:border-cyan-500 focus-within:border-cyan-500 border border-gray-600 bg-gray-700 text-gray-200 sm:text-sm p-2"
                                >
                                    <option value="">{filter.label}</option>
                                    {filter.options.map((opt, idx) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-700 rounded-lg">
                    <table className="min-w-full bg-gray-800">
                        <thead className="bg-gray-700">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 text-center border-2 border-gray-600 font-medium text-gray-300">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-700 transition-colors">
                                    <td className="py-2 px-4 text-center border border-gray-600 text-gray-400">{service?.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="py-2 px-4 text-center border border-gray-600 text-gray-400">
                                        <span className="block">{service?.registrationDate}</span>
                                        <span className="block text-sm text-gray-500">{service?.registrationTime}</span>
                                    </td>
                                    <td className="py-2 px-4 text-center border border-gray-600 text-gray-400">{service?.serviceName}</td>
                                    <td className="py-2 px-4 text-center border border-gray-600 text-gray-400">{service?.line}</td>
                                    <td className="py-2 px-4 text-center border border-gray-600 text-gray-400">{service?.category}</td>
                                    <td className="py-2 px-4 text-center border border-gray-600 text-gray-400">{service?.salePrice}</td>
                                    <td className="py-2 px-4 text-center border border-gray-600">
                                        <span
                                            className={`inline-block cursor-pointer w-4 h-4 rounded-full ${service?.status ? "bg-emerald-500" : "bg-rose-500"}`}
                                        />
                                    </td>
                                    <td className="py-8 px-4 text-center border border-gray-600">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <button aria-label={`Editar ${service.serviceName}`} onClick={() => navigate(`/service/${service.id}/update`)}>
                                                <PenIcon className="w-4 h-4 text-cyan-500 cursor-pointer hover:text-cyan-400 transition-colors" />
                                            </button>
                                            <button aria-label={`Eliminar ${service.serviceName}`} onClick={() => {
                                                setIsDeleteModalOpen(true);
                                                setServiceToDelete(service);
                                            }}>
                                                <TrashIcon className="w-4 h-4 text-rose-500 cursor-pointer hover:text-rose-400 transition-colors" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        isAddModalOpen && (
                            <AddNewServiceModal
                                onClose={() => setIsAddModalOpen(false)}
                            />
                        )
                    }
                    {
                        isDeleteModalOpen && serviceToDelete && (
                            <DeleteModal
                                onClose={() => setIsDeleteModalOpen(false)}
                                elementToDelete={serviceToDelete}
                                mode="services"
                            />
                        )
                    }
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-400 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {servicesData.length} | Total{" "}
                        {servicesData.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Primera</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Anterior</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">1</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Siguiente</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Services };