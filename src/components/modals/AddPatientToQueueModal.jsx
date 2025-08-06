import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { ClientsContext } from '@context/ClientsContext';
import { ActionButtons } from '@components/ui/ActionButtons';
import { generateUniqueId } from '@utils/idGenerator';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';


function AddPatientToQueueModal({ onClose, petsByOwner, clientData }) {
    // Estado del formulario
    const [selectedDoctor, setSelectedDoctor] = useState("Medico 1");
    const [selectedPet, setSelectedPet] = useState(petsByOwner[0]?.petName);
    const [isPetDataMissing, setIsPetDataMissing] = useState(false); // Estado para mostrar error si no se selecciona mascota
    const [notes, setNotes] = useState('');

    //obtenemos la fecha y la hora actuales a la cual se esta enviando a cola al paciente
    const now = new Date();
    const currentDate = now.toLocaleDateString(); //  "22/05/2023"
    const currentTime = now.toLocaleTimeString(); //    "07:43 PM"

    const { addPetToQueueMedical } = useContext(ClientsContext);

    // Manejo del envío del formulario
    function sendPatientToQueue() {
        const petSelected = petsByOwner?.find(pet => pet.petName === selectedPet);
        if (!petSelected) {// Si no se selecciona mascota, mostramos error
            setIsPetDataMissing(true);
            return;
        }

        const dataToSend = {
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

        // cerramos el modal después de enviar los datos
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-lg modal-appear mx-auto space-y-6">
                <h2 className="text-lg font-semibold text-gray-700">Generar Consulta</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-sm font-medium mb-1">
                            Fecha de atención
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="date"
                                className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300"
                                value={`${currentDate} ${currentTime}`}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="doctor" className="text-sm font-medium mb-1">
                            Médico asignado
                        </label>
                        <select
                            id="doctor"
                            className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                        >
                            <option>Médico 1</option>
                            <option>Médico 2</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="owner" className="text-sm font-medium mb-1">
                            Propietario
                        </label>
                        <div className="flex items-center bg-gray-100 p-2 rounded-md">
                            <RoleUserIcon className="w-5 h-5 mr-3 text-gray-600" />
                            <span>{clientData.firstName} {clientData.lastName}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="pet" className="text-sm font-medium mb-1">
                            Mascota:
                        </label>
                        <select
                            id="pet"
                            className={`border border-gray-300 rounded-md p-2 w-full ${isPetDataMissing ? "border-red-500 outline-none" : "hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"}`}
                            onChange={(e) => setSelectedPet(e.target.value)}
                        >
                            {petsByOwner?.map((pet, index) => (
                                <option key={index}>{pet.petName}</option>
                            ))}
                        </select>
                        {isPetDataMissing && (
                            <p className="text-red-500 text-sm mt-1">Debe seleccionar una mascota</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="emergency"
                        className="mr-2"
                    />
                    <label htmlFor="emergency" className="text-sm">
                        Indicar atención como emergencia
                    </label>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="notes" className="text-sm font-medium mb-1">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        className="border border-gray-300 rounded-md p-2 w-full max-h-60 hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                        rows="4"
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


AddPatientToQueueModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    petsByOwner: PropTypes.array.isRequired,
    clientData: PropTypes.object.isRequired,
};

export { AddPatientToQueueModal };