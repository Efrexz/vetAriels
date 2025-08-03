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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 sm:p-6 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-lg modal-appear mx-auto space-y-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Generar Consulta</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-md font-semibold mb-1">
                            Fecha de atención
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="date"
                                className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300"
                                value={`${queueData?.dateOfAttention} ${queueData?.timeOfAttention}`}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="doctor" className="text-md font-semibold mb-1">
                            Médico asignado
                        </label>
                        <select
                            id="doctor"
                            className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                            value={selectedDoctor}
                            onChange={handleSelectChange}
                        >
                            <option>Médico 1</option>
                            <option>Médico 2</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="owner" className="text-md font-semibold mb-1">
                            Propietario
                        </label>
                        <div className="flex items-center bg-gray-100 p-2 rounded-md">
                            <RoleUserIcon className="w-5 h-5 mr-3 text-gray-600" />
                            <span>{queueData?.petData?.ownerName}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="pet" className="text-md font-semibold mb-1">
                            Mascota:
                        </label>
                        <select
                            id="pet"
                            className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                            value={selectedPetId || ''}
                            onChange={handleSelectChange}
                        >
                            {
                                petsByOwner?.map((pet) => (
                                    // agregamos el id al value para solucionar el error que no encontraba a la mascota seleccionad porque tomaba el nombre como valor y necesitaba era el id para el find
                                    <option key={pet.id} value={pet.id}>
                                        {pet.petName}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="emergency"
                        className="mr-2"
                    />
                    <label htmlFor="emergency" className="text-sm">
                        Indicar atención como emergencia
                    </label>
                </div>

                <div className="flex flex-col mb-3">
                    <label htmlFor="notes" className="text-sm font-semibold mb-1">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        className="border border-gray-300 rounded-md p-2 w-full max-h-60 hover:border-blue-300 focus-within:border-blue-300 focus:outline-none "
                        rows={4}
                        placeholder="Escribe las notas aquí..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex flex-col w-[50%] mb-4">
                    <label htmlFor="doctor" className="text-md font-semibold mb-2">
                        Estado
                    </label>
                    <select
                        id="status"
                        className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                        value={status}
                        onChange={handleSelectChange}
                    >
                        <option>Atendido</option>
                        <option>En espera</option>
                        <option>En atención</option>
                        <option>Suspendido</option>
                    </select>
                </div>

                <div className="border-t border-gray-300 pt-4">
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