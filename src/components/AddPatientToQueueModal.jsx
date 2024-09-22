import PropTypes from 'prop-types';
import PlusIcon from '../assets/plusIcon.svg?react';
import ClockIcon from '../assets/clockIcon.svg?react';
import RoleUserIcon from '../assets/roleUserIcon.svg?react';

function AddPatientToQueueModal({ onClose, petsByOwner, clientData }) {

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-2/3 p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Generar Consulta</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Fecha de atención */}
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-md font-semibold mb-1">
                            Fecha de atención
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="date"
                                className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300"
                                placeholder="Selecciona la fecha"
                                defaultValue="21-09-2024 07:34 PM"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                <i className="fas fa-calendar-alt"></i>
                            </span>
                        </div>
                    </div>

                    {/* Médico asignado */}
                    <div className="flex flex-col">
                        <label htmlFor="doctor" className="text-md font-semibold mb-1">
                            Médico asignado
                        </label>
                        <select
                            id="doctor"
                            className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300"
                        >
                            <option>Selecciona un médico</option>
                            <option>Médico 1</option>
                            <option>Médico 2</option>
                        </select>
                    </div>

                    {/* Propietario */}
                    <div className="flex flex-col">
                        <label htmlFor="owner" className="text-md font-semibold mb-1">
                            Propietario
                        </label>
                        <div className="flex items-center bg-gray-100 p-2 rounded-md">
                            <RoleUserIcon className="w-5 h-5 mr-3 text-gray-600" />
                            <span>{clientData.firstName} {clientData.lastName}</span>
                        </div>
                    </div>

                    {/* Mascota */}
                    <div className="flex flex-col">
                        <label htmlFor="pet" className="text-md font-semibold mb-1">
                            Mascota:
                        </label>
                        <select
                            id="pet"
                            className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300"
                        >
                            <option>Selecciona una mascota</option>
                            {
                                petsByOwner.map((pet, index) => (
                                    <option key={index}>{pet.petName}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                {/* Opción de emergencia */}
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

                {/* Notas */}
                <div className="flex flex-col mb-6">
                    <label htmlFor="notes" className="text-sm font-semibold mb-1">
                        Notas
                    </label>
                    <textarea
                        id="notes"
                        className="border border-gray-300 rounded-md p-2 w-full max-h-60 hover:border-blue-300 focus-within:border-blue-300  "
                        rows="4"
                        placeholder="Escribe las notas aquí..."
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
                    <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md text-md font-semibold hover:bg-green-600">
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