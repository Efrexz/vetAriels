import PropTypes from "prop-types";
import AlertIcon from '@assets/alertIcon.svg?react';

function ErrorModal({ onClose, typeOfError }) {

    const errorMessages = {
        stock: "El producto seleccionado no tiene stock disponible.",
        form: "El formulario contiene errores.",
        permission: "No tienes permisos para realizar esta acción.",
        password: "La contraseña ingresada no es correcta.",
        default: "Ha ocurrido un error inesperado.",
    };

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full h-auto max-w-xl mt-8 modal-appear">
                <div className="border-b border-gray-400 p-2 mb-4">
                    <p className="text-white text-left bg-red-500 mb-4 p-4 rounded-md">
                        {
                            <span className="flex items-center gap-2">
                                <AlertIcon className="w-5 h-5" />
                                {
                                    errorMessages[typeOfError] || errorMessages.default
                                }
                            </span>
                        }
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
    onClose: PropTypes.func,
    typeOfError: PropTypes.string
}

