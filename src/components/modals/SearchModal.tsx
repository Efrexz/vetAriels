import { ClientSearchInput } from '@components/search/ClientSearchInput';
import SearchIcon from '@assets/searchIcon.svg?react';
import XIcon from '@assets/xIcon.svg?react';

interface SearchModalProps {
    onClose: () => void;
}

function SearchModal ({ onClose }: SearchModalProps)  {

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 z-10 modal-appear border border-gray-700 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <SearchIcon className="w-5 h-5 text-cyan-400" />
                        Buscar Cliente
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <span className="sr-only">Cerrar</span>
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4">

                    <div className="flex w-full rounded-lg overflow-hidden border border-gray-600 focus-within:border-cyan-400 transition-colors">
                        <div className="flex items-center justify-center bg-gray-900/50 px-4">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <ClientSearchInput mode={"sales"} />
                    </div>
                </div>

                <div className="p-4 pt-0 flex-grow overflow-y-auto">
                    <div className="text-center text-gray-500 text-sm mt-4">
                        <p>Los resultados de la búsqueda aparecerán aquí.</p>
                    </div>
                </div>
            </div>
        </div>
        );
}

export { SearchModal };