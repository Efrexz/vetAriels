import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { ClientsContext } from '../context/ClientsContext';
import PlusIcon from '../assets/plusIcon.svg?react';
import ClockIcon from '../assets/clockIcon.svg?react';
import RoleUserIcon from '../assets/roleUserIcon.svg?react';

function AddPatientToQueueModal({ onClose, petsByOwner, clientData }) {
    // Estado del formulario
    const [selectedDoctor, setSelectedDoctor] = useState("Medico 1");
    const [selectedPet, setSelectedPet] = useState(petsByOwner[0].petName);
    const [notes, setNotes] = useState('');

    //obtenemos la fecha y la hora actuales a la cual se esta enviando a cola al paciente
    const now = new Date();
    const currentDate = now.toLocaleDateString(); //  "22/05/2023"
    const currentTime = now.toLocaleTimeString(); //    "07:43 PM"

    const { addPetToQueueMedical } = useContext(ClientsContext);

    // Manejo del envío del formulario
    const sendPatientToQueue = () => {
        const petSelected = petsByOwner.find(pet => pet.petName === selectedPet);

        const dataToSend = {
            assignedDoctor: selectedDoctor,
            petData: petSelected,
            notes,
            dateOfAttention: currentDate,
            timeOfAttention: currentTime,
            state: "En espera",
        };

        // agregamos el paciente a la cola médica
        addPetToQueueMedical(dataToSend);

        // cerramos el modal después de enviar los datos
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-2/3 p-6 shadow-lg modal-appear">
                <h2 className="text-lg font-semibold mb-4">Generar Consulta</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-md font-semibold mb-1">
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
                        <label htmlFor="doctor" className="text-md font-semibold mb-1">
                            Médico asignado
                        </label>
                        <select
                            id="doctor"
                            className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300"
                            onChange={(e) => setSelectedDoctor(e.target.value)}
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
                            <span>{clientData.firstName} {clientData.lastName}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="pet" className="text-md font-semibold mb-1">
                            Mascota:
                        </label>
                        <select
                            id="pet"
                            className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300"
                            onChange={(e) => setSelectedPet(e.target.value)}
                        >
                            {
                                petsByOwner.map((pet, index) => (
                                    <option key={index}>{pet.petName}</option>
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

                <div className="flex flex-col mb-6">
                    <label htmlFor="notes" className="text-sm font-semibold mb-1">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        className="border border-gray-300 rounded-md p-2 w-full max-h-60 hover:border-blue-300 focus-within:border-blue-300  "
                        rows="4"
                        placeholder="Escribe las notas aquí..."
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-md font-semibold hover:bg-gray-200"
                    >
                        <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Cancelar
                    </button>
                    <button
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md text-md font-semibold hover:bg-green-600"
                        onClick={sendPatientToQueue}
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Generar
                    </button>
                </div>
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