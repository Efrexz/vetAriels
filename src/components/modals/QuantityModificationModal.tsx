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
        <div className="fixed inset-0 flex justify-center items-start bg-ink/40 z-50 pt-20">
            <div className="bg-paper p-6 rounded-2xl w-full h-auto max-w-md shadow-sm modal-appear mx-4 border border-slate-200">
                <h2 className="text-lg font-semibold font-display text-ink mb-4 border-b border-slate-200 pb-4">Modificar Cantidad</h2>
                <div className="flex flex-col gap-4 pb-8 border-b border-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Cantidad</label>
                        <input
                            name="quantity"
                            type="number"
                            value={itemQuantity}
                            onChange={handleChange}
                            className={`border ${errorMessage ? "border-danger" : "border-slate-200"} rounded-xl py-2 px-4 w-full bg-white text-ink placeholder:text-slate/50 focus:outline-none focus:ring-1 ${errorMessage ? "focus:ring-danger/30 focus:border-danger" : "focus:ring-primary/30 focus:border-primary"} text-center`}
                            autoFocus
                        />
                        {
                            errorMessage && (
                                <p className="text-danger text-sm mt-2">{errorMessage}</p>
                            )
                        }
                    </div>
                </div>

                <div className="flex flex-col xs:flex-row justify-end mt-4 gap-4">
                    <button
                        className="border border-slate-200 bg-white text-slate py-2 px-4 rounded-xl hover:bg-slate-100 flex items-center gap-3 transition-colors font-medium text-sm"
                        onClick={onClose}
                        type='button'
                    >
                        <ReturnIcon className="w-4 h-4" />
                        Cancelar
                    </button>
                    <button
                        className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-3 transition-colors text-sm font-semibold font-display shadow-sm shadow-primary/25"
                        onClick={editQuantity}
                        type='button'
                    >
                        <PlusIcon className="w-4 h-4 text-white" />
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )

}

export { QuantityModificationModal };
