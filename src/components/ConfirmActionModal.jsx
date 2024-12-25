import { useContext, useState } from 'react';
import DiskIcon from '@assets/diskIcon.svg?react';
import PropTypes from "prop-types";
import { ClientsContext } from '../context/ClientsContext';

function ConfirmActionModal({ elementToDelete, onClose }) {
    const { removePetFromQueueMedical } = useContext(ClientsContext);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg modal-appear">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-600">¿Estás seguro de esta acción?</h2>
                </div>
                <div className="flex justify-end space-x-2 border-t border-gray-300 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                        onClick={() => {
                            removePetFromQueueMedical(elementToDelete.id)
                            onClose()
                        }}
                    >
                        <DiskIcon className="w-5 h-5 mr-2" />
                        Confirmar Eliminado
                    </button>
                </div>
            </div>
        </div>
    );
}

export { ConfirmActionModal };

ConfirmActionModal.propTypes = {
    elementToDelete: PropTypes.object,
    onClose: PropTypes.func
}