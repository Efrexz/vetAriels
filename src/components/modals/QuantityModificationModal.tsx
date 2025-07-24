import { useState } from 'react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';

type ModalMode = 'sales' | 'discharge' | 'restock';

interface QuantityModificationModalProps {
    onClose: () => void;
    quantity: number;
    changeQuantity: (quantity: number) => void;
    maxQuantity?: number;
    mode: ModalMode;
}


function QuantityModificationModal({ onClose, quantity, changeQuantity, maxQuantity, mode }: QuantityModificationModalProps) {

    const [itemQuantity, setItemQuantity] = useState<number>(quantity);
    const [errorMessage, setErrorMessage] = useState<string>("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const valueAsNumber = parseInt(e.target.value, 10);
        // Si el valor no es un número válido (está vacío), lo tratamos como 0
        setItemQuantity(isNaN(valueAsNumber) ? 0 : valueAsNumber);
    }

    function editQuantity() {
        //Para solucinar el error que muestra vsCode de maxQuantity puede ser undefined
        if ((mode === "discharge" || mode === "sales") && maxQuantity !== undefined) {
            // En descarga o venta, no permitimos que la cantidad supere el stock disponible
            if (itemQuantity > maxQuantity) {
                setErrorMessage('La cantidad seleccionada excede el stock disponible.');
                return;
            }
        }
        changeQuantity(itemQuantity);
        onClose();
    }

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full h-auto max-w-md mt-8 modal-appear mx-4">
                <h2 className="text-xl font-medium text-gray-500 mb-4 border-b-2 pb-4">Modificar Cantidad</h2>
                <div className="flex flex-col gap-4 pb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                        <input
                            name="quantity"
                            type="number"
                            value={itemQuantity}
                            onChange={handleChange}
                            className={`border ${errorMessage ? "border-red-400 hover:border-red-400" : "border-gray-300 hover:border-blue-300 focus-within:border-blue-300"} rounded-lg py-2 px-4 w-full   focus:outline-none text-center`}
                            autoFocus
                        />
                        {
                            errorMessage && (
                                <p className="text-red-500 text-sm">{errorMessage}</p>
                            )
                        }
                    </div>
                </div>

                <div className="flex flex-col xs:flex-row justify-end mt-4 gap-4 text-sm">
                    <button
                        className="border bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex items-center gap-3"
                        onClick={onClose}
                        type='button'
                    >
                        <ReturnIcon className="w-4 h-4 text-white" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                        onClick={editQuantity}
                        type='button'
                    >
                        <PlusIcon className="w-4 h-4 text-white" />
                        CONFIRMAR
                    </button>
                </div>
            </div>
        </div>
    )

}

export { QuantityModificationModal };
