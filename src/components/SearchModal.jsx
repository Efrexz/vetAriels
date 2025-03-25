import { ClientSearchInput } from './ClientSearchInput';
import SearchIcon from '@assets/searchIcon.svg?react';
import PropTypes from "prop-types";

function SearchModal({ onClose }) {

    return (
        <div
            className="fixed inset-0 z-50 flex  items-start justify-center pt-14 bg-gray-800 bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 modal-appear"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <h3 className="text-xl font-medium text-blue-500">Búsqueda</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form className="p-4 pb-6">
                    <div className="flex w-full rounded-l-lg">
                        <div className="flex items-center justify-center bg-gray-100 px-3">
                            <SearchIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <ClientSearchInput mode={"sales"} />
                    </div>

                </form>
            </div>
        </div>
    );
}

export { SearchModal };

SearchModal.propTypes = {
    onClose: PropTypes.func
}