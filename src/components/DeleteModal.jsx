import { useContext, useState } from 'react';
import { ProductsAndServicesContext } from '@context/ProductsAndServicesContext';
import { ClientsContext } from '@context/ClientsContext';
import DiskIcon from '@assets/diskIcon.svg?react';
import PropTypes from "prop-types";

function DeleteModal({ elementToDelete, onClose, mode }) {
    const { removeProduct, removeService } = useContext(ProductsAndServicesContext);
    const { removePet, removeClient } = useContext(ClientsContext);
    const [itemValue, setItemValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function getElementName() {
        switch (mode) {
            case "products":
                return "Producto";
            case "services":
                return "Servicio";
            case "pets":
                return "Mascota";
            default:
                return "";
        }
    }

    const operationName = elementToDelete?.productName || elementToDelete?.serviceName || elementToDelete?.petName || elementToDelete?.firstName + " " + elementToDelete?.lastName;

    function deleteElement() {
        // Validamos si el valor que escribimos coincide con el nombre del producto o servicio
        const isValid = itemValue.toLowerCase() === operationName.toLowerCase();

        if (isValid && mode === "products") {
            removeProduct(elementToDelete.systemCode);
        } else if (isValid && mode === "services") {
            removeService(elementToDelete.id);
        } else if (isValid && mode === "pets") {
            removePet(elementToDelete.id);
        } else if (isValid && mode === "clients") {
            removeClient(elementToDelete.id);
        } else {
            setErrorMessage('Por favor confirma el nombre del registro!');
            return;
        }
        onClose();
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg modal-appear mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-600">Eliminar {getElementName()}</h2>
                </div>
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded">
                    <p>
                        Esta acción no se podrá deshacer. Por favor asegúrate de estar
                        haciendo lo correcto.
                    </p>
                </div>
                <p className="text-gray-700 mb-4">
                    Para confirmar por favor escribe el nombre del registro que quieres
                    eliminar: <span className="font-medium">{operationName}</span>
                </p>
                <form >
                    <div className='mb-4'>
                        <input
                            type="text"
                            name="confirmation"
                            value={itemValue}
                            onChange={(e) => setItemValue(e.target.value)}
                            placeholder="Escribe el nombre aquí"
                            className={`w-full ${errorMessage ? 'border-red-500' : 'border-gray-300'} border rounded-md focus:outline-none p-2 mb-1`}
                            required
                        />
                        {
                            errorMessage && (
                                <p className="text-red-500 text-sm">{errorMessage}</p>
                            )
                        }
                    </div>

                    <div className="flex flex-col xs:flex-row justify-end gap-2 border-t border-gray-300 pt-4">
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
                            onClick={deleteElement}
                        >
                            <DiskIcon className="w-5 h-5 mr-2" />
                            Confirmar Eliminado
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export { DeleteModal };

DeleteModal.propTypes = {
    elementToDelete: PropTypes.object,
    onClose: PropTypes.func,
    mode: PropTypes.string
}