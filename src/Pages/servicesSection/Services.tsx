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
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Cat&aacute;logo de servicios
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Servicios
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <div className="flex items-center w-full md:w-[350px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary">
                            <div className="flex items-center justify-center px-3">
                                <SearchIcon className="w-4 h-4 text-slate" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full py-2 px-2 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className="ml-auto border border-slate-200 text-white bg-primary py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 w-full md:w-auto transition-colors font-semibold font-display shadow-sm shadow-primary/25"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nuevo servicio
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {filterOptions.map((filter) => (
                            <div key={filter.type} className="w-full sm:w-[220px]">
                                <select
                                    name={filter.type}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
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
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                                <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-sm text-slate">{service?.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">
                                        <span className="block">{service?.registrationDate}</span>
                                        <span className="block text-xs text-slate">{service?.registrationTime}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-medium">{service?.serviceName}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{service?.line}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{service?.category}</td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-medium">{service?.salePrice}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`inline-block w-3 h-3 rounded-full ${service?.status ? "bg-success" : "bg-danger"}`}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <button aria-label={`Editar ${service.serviceName}`} onClick={() => navigate(`/service/${service.id}/update`)}
                                                className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors"
                                            >
                                                <PenIcon className="w-4 h-4" />
                                            </button>
                                            <button aria-label={`Eliminar ${service.serviceName}`} onClick={() => {
                                                setIsDeleteModalOpen(true);
                                                setServiceToDelete(service);
                                            }}
                                                className="p-1.5 rounded-lg text-slate hover:text-danger hover:bg-danger/10 transition-colors"
                                            >
                                                <TrashIcon className="w-4 h-4" />
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

                <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
                    <p className="text-slate text-sm">
                        Registros 1&ndash;{servicesData.length} de {servicesData.length}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Primera</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Anterior</button>
                        <button className="py-1.5 px-3 rounded-lg text-sm bg-primary text-white font-semibold transition-colors">1</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Siguiente</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">&Uacute;ltima</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Services };