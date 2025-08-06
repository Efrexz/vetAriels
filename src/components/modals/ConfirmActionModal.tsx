import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { useFinancial } from '@context/FinancialContext';
import { useGlobal } from '@context/GlobalContext';
import { MedicalQueueItem, GroomingQueueItem } from '@t/clinical.types';
import { User } from '@t/user.types';
import { PetRecord } from '@t/client.types';
import { Payment } from '@t/financial.types';
import DiskIcon from '@assets/diskIcon.svg?react';

type OperationType = "medical" | "deleteGrooming" | "finishGrooming" | "returnGrooming" | "deleteUser" | "deleteRecordAndNote" | "payments";

type ElementDataType = MedicalQueueItem | GroomingQueueItem | User | PetRecord | Payment;

type OperationConfig = {
    title: string;
    buttonText: string;
    buttonColor: string;
    requiresReason?: boolean;
};

const operationConfig: Record<OperationType, OperationConfig> = {
    medical: {
        title: "¿Eliminar de la cola médica?",
        buttonText: "CONFIRMAR ELIMINADO",
        buttonColor: "bg-red-500 hover:bg-red-600",
    },
    deleteGrooming: {
        title: "¿Eliminar de la cola de grooming?",
        buttonText: "CONFIRMAR ELIMINADO",
        buttonColor: "bg-red-500 hover:bg-red-600",
    },
    finishGrooming: {
        title: "¿Marcar como terminado?",
        buttonText: "CONFIRMAR TERMINADO",
        buttonColor: "bg-green-500 hover:bg-green-600",
    },
    returnGrooming: {
        title: "¿Regresar a la cola?",
        buttonText: "CONFIRMAR REGRESO",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
    },
    deleteUser: {
        title: "¿Eliminar este usuario?",
        buttonText: "CONFIRMAR ELIMINADO",
        buttonColor: "bg-red-500 hover:bg-red-600",
    },
    deleteRecordAndNote: {
        title: "¿Eliminar este registro?",
        buttonText: "CONFIRMAR ELIMINADO",
        buttonColor: "bg-red-500 hover:bg-red-600",
    },
    payments: {
        title: "Confirmar extorno de pago",
        buttonText: "CONFIRMAR EXTORNO",
        buttonColor: "bg-red-500 hover:bg-red-600",
        requiresReason: true,
    },
};

interface ConfirmActionModalProps {
    elementData: ElementDataType;
    onClose: () => void;
    typeOfOperation: OperationType;
}


function ConfirmActionModal({ elementData, onClose, typeOfOperation } : ConfirmActionModalProps){

    const { id: petId } = useParams<{ id: string }>();
    const { removePetFromQueueMedical,removePetFromQueueGrooming,addPetInQueueGroomingHistory,returnPetToQueueGrooming,removeRecord} = useClients();
    const { removePayment } = useFinancial();
    const { removeUser } = useGlobal();

    const [reasonToDelete, setReasonToDelete] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const config = operationConfig[typeOfOperation];

    function typeOfOperationConfirm() {
        // Verificamos si el motivo es requerido para la operación
        if (config.requiresReason) {
            if (!reasonToDelete.trim() || reasonToDelete.trim().length < 4) {
                setErrorMessage("El motivo debe tener al menos 4 caracteres.");
                return;
            }
        }

        switch (typeOfOperation) {
            case "payments":
                removePayment(elementData.id);
                break;
            case "medical":
                removePetFromQueueMedical(elementData.id);
                break;
            case "deleteGrooming":
                removePetFromQueueGrooming(elementData.id);
                break;
            case "finishGrooming":
                if ('turn' in elementData) {
                    removePetFromQueueGrooming(elementData.id);
                    addPetInQueueGroomingHistory(elementData);
                }
                break;
            case "returnGrooming":
                if ('turn' in elementData) {
                    returnPetToQueueGrooming(elementData);
                }
                break;
            case "deleteUser":
                removeUser(elementData.id);
                break;
            case "deleteRecordAndNote":
                if (petId) {
                    removeRecord(petId, elementData.id);
                }
                break;
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg modal-appear mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-600">
                        {config.title}
                    </h2>
                </div>

                {config.requiresReason && (
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
                        className={`px-4 py-2 ${config.buttonColor || "bg-red-500 hover:bg-red-600"} text-white rounded-lg flex items-center w-full md:w-auto whitespace-nowrap`}
                        onClick={typeOfOperationConfirm}
                    >
                        <DiskIcon className="w-5 h-5 mr-2" />
                        {config.buttonText || "CONFIRMAR ELIMINADO"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export { ConfirmActionModal };
