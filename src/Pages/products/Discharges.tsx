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
        <section className="w-full p-1 md:p-6 bg-mist text-ink">
            <h1 className="text-xl md:text-2xl items-center font-medium mb-4 pb-4 border-b-2 border-slate-200 flex">
                <DocumentOutIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-rose-600" />
                <span className="text-rose-600">
                    Descargas de stock
                </span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 border-b border-primary pb-4">
                <button className="w-full sm:w-auto bg-primary text-white py-1.5 px-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-sm shadow-primary/25">Descargas Emitidas</button>
                <button className="w-full sm:w-auto bg-paper text-ink py-1.5 px-4 rounded-xl font-bold border border-primary hover:bg-primary hover:text-white transition-all shadow-sm">Por items</button>
            </div>

            <div className="bg-paper rounded-2xl shadow-sm p-3 mb-6 border border-slate-200">
                <div className="px-4 py-2 rounded-lg mb-4 bg-paper border-2 border-slate-200">
                    <div className="flex flex-wrap items-center gap-4 mb-4 ">
                        <div className="flex w-full md:w-[350px] border-slate-200 border rounded-lg overflow-hidden hover:border-primary focus-within:border-primary">
                            <div className="flex items-center justify-center bg-white px-3">
                                <SearchIcon className="w-5 h-5 text-slate" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por razón, responsable..."
                                className="w-full py-1 px-4 focus:outline-none focus:ring-0 focus:border-transparent bg-white text-ink"
                                value={searchTerm}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <input
                            type="date"
                            className="w-full md:w-[250px] py-1 px-4 border border-slate-200 rounded-lg bg-white text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-colors hover:border-primary"
                            value={filterDate}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterDate(e.target.value)}
                        />
                        <button
                            className="w-full md:w-auto border border-slate-200 text-white bg-rose-600 py-1 px-4 rounded-xl hover:opacity-90 font-semibold font-display shadow-sm shadow-primary/25 flex items-center justify-center gap-2 transition-colors"
                            onClick={() => navigate('/discharges/create')}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Descargar stock
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-1 px-4 text-center font-bold text-ink text-sm">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDischarges.map((discharge: InventoryOperation) => (
                                <tr key={discharge.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-sm">
                                    <td className="text-center py-2 text-slate">{discharge.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="text-center py-2 text-slate">{discharge.date} {discharge.time}</td>
                                    <td className="px-4 text-left py-2 text-slate">{discharge.reason}</td>
                                    <td className="text-center py-2 text-slate">{discharge.responsible}</td>
                                    <td className="text-center py-2 text-slate">{discharge.registeredBy}</td>
                                    <td className="py-1 px-4 text-center">
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
                    <p className="text-slate text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {filteredDischarges.length} | Total{" "}
                        {filteredDischarges.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-1 px-4 border border-slate-200 rounded-lg text-slate bg-white hover:bg-slate-100 transition-colors">Primera</button>
                        <button className="py-1 px-4 border border-slate-200 rounded-lg text-slate bg-white hover:bg-slate-100 transition-colors">Anterior</button>
                        <button className="py-1 px-4 border border-slate-200 rounded-lg bg-primary text-white hover:opacity-90 transition-colors">1</button>
                        <button className="py-1 px-4 border border-slate-200 rounded-lg text-slate bg-white hover:bg-slate-100 transition-colors">Siguiente</button>
                        <button className="py-1 px-4 border border-slate-200 rounded-lg text-slate bg-white hover:bg-slate-100 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Discharges };
