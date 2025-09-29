import {  useState, ChangeEvent  } from 'react';
import { useClients } from '@context/ClientsContext';
import { GroomingQueueItem } from '@t/clinical.types';
import DiskIcon from '@assets/diskIcon.svg?react';

type ModalMode = "history" | "grooming";

type QueueItemState = 'Pendiente' | 'Terminado' | 'En espera' | 'En Atención' | 'Suspendido' | 'Entregado';


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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-start justify-center z-50 pt-20">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl modal-appear border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-cyan-500">
                        Actualizar estado
                    </h2>
                </div>

                <div className="mb-6 border-t border-gray-700 pt-4">
                    <label htmlFor="order-status" className="block text-gray-400 font-medium mb-2">
                        Estado:
                    </label>
                    <select
                        id="order-status"
                        name="orderStatus"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 px-4 py-2 text-gray-200"
                        value={state}
                        onChange={(e) => setState(e.target.value as QueueItemState)}
                    >
                        <option className="bg-gray-700" value="Pendiente">Pendiente</option>
                        <option className="bg-gray-700" value="En Atención">En atención</option>
                        <option className="bg-gray-700" value="Terminado">Terminado</option>
                        {
                            mode === "history" && (
                                <option className="bg-gray-700" value="Entregado">Entregado</option>
                            )
                        }
                    </select>
                </div>

                <div className="flex justify-end space-x-2 border-t border-gray-700 pt-4 text-sm">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        CANCELAR
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center transition-colors"
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
