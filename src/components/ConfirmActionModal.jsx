import { useContext, useState } from 'react';
import { ClientsContext } from '@context/ClientsContext';
import { FinancialContext } from '@context/FinancialContext';
import DiskIcon from '@assets/diskIcon.svg?react';
import PropTypes from "prop-types";

function ConfirmActionModal({ elementData, onClose, typeOfOperation }) {
    const { removePetFromQueueMedical,
        removePetFromQueueGrooming,
        addPetInQueueGroomingHistory,
        returnPetToQueueGrooming
    } = useContext(ClientsContext);
    const { removePayment } = useContext(FinancialContext);

    const [reasonToDelete, setReasonToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState(false);

    function typeOfOperationConfirm() {
        if (typeOfOperation === "medical") {
            removePetFromQueueMedical(elementData.id);
        } else if (typeOfOperation === "deleteGrooming") {
            removePetFromQueueGrooming(elementData.id);
        } else if (typeOfOperation === "finishGrooming") {
            removePetFromQueueGrooming(elementData.id);
            addPetInQueueGroomingHistory(elementData);
        } else if (typeOfOperation === "returnGrooming") {
            returnPetToQueueGrooming(elementData);
        } else if (typeOfOperation === "payments") {
            // Validamos si el motivo de la eliminación es válido y verificamos que no tenga espacios en blanco
            if (!reasonToDelete || reasonToDelete.trim().length === 0) {
                setErrorMessage("Debe ingresar un motivo.");
                return;
            } else if (reasonToDelete.trim().length < 4) {
                setErrorMessage("El motivo debe tener al menos 4 caracteres.");
                return;
            }
            removePayment(elementData.id);
        }
        onClose();
    }

    const title = {
        finishGrooming: "¿Marcar como terminado?",
        returnGrooming: "¿Regresar a la cola?",
    }

    const operationConfig = {
        finishGrooming: {
            color: "bg-green-500 hover:bg-green-600",
            text: "CONFIRMAR TERMINADO",
        },
        returnGrooming: {
            color: "bg-orange-500 hover:bg-orange-600",
            text: "CONFIRMAR REGRESO",
        },
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg modal-appear mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-600">
                        {title[typeOfOperation] || "¿Estás seguro de esta acción?"}
                    </h2>
                </div>

                {typeOfOperation === "payments" && (
                    <div className="mb-4">
                        <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                            ¿Cuál es el motivo del extorno?
                        </label>
                        <input
                            type="text"
                            id="reason"
                            name="confirmation"
                            value={reasonToDelete}
                            onChange={(e) => {
                                setReasonToDelete(e.target.value);
                                setErrorMessage("");
                            }}
                            placeholder="Escribe el motivo aquí"
                            className={`w-full border rounded-md p-2 focus:outline-none ${errorMessage ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {errorMessage && (
                            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                        )}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end border-t border-gray-300 pt-4 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400 w-full md:w-auto"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 ${operationConfig[typeOfOperation]?.color || "bg-red-500 hover:bg-red-600"} text-white rounded-lg flex items-center w-full md:w-auto whitespace-nowrap`}
                        onClick={typeOfOperationConfirm}
                    >
                        <DiskIcon className="w-5 h-5 mr-2" />
                        {operationConfig[typeOfOperation]?.text || "CONFIRMAR ELIMINADO"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export { ConfirmActionModal };

ConfirmActionModal.propTypes = {
    elementData: PropTypes.object,
    typeOfOperation: PropTypes.string,
    onClose: PropTypes.func
}