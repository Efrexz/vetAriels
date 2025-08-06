import { useState } from 'react';
import { useClients } from '@context/ClientsContext';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { Product, Service } from '@t/inventory.types';
import { Pet, Client } from '@t/client.types';
import DiskIcon from '@assets/diskIcon.svg?react';

type DeleteModalMode = 'products' | 'services' | 'pets' | 'clients';

type ElementToDelete = Product | Service | Pet | Client;

interface DeleteModalProps {
    elementToDelete: ElementToDelete;
    onClose: () => void;
    mode: DeleteModalMode;
}

function DeleteModal({ elementToDelete, onClose, mode }: DeleteModalProps) {
    const { removeProduct, removeService } = useProductsAndServices();
    const { removePet, removeClient } = useClients();
    const [itemValue, setItemValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function getElementDetails() {
        switch (mode) {
            case "products":
                return {
                    typeName: "Producto",
                    operationName: (elementToDelete as Product).productName || '',
                    deleteFn: () => removeProduct((elementToDelete as Product).systemCode!),
                };
            case "services":
                return {
                    typeName: "Servicio",
                    operationName: (elementToDelete as Service).serviceName || '',
                    deleteFn: () => removeService(elementToDelete.id),
                };
            case "pets":
                return {
                    typeName: "Mascota",
                    operationName: (elementToDelete as Pet).petName,
                    deleteFn: () => removePet(elementToDelete.id),
                };
            case "clients":
                return {
                    typeName: "Cliente",
                    operationName: `${(elementToDelete as Client).firstName} ${(elementToDelete as Client).lastName}`,
                    deleteFn: () => removeClient(elementToDelete.id),
                };
            default:
                // Esto ayuda a TypeScript a detectar si falta un caso.
                // Si 'mode' tuviera más opciones y no las cubrimos, TypeScript daría un error.
                const exhaustiveCheck: never = mode;
                return exhaustiveCheck;
        }
    };

    const { typeName, operationName, deleteFn } = getElementDetails();


    function deleteElement() {
        if (itemValue.toLowerCase() !== operationName.toLowerCase()) {
            setErrorMessage('El nombre ingresado no coincide. Por favor, verifica.');
            return;
        }

        deleteFn();
        onClose();
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg modal-appear mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-600">Eliminar {typeName}</h2>
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
                            autoFocus
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