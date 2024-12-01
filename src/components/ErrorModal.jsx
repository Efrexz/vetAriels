import PropTypes from "prop-types";

function ErrorModal({ onClose }) {

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full h-auto max-w-xl mt-8 modal-appear">
                <div className="border-b border-gray-400 p-2 mb-4">
                    <p className="text-white text-left bg-red-500 mb-4 p-4 rounded-md">
                        El formulario contiene errores.
                    </p>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 text-sm rounded hover:bg-gray-100 flex items-center"
                        onClick={() => onClose()}
                    >
                        ACEPTAR
                    </button>
                </div>

            </div>
        </div>
    );
}

export { ErrorModal };

ErrorModal.propTypes = {
    onClose: PropTypes.func
}

