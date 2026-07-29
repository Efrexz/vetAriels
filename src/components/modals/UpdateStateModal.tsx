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
        <div className="fixed inset-0 bg-ink/40 flex items-start justify-center z-50 pt-20">
            <div className="bg-paper rounded-2xl p-6 w-full max-w-lg shadow-sm modal-appear border border-slate-200 m-3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold font-display text-ink">
                        Actualizar estado
                    </h2>
                </div>

                <div className="mb-6 border-t border-slate-200 pt-4">
                    <label htmlFor="order-status" className="block text-ink font-medium mb-2">
                        Estado:
                    </label>
                    <select
                        id="order-status"
                        name="orderStatus"
                        className="w-full bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary px-4 py-2 text-ink"
                        value={state}
                        onChange={(e) => setState(e.target.value as QueueItemState)}
                    >
                        <option className="bg-white" value="Pendiente">Pendiente</option>
                        <option className="bg-white" value="En Atención">En atención</option>
                        <option className="bg-white" value="Terminado">Terminado</option>
                        {
                            mode === "history" && (
                                <option className="bg-white" value="Entregado">Entregado</option>
                            )
                        }
                    </select>
                </div>

                <div className="flex justify-end space-x-2 border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-200 bg-white text-slate rounded-xl hover:bg-slate-100 transition-colors font-medium text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="px-5 py-2 bg-primary hover:opacity-90 text-white rounded-xl flex items-center transition-colors text-sm font-semibold font-display shadow-sm shadow-primary/25"
                        onClick={updateState}
                    >
                        <DiskIcon className="w-5 h-5 mr-2" />
                        Actualizar estado
                    </button>
                </div>
            </div>
        </div>
    );
}

export { UpdateStateModal };
