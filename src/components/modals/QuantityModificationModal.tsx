import { useState, ChangeEvent } from 'react';
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

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
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
        <div className="fixed inset-0 flex justify-center items-start bg-gray-900 bg-opacity-70 z-50 pt-20">
            <div className="bg-gray-800 p-6 rounded-xl w-full h-auto max-w-md modal-appear mx-4 border border-gray-700">
                <h2 className="text-xl font-medium text-cyan-500 mb-4 border-b-2 pb-4 border-gray-700">Modificar Cantidad</h2>
                <div className="flex flex-col gap-4 pb-8 border-b border-gray-700">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Cantidad</label>
                        <input
                            name="quantity"
                            type="number"
                            value={itemQuantity}
                            onChange={handleChange}
                            className={`border ${errorMessage ? "border-red-500" : "border-gray-600"} rounded-lg py-2 px-4 w-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 ${errorMessage ? "focus:ring-red-500" : "focus:ring-cyan-500"} text-center`}
                            autoFocus
                        />
                        {
                            errorMessage && (
                                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                            )
                        }
                    </div>
                </div>

                <div className="flex flex-col xs:flex-row justify-end mt-4 gap-4 text-sm">
                    <button
                        className="bg-gray-700 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center gap-3 transition-colors"
                        onClick={onClose}
                        type='button'
                    >
                        <ReturnIcon className="w-4 h-4 text-gray-200" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 flex items-center gap-3 transition-colors"
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
