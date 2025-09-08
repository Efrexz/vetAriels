import { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { InventoryOperation } from '@t/inventory.types';
import DocumentOutIcon from '@assets/documentOutIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';


const tableHeaders = ["N°", "Fecha de creación", "Razon", "Responsable", "Registrado por ", "Opciones"];

function Discharges() {
    const { dischargesData } = useProductsAndServices();
    console.log(dischargesData);
    
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterDate, setFilterDate] = useState<string>('');

    const filteredDischarges = useMemo(() => {
        return dischargesData.filter(discharge => {
            const lowerCaseSearch = searchTerm.toLowerCase();

            const matchesSearch =
                discharge.reason.toLowerCase().includes(lowerCaseSearch) ||
                discharge.responsible.toLowerCase().includes(lowerCaseSearch) ||
                discharge.registeredBy.toLowerCase().includes(lowerCaseSearch);

            return matchesSearch;
        });
    }, [dischargesData, searchTerm, filterDate]);


    return (
        <section className="container mx-auto p-6">
            <h1 className="text-xl md:text-3xl items-center font-medium text-red-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <DocumentOutIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                Descargas de stock
            </h1>

            <div className='flex gap-2 px-4 border-b-2 border-gray-200 mb-4'>
                <button className='bg-blue-400 text-white rounded-lg px-4 py-2 mb-4'>Descargas Emitidas</button>
                <button className='text-blue-400 rounded-lg px-4 py-2 mb-4 hover:bg-gray-50 hover:text-blue-500'>Por Items</button>
            </div>

            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex w-full md:w-[350px] border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                            <div className="flex items-center justify-center bg-gray-100 px-3">
                                <SearchIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por razón, responsable..."
                                className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <input
                            type="date"
                            className="w-full md:w-[250px] py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            value={filterDate}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterDate(e.target.value)}
                        />
                        <button
                            className="w-full md:w-auto border border-gray-300 text-white bg-red-500 py-2 px-4 rounded hover:bg-red-600 flex items-center justify-center gap-2"
                            onClick={() => navigate('/discharges/create')}
                        >
                            <PlusIcon className="w-5 h-5" />
                            DESCARGAR STOCK
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 text-center border font-medium text-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDischarges.map((discharge: InventoryOperation) => (
                                <tr key={discharge.id} className="hover:bg-gray-100 text-sm">
                                    <td className="text-center border">{discharge.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="text-center border">{discharge.date} {discharge.time}</td>
                                    <td className="px-4 text-start border">{discharge.reason}</td>
                                    <td className="text-center border">{discharge.responsible}</td>
                                    <td className="text-center border">{discharge.registeredBy}</td>
                                    <td className="py-4 px-4 text-center border">
                                        <div className="flex justify-center items-center h-full">
                                            <button aria-label={`Ver detalle de descarga ${discharge.id}`} onClick={() => navigate(`/discharges/discharge/${discharge.id}/detail`)}>
                                                <SearchIcon className="w-5 h-5 text-green-500 hover:text-green-600 cursor-pointer" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {filteredDischarges.length} | Total{" "}
                        {filteredDischarges.length}
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

export { Discharges };