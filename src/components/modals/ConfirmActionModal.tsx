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
import TrashIcon from '@assets/trashIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';

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
        title: "&iquest;Eliminar de la cola m&eacute;dica?",
        buttonText: "Confirmar eliminado",
        buttonColor: "bg-danger hover:opacity-90 shadow-danger/25",
    },
    deleteGrooming: {
        title: "&iquest;Eliminar de la cola de grooming?",
        buttonText: "Confirmar eliminado",
        buttonColor: "bg-danger hover:opacity-90 shadow-danger/25",
    },
    finishGrooming: {
        title: "&iquest;Marcar como terminado?",
        buttonText: "Confirmar terminado",
        buttonColor: "bg-primary hover:opacity-90 shadow-primary/25",
    },
    returnGrooming: {
        title: "&iquest;Regresar a la cola?",
        buttonText: "Confirmar regreso",
        buttonColor: "bg-amber hover:bg-amber-dark shadow-amber/25",
    },
    deleteUser: {
        title: "&iquest;Eliminar este usuario?",
        buttonText: "Confirmar eliminado",
        buttonColor: "bg-danger hover:opacity-90 shadow-danger/25",
    },
    deleteRecordAndNote: {
        title: "&iquest;Eliminar este registro?",
        buttonText: "Confirmar eliminado",
        buttonColor: "bg-danger hover:opacity-90 shadow-danger/25",
    },
    payments: {
        title: "Confirmar extorno de pago",
        buttonText: "Confirmar extorno",
        buttonColor: "bg-danger hover:opacity-90 shadow-danger/25",
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
        <div className="fixed inset-0 bg-ink/40 flex items-start justify-center z-50 pt-20">
            <div className="bg-paper rounded-2xl p-6 w-full max-w-lg shadow-sm modal-appear mx-4 border border-slate-200">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <h2 className="text-lg font-semibold font-display text-ink">
                        {config.title}
                    </h2>
                </div>
                {config.requiresReason && (
                    <div className="mb-4">
                        <label htmlFor="reason" className="block text-slate font-medium mb-2">
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
                            className={`w-full border rounded-xl p-2.5 bg-white text-ink text-sm placeholder:text-slate/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors ${
                                errorMessage ? 'border-danger' : 'border-slate-200'
                            }`}
                            required
                        />
                        {errorMessage && (
                            <p className="text-danger text-sm mt-1">{errorMessage}</p>
                        )}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-end border-t border-slate-100 pt-4 gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-slate rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors font-medium w-full md:w-auto"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={`px-5 py-2 ${config.buttonColor || "bg-danger hover:opacity-90"} text-white rounded-xl flex items-center w-full md:w-auto whitespace-nowrap transition-colors font-semibold font-display shadow-sm`}
                        onClick={typeOfOperationConfirm}
                    >
                        {typeOfOperation === 'deleteGrooming' || typeOfOperation === 'medical' || typeOfOperation === 'deleteUser' || typeOfOperation === 'deleteRecordAndNote' ? (
                            <TrashIcon className="w-5 h-5 mr-2" />
                        ) : typeOfOperation === 'returnGrooming' ? (
                            <ReturnIcon className="w-5 h-5 mr-2" />
                        ) : typeOfOperation === 'finishGrooming' ? (
                            <CheckIcon className="w-5 h-5 mr-2" />
                        ) : (
                            <DiskIcon className="w-5 h-5 mr-2" />
                        )}
                        {config.buttonText || "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export { ConfirmActionModal };
