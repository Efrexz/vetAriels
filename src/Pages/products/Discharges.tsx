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
        <section className="w-full p-6 bg-gray-950 text-gray-200">
            <h1 className="text-xl md:text-3xl items-center font-medium mb-4 pb-4 border-b-2 border-gray-700 flex">
                <DocumentOutIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-rose-600" />
                <span className="text-rose-600">
                    Descargas de stock
                </span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 border-b border-cyan-500 pb-4">
                <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-bold hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-md">Descargas Emitidas</button>
                <button className="w-full sm:w-auto bg-gray-800 text-cyan-400 py-3 px-6 rounded-xl font-bold border border-cyan-500 hover:bg-cyan-500 hover:text-white transition-all shadow-md">Por items</button>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-xl p-3 mb-6 border border-gray-700">
                <div className="p-4 rounded-lg mb-4 bg-gray-800 border-2 border-cyan-500/30">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex w-full md:w-[350px] border-gray-600 border rounded-lg overflow-hidden hover:border-cyan-500 focus-within:border-cyan-500">
                            <div className="flex items-center justify-center bg-gray-700 px-3">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por razón, responsable..."
                                className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent bg-gray-700 text-gray-200"
                                value={searchTerm}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <input
                            type="date"
                            className="w-full md:w-[250px] py-2 px-4 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors hover:border-cyan-500"
                            value={filterDate}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterDate(e.target.value)}
                        />
                        <button
                            className="w-full md:w-auto border border-gray-700 text-white bg-rose-600 py-2 px-4 rounded-xl hover:bg-rose-700 flex items-center justify-center gap-2 transition-colors"
                            onClick={() => navigate('/discharges/create')}
                        >
                            <PlusIcon className="w-5 h-5" />
                            DESCARGAR STOCK
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-700 rounded-lg">
                    <table className="min-w-full bg-gray-800 rounded-lg">
                        <thead className="bg-gray-700 border-b border-gray-700">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 text-center border border-gray-600 font-medium text-gray-300">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDischarges.map((discharge: InventoryOperation) => (
                                <tr key={discharge.id} className="hover:bg-gray-700 text-sm">
                                    <td className="text-center border border-gray-600 py-2 text-gray-400">{discharge.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="text-center border border-gray-600 py-2 text-gray-400">{discharge.date} {discharge.time}</td>
                                    <td className="px-4 text-left border border-gray-600 py-2 text-gray-400">{discharge.reason}</td>
                                    <td className="text-center border border-gray-600 py-2 text-gray-400">{discharge.responsible}</td>
                                    <td className="text-center border border-gray-600 py-2 text-gray-400">{discharge.registeredBy}</td>
                                    <td className="py-4 px-4 text-center border border-gray-600 ">
                                        <div className="flex justify-center items-center h-full">
                                            <button aria-label={`Ver detalle de descarga ${discharge.id}`} onClick={() => navigate(`/discharges/discharge/${discharge.id}/detail`)}>
                                                <SearchIcon className="w-5 h-5 text-green-500 hover:text-green-400 cursor-pointer" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-400 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {filteredDischarges.length} | Total{" "}
                        {filteredDischarges.length}
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

export { Discharges };