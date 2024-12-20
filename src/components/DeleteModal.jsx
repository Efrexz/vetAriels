import { useContext, useState } from 'react';
import DiskIcon from '@assets/diskIcon.svg?react';
import { ProductsAndServicesContext } from '@context/ProductsAndServicesContext';
import PropTypes from "prop-types";

function DeleteModal({ productOrServiceToDelete, onClose, mode }) {
    const { removeProduct, removeService } = useContext(ProductsAndServicesContext);
    const [itemValue, setItemValue] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    function handleChange(e) {
        const { value } = e.target;
        setItemValue(value);
    }

    function deleteService() {
        // Validamos si el valor que escribimos coincide con el nombre del producto o servicio
        const isValid = itemValue.toLowerCase() === productOrServiceToDelete?.productName?.toLowerCase() || itemValue.toLowerCase() === productOrServiceToDelete?.serviceName?.toLowerCase();

        if (isValid && mode === "products") {
            removeProduct(productOrServiceToDelete.systemCode);
            onClose();
        } else if (isValid && mode === "services") {
            removeService(productOrServiceToDelete.id);
            onClose();
        }
        else {
            setErrorMessage('Por favor confirma el nombre del registro!');
        }
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg modal-appear">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-600">Eliminar {mode === 'services' ? 'Servicio' : 'Producto'}</h2>
                </div>
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded">
                    <p>
                        Esta acción no se podrá deshacer. Por favor asegúrate de estar
                        haciendo lo correcto.
                    </p>
                </div>
                <p className="text-gray-700 mb-4">
                    Para confirmar por favor escribe el nombre del registro que quieres
                    eliminar: <span className="font-medium">{productOrServiceToDelete?.productName || productOrServiceToDelete?.serviceName}</span>
                </p>
                <form >
                    <div className='mb-4'>
                        <input
                            type="text"
                            name="confirmation"
                            value={itemValue}
                            onChange={handleChange}
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
                            onClick={deleteService}
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
    productOrServiceToDelete: PropTypes.object,
    onClose: PropTypes.func,
    mode: PropTypes.string
}