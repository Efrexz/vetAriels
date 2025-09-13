import {  useState, ChangeEvent } from 'react';
import { useClients } from '@context/ClientsContext';
import { ActionButtons } from '@components/ui/ActionButtons';
import { MedicalQueueItem , QueueState } from '@t/clinical.types';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

interface EditQueuePatientModalProps {
    onClose: () => void;
    queueData: MedicalQueueItem;
}

function EditQueuePatientModal({ onClose, queueData }: EditQueuePatientModalProps) {
    const { petsData, updatePetInQueueMedical } = useClients();

    const petsByOwner = petsData.filter(pet => pet.ownerId === queueData?.petData?.ownerId);

    // Estado del formulario
    const [selectedDoctor, setSelectedDoctor] = useState(queueData?.assignedDoctor);
    const [selectedPetId, setSelectedPetId] = useState(queueData?.petData?.id);

    const [notes, setNotes] = useState(queueData?.notes || '');
    const [status, setStatus] = useState<QueueState>(queueData?.state as QueueState);

    //De las mascotas filtradas por dueño, buscamos la que seleccionamos para poderle enviar de nuevo la nueva data
    const newPetDataSelected = petsByOwner.find(pet => pet.id === selectedPetId);

    function updateQueueData() {
        if (!newPetDataSelected) {
            console.error("No se pudo encontrar la mascota seleccionada.");
            return;
        }

        const dataToUpdate : Partial<MedicalQueueItem> = {
            ...queueData,
            assignedDoctor: selectedDoctor,
            petData: newPetDataSelected,
            notes,
            state: status,
        };
        updatePetInQueueMedical(queueData.id, dataToUpdate);
        onClose();
    }

    function handleSelectChange (e: ChangeEvent<HTMLSelectElement>) {
        const { id, value } = e.target;
        switch (id) {
            case 'doctor':
                setSelectedDoctor(value);
                break;
            case 'pet':
                setSelectedPetId(value);
                break;
            case 'status':
                setStatus(value as QueueState);
                break;
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center p-4 sm:p-6 z-50 overflow-y-auto">
            <div className="bg-gray-900 rounded-lg w-full max-w-3xl p-6 shadow-xl border border-gray-700 modal-appear mx-auto space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-500 mb-4 pb-2 border-b-2 border-gray-700">Generar Consulta</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-md font-semibold text-gray-400 mb-1">
                            Fecha de atención
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="date"
                                className="border border-gray-600 rounded-md bg-gray-800 text-gray-400 p-2 w-full focus-within:border-cyan-500 focus:outline-none transition-colors"
                                value={`${queueData?.dateOfAttention} ${queueData?.timeOfAttention}`}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="doctor" className="text-md font-semibold text-gray-400 mb-1">
                            Médico asignado
                        </label>
                        <select
                            id="doctor"
                            className="border border-gray-600 rounded-md bg-gray-800 text-gray-200 p-2 w-full hover:border-cyan-500 focus-within:border-cyan-500 focus:outline-none transition-colors"
                            value={selectedDoctor}
                            onChange={handleSelectChange}
                        >
                            <option>Médico 1</option>
                            <option>Médico 2</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="owner" className="text-md font-semibold text-gray-400 mb-1">
                            Propietario
                        </label>
                        <div className="flex items-center bg-gray-800 p-2 rounded-md border border-gray-600">
                            <RoleUserIcon className="w-5 h-5 mr-3 text-cyan-500" />
                            <span className="text-gray-200">{queueData?.petData?.ownerName}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="pet" className="text-md font-semibold text-gray-400 mb-1">
                            Mascota:
                        </label>
                        <select
                            id="pet"
                            className="border border-gray-600 rounded-md bg-gray-800 text-gray-200 p-2 w-full hover:border-cyan-500 focus-within:border-cyan-500 focus:outline-none transition-colors"
                            value={selectedPetId || ''}
                            onChange={handleSelectChange}
                        >
                            {petsByOwner?.map((pet) => (
                                <option key={pet.id} value={pet.id}>
                                    {pet.petName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="emergency"
                        className="mr-2 h-4 w-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                    />
                    <label htmlFor="emergency" className="text-sm text-gray-400">
                        Indicar atención como emergencia
                    </label>
                </div>
                <div className="flex flex-col mb-3">
                    <label htmlFor="notes" className="text-sm font-semibold text-gray-400 mb-1">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        className="border border-gray-600 rounded-md bg-gray-800 text-gray-200 p-2 w-full max-h-60 hover:border-cyan-500 focus-within:border-cyan-500 focus:outline-none transition-colors"
                        rows={4}
                        placeholder="Escribe las notas aquí..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex flex-col w-full sm:w-[50%] mb-4">
                    <label htmlFor="status" className="text-md font-semibold text-gray-400 mb-2">
                        Estado
                    </label>
                    <select
                        id="status"
                        className="border border-gray-600 rounded-md bg-gray-800 text-gray-200 p-2 w-full hover:border-cyan-500 focus-within:border-cyan-500 focus:outline-none transition-colors"
                        value={status}
                        onChange={handleSelectChange}
                    >
                        <option>Atendido</option>
                        <option>En espera</option>
                        <option>En atención</option>
                        <option>Suspendido</option>
                    </select>
                </div>
                <div className="border-t border-gray-700 pt-4">
                    <ActionButtons
                        onCancel={onClose}
                        onSubmit={updateQueueData}
                        submitText="GUARDAR CAMBIOS"
                        mode="modal"
                    />
                </div>
            </div>
        </div>
    );
}


export { EditQueuePatientModal };