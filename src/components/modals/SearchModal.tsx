import { ClientSearchInput } from '@components/search/ClientSearchInput';
import SearchIcon from '@assets/searchIcon.svg?react';
import XIcon from '@assets/xIcon.svg?react';

interface SearchModalProps {
    onClose: () => void;
}

function SearchModal ({ onClose }: SearchModalProps)  {

    return (
        <div
            className="fixed inset-0 z-90 flex items-start justify-center pt-20 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-paper rounded-2xl shadow-sm w-full max-w-lg mx-4 z-90 modal-appear border border-slate-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 flex-shrink-0">
                    <h3 className="text-lg font-semibold font-display text-ink flex items-center gap-2">
                        <SearchIcon className="w-5 h-5 text-primary" />
                        Buscar Cliente
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate hover:text-ink transition-colors"
                    >
                        <span className="sr-only">Cerrar</span>
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4">

                    <div className="flex w-full rounded-xl overflow-hidden border border-slate-200 focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary transition-colors">
                        <div className="flex items-center justify-center bg-white px-4">
                            <SearchIcon className="w-5 h-5 text-slate" />
                        </div>
                        <ClientSearchInput mode={"sales"} />
                    </div>
                </div>

                <div className="p-4 pt-0 flex-grow overflow-y-auto">
                    <div className="text-center text-slate text-sm mt-4">
                        <p>Los resultados de la búsqueda aparecerán aquí.</p>
                    </div>
                </div>
            </div>
        </div>
        );
}

export { SearchModal };