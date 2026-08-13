import { useState } from 'react';
import { useClients } from '@context/ClientsContext';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { Product, Service } from '@t/inventory.types';
import { Pet, Client } from '@t/client.types';
import TrashIcon from '@assets/trashIcon.svg?react';

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
            default: {
                const exhaustiveCheck: never = mode;
                return exhaustiveCheck;
            }
        }
    }

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
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50">
            <div className="bg-paper rounded-2xl p-6 w-full max-w-lg shadow-sm modal-appear mx-4 border border-slate-200">
                <div className="pb-3 mb-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold font-display text-ink">Eliminar {typeName}</h2>
                </div>
                <div className="bg-amber/10 border-l-2 border-amber text-amber-dark p-4 mb-4 rounded-lg">
                    <p>
                        Esta acci&oacute;n no se podr&aacute; deshacer. Por favor aseg&uacute;rate de estar
                        haciendo lo correcto.
                    </p>
                </div>
                <p className="text-slate mb-4 text-sm">
                    Para confirmar por favor escribe el nombre del registro que quieres
                    eliminar: <span className="font-medium text-primary">{operationName}</span>
                </p>
                <form >
                    <div className='mb-4'>
                        <input
                            type="text"
                            name="confirmation"
                            autoFocus
                            value={itemValue}
                            onChange={(e) => setItemValue(e.target.value)}
                            placeholder="Escribe el nombre aqu&iacute;"
                            className={`w-full ${errorMessage ? 'border-danger' : 'border-slate-200'} bg-white text-ink placeholder:text-slate/50 border rounded-lg px-3 py-2 mb-1 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors`}
                            required
                        />
                        {
                            errorMessage && (
                                <p className="text-danger text-sm mt-1">{errorMessage}</p>
                            )
                        }
                    </div>

                    <div className="flex flex-col xs:flex-row justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white text-slate rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="px-5 py-2 bg-danger text-white rounded-xl hover:opacity-90 flex items-center transition-colors font-semibold font-display shadow-sm shadow-danger/25"
                            onClick={deleteElement}
                        >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Confirmar eliminado
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export { DeleteModal };