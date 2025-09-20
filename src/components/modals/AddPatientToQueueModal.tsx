import { useState } from 'react';
import { useClients } from '@context/ClientsContext';
import { Pet, Client } from '@t/client.types';
import { MedicalQueueItem } from '@t/clinical.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import { generateUniqueId } from '@utils/idGenerator';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

interface AddPatientToQueueModalProps {
    onClose: () => void;
    petsByOwner: Pet[];
    clientData: Client;
}

function AddPatientToQueueModal({ onClose, petsByOwner, clientData }: AddPatientToQueueModalProps) {

    const { addPetToQueueMedical } = useClients();
    // Estado del formulario
    const [selectedDoctor, setSelectedDoctor] = useState<string>("Médico 1");
    const [selectedPetId, setSelectedPetId] = useState<string | undefined>(petsByOwner[0]?.id);
    const [isPetDataMissing, setIsPetDataMissing] = useState(false); // Estado para mostrar error si no se selecciona mascota
    const [notes, setNotes] = useState<string>('');

    //obtenemos la fecha y la hora actuales a la cual se esta enviando a cola al paciente
    const now = new Date();
    const currentDate = now.toLocaleDateString(); //  "22/05/2023"
    const currentTime = now.toLocaleTimeString(); //    "07:43 PM"

    // Manejo del envío del formulario
    function sendPatientToQueue() {
        const petSelected = petsByOwner?.find(pet => pet.id === selectedPetId);
        if (!petSelected) {// Si no se selecciona mascota, mostramos error
            setIsPetDataMissing(true);
            return;
        }

        const dataToSend: MedicalQueueItem = {
            id: generateUniqueId(),
            assignedDoctor: selectedDoctor,
            petData: petSelected,
            ownerName: petSelected.ownerName,
            notes,
            dateOfAttention: currentDate,
            timeOfAttention: currentTime,
            state: "En espera",
        };

        // agregamos el paciente a la cola médica
        addPetToQueueMedical(dataToSend);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex justify-center items-center z-50 p-4 sm:p-6 overflow-y-auto">
            <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-3xl p-6 shadow-2xl modal-appear mx-auto space-y-6">
                <h2 className="text-xl font-semibold text-cyan-500 border-b border-gray-700 pb-2">Generar Consulta</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-sm font-medium mb-1 text-gray-400">
                            Fecha de atención
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="date"
                                className="border border-gray-700 rounded-lg p-2 w-full bg-gray-800 text-gray-300 cursor-not-allowed"
                                value={`${currentDate} ${currentTime}`}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="doctor" className="text-sm font-medium mb-1 text-gray-400">
                            Médico asignado
                        </label>
                        <select
                            id="doctor"
                            className="border border-gray-700 rounded-lg p-2 w-full bg-gray-800 text-gray-200 hover:border-cyan-500 focus-within:border-cyan-500 focus:outline-none"
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                        >
                            <option>Médico 1</option>
                            <option>Médico 2</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="owner" className="text-sm font-medium mb-1 text-gray-400">
                            Propietario
                        </label>
                        <div className="flex items-center bg-gray-700 p-2 rounded-lg text-gray-300">
                            <RoleUserIcon className="w-5 h-5 mr-3 text-cyan-400" />
                            <span>{clientData.firstName} {clientData.lastName}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="pet" className="text-sm font-medium mb-1 text-gray-400">
                            Mascota:
                        </label>
                        <select
                            id="pet"
                            className={`border rounded-lg p-2 w-full bg-gray-800 text-gray-200 ${isPetDataMissing ? "border-rose-500 outline-none" : "border-gray-700 hover:border-cyan-500 focus-within:border-cyan-500 focus:outline-none"}`}
                            onChange={(e) => setSelectedPetId(e.target.value)}
                        >
                            {petsByOwner?.map((pet) => (
                                <option key={pet.id} value={pet.id}>{pet.petName}</option>
                            ))}
                        </select>
                        {isPetDataMissing && (
                            <p className="text-rose-500 text-sm mt-1">Debe seleccionar una mascota</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="emergency"
                        className="mr-2 h-4 w-4 text-emerald-600 border-gray-700 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="emergency" className="text-sm text-gray-400">
                        Indicar atención como emergencia
                    </label>
                </div>

                <div className="flex flex-col border-b border-gray-700 pb-4">
                    <label htmlFor="notes" className="text-sm font-medium mb-1 text-gray-400">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        className="border border-gray-700 rounded-lg p-2 w-full max-h-60 bg-gray-800 text-gray-200 hover:border-cyan-500 focus-within:border-cyan-500 focus:outline-none"
                        rows={4}
                        placeholder="Escribe las notas aquí..."
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <ActionButtons
                    onCancel={onClose}
                    onSubmit={sendPatientToQueue}
                    submitText="ENVIAR A LA COLA"
                    mode="modal"
                />
            </div>
        </div>
    );
}

export { AddPatientToQueueModal };