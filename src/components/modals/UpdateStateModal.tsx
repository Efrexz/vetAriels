import {  useState, ChangeEvent  } from 'react';
import { useClients } from '@context/ClientsContext';
import { GroomingQueueItem } from '@t/clinical.types';
import DiskIcon from '@assets/diskIcon.svg?react';

type ModalMode = "history" | "grooming";

type QueueItemState = "Pendiente" | "Terminado" | "En espera" | "En Atención" | "Suspendido";


interface UpdateStateModalProps {
    dataToUpdate: GroomingQueueItem;
    mode: ModalMode;
    onClose: () => void;
}


function UpdateStateModal({ dataToUpdate, onClose, mode }: UpdateStateModalProps) {

    const { updatePetInQueueGroomingHistory, updatePetInQueueGrooming } = useClients();

    const [state, setState] = useState<QueueItemState>(dataToUpdate?.state);

    function updateState() {
        const updatedData = {
            ...dataToUpdate,
            state: state,
        };
        if (mode === "history") {
            updatePetInQueueGroomingHistory(dataToUpdate.id, updatedData);
        } else if (mode === "grooming") {
            updatePetInQueueGrooming(dataToUpdate.id, updatedData);
        }
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg modal-appear">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-600">
                        Actualizar estado
                    </h2>
                </div>

                <div className="mb-6 border-t border-gray-300 pt-4">
                    <label htmlFor="order-status" className="block font-light mb-2">
                        Estado:
                    </label>
                    <select
                        id="order-status"
                        name="orderStatus"
                        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 p-2"
                        value={state}
                        onChange={(e) => setState(e.target.value as QueueItemState)}
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En atención">En atención</option>
                        <option value="Terminado">Terminado</option>
                        {
                            mode === "history" && (
                                <option value="Entregado">Entregado</option>
                            )
                        }

                    </select>
                </div>

                <div className="flex justify-end space-x-2 border-t border-gray-300 pt-4 text-sm">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        CANCELAR
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center"
                        onClick={updateState}
                    >
                        <DiskIcon className="w-5 h-5 mr-2" />
                        ACTUALIZAR ESTADO
                    </button>
                </div>
            </div>
        </div>
    );
}

export { UpdateStateModal };
