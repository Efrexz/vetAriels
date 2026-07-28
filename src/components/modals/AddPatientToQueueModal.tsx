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
        <div className="fixed inset-0 flex justify-center items-start bg-ink/40 z-50 overflow-y-scroll p-3">
            <div className="bg-paper rounded-2xl border border-slate-200 w-full max-w-3xl p-6 shadow-sm modal-appear mx-auto space-y-6">
                <h2 className="text-xl font-semibold text-ink font-display border-b border-slate-200 pb-2">Generar Consulta</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-sm font-medium mb-1 text-slate">
                            Fecha de atención
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="date"
                                className="border border-slate-200 rounded-lg p-2 w-full bg-white text-ink cursor-not-allowed"
                                value={`${currentDate} ${currentTime}`}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="doctor" className="text-sm font-medium mb-1 text-slate">
                            Médico asignado
                        </label>
                        <select
                            id="doctor"
                            className="border border-slate-200 rounded-lg p-2 w-full bg-white text-ink hover:border-primary focus-within:border-primary focus:outline-none"
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                        >
                            <option>Médico 1</option>
                            <option>Médico 2</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="owner" className="text-sm font-medium mb-1 text-slate">
                            Propietario
                        </label>
                        <div className="flex items-center bg-white p-2 rounded-lg text-ink">
                            <RoleUserIcon className="w-5 h-5 mr-3 text-primary" />
                            <span>{clientData.firstName} {clientData.lastName}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="pet" className="text-sm font-medium mb-1 text-slate">
                            Mascota:
                        </label>
                        <select
                            id="pet"
                            className={`border rounded-lg p-2 w-full bg-white text-ink ${isPetDataMissing ? "border-danger outline-none" : "border-slate-200 hover:border-primary focus-within:border-primary focus:outline-none"}`}
                            onChange={(e) => setSelectedPetId(e.target.value)}
                        >
                            {petsByOwner?.map((pet) => (
                                <option key={pet.id} value={pet.id}>{pet.petName}</option>
                            ))}
                        </select>
                        {isPetDataMissing && (
                            <p className="text-danger text-sm mt-1">Debe seleccionar una mascota</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="emergency"
                        className="mr-2 h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="emergency" className="text-sm text-slate">
                        Indicar atención como emergencia
                    </label>
                </div>

                <div className="flex flex-col border-b border-slate-200 pb-4">
                    <label htmlFor="notes" className="text-sm font-medium mb-1 text-slate">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        className="border border-slate-200 rounded-lg p-2 w-full max-h-60 bg-white text-ink hover:border-primary focus-within:border-primary focus:outline-none"
                        rows={4}
                        placeholder="Escribe las notas aquí..."
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <ActionButtons
                    onCancel={onClose}
                    onSubmit={sendPatientToQueue}
                    submitText="Enviar a la cola"
                    mode="modal"
                />
            </div>
        </div>
    );
}

export { AddPatientToQueueModal };