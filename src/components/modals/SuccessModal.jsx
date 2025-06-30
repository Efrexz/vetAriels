import PropTypes from "prop-types";
import AlertIcon from '@assets/alertIcon.svg?react';

function SuccessModal({ onClose }) {

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full h-auto max-w-xl mt-8 modal-appear mx-4">
                <div className="border-b border-gray-400 p-2 mb-4">
                    <p className="text-white text-left bg-green-500 mb-4 p-4 rounded-md">
                        {
                            <span className="flex items-center gap-2">
                                <AlertIcon className="w-5 h-5" />
                                Datos actualizados con éxito!
                            </span>
                        }
                    </p>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        className="bg-blue-400 border border-gray-300 text-white py-2 px-4 text-sm rounded hover:bg-blue-500 flex items-center"
                        onClick={() => onClose()}
                    >
                        ACEPTAR
                    </button>
                </div>
            </div>
        </div>
    );
}

export { SuccessModal };

SuccessModal.propTypes = {
    onClose: PropTypes.func,
    typeOfError: PropTypes.string
}