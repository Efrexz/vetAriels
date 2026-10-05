import { useState } from 'react';
import { useClients } from '@context/ClientsContext';
import { useVetProfilesQuery } from '@hooks/useQueuesQuery';
import { useToast } from '@context/ToastContext';
import { Pet, Client } from '@t/client.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

interface AddPatientToQueueModalProps {
    onClose: () => void;
    petsByOwner: Pet[];
    clientData: Client;
}

function AddPatientToQueueModal({ onClose, petsByOwner, clientData }: AddPatientToQueueModalProps) {

    const { addPetToQueueMedical } = useClients();
    const { data: doctors = [] } = useVetProfilesQuery();
    const { toast } = useToast();
    // Estado del formulario
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id ?? '');
    const [selectedPetId, setSelectedPetId] = useState<string | undefined>(petsByOwner[0]?.id);
    const [isPetDataMissing, setIsPetDataMissing] = useState(false); // Estado para mostrar error si no se selecciona mascota
    const [notes, setNotes] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    //obtenemos la fecha y la hora actuales a la cual se esta enviando a cola al paciente
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();

    // Manejo del envío del formulario
    async function sendPatientToQueue() {
        const petSelected = petsByOwner?.find(pet => pet.id === selectedPetId);
        if (!petSelected) {
            setIsPetDataMissing(true);
            return;
        }

        setIsSubmitting(true);
        try {
            // La DB guarda assigned_doctor_id (FK a profiles); el nombre
            // mostrado viene del JOIN al listar la cola.
            await addPetToQueueMedical({
                id: '',
                assignedDoctor: doctors.find((d) => d.id === selectedDoctorId)?.label ?? '',
                assignedDoctorId: selectedDoctorId || null,
                petData: petSelected,
                ownerName: petSelected.ownerName,
                notes,
                dateOfAttention: currentDate,
                timeOfAttention: currentTime,
                state: 'En espera',
            });
            toast.success('Paciente agregado a la sala de espera.');
            onClose();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo agregar a la cola.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-ink/40 z-50 overflow-y-scroll p-3">
            <div className="bg-paper rounded-2xl border border-slate-200 w-full max-w-3xl p-6 shadow-sm modal-appear mx-auto space-y-6">
                <h2 className="text-lg font-semibold font-display text-ink border-b border-slate-200 pb-2">Generar Consulta</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-sm font-medium mb-1 text-ink">
                            Fecha de atención
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="date"
                                className="border border-slate-200 rounded-xl p-2 w-full bg-white text-ink cursor-not-allowed"
                                value={`${currentDate} ${currentTime}`}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="doctor" className="text-sm font-medium mb-1 text-ink">
                            Médico asignado
                        </label>
                        <select
                            id="doctor"
                            className="border border-slate-200 rounded-xl p-2 w-full bg-white text-ink focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none"
                            value={selectedDoctorId}
                            onChange={(e) => setSelectedDoctorId(e.target.value)}
                        >
                            {doctors.length === 0 && <option value="">Cargando médicos...</option>}
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>{doctor.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="owner" className="text-sm font-medium mb-1 text-ink">
                            Propietario
                        </label>
                        <div className="flex items-center bg-white p-2 rounded-xl text-ink">
                            <RoleUserIcon className="w-5 h-5 mr-3 text-primary" />
                            <span>{clientData.firstName} {clientData.lastName}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="pet" className="text-sm font-medium mb-1 text-ink">
                            Mascota:
                        </label>
                        <select
                            id="pet"
                            className={`border rounded-xl p-2 w-full bg-white text-ink ${isPetDataMissing ? "border-danger outline-none" : "border-slate-200 focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none"}`}
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
                        className="mr-2 h-4 w-4 text-primary bg-white border-slate-200 rounded focus:ring-primary/30 focus:border-primary"
                    />
                    <label htmlFor="emergency" className="text-sm text-ink">
                        Indicar atención como emergencia
                    </label>
                </div>

                <div className="flex flex-col border-b border-slate-200 pb-4">
                    <label htmlFor="notes" className="text-sm font-medium mb-1 text-ink">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        className="border border-slate-200 rounded-xl p-2 w-full max-h-60 bg-white text-ink focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none"
                        rows={4}
                        placeholder="Escribe las notas aquí..."
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <ActionButtons
                    onCancel={onClose}
                    onSubmit={sendPatientToQueue}
                    submitText={isSubmitting ? 'Agregando...' : 'Enviar a la cola'}
                    mode="modal"
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );
}

export { AddPatientToQueueModal };