import { useState } from 'react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import PropTypes from "prop-types";



function QuantityModificationModal({ onClose, quantity, changeQuantity, maxQuantity, mode }) {

    const [itemQuantity, setItemQuantity] = useState(quantity);
    const [errorMessage, setErrorMessage] = useState(null);

    function handleChange(e) {
        setItemQuantity(e.target.value);
    }

    function editQuantity() {
        if (mode === "discharge" || mode === "sales") {
            // En descarga o venta, no permitimos que la cantidad supere el stock disponible
            if (itemQuantity > maxQuantity) {
                setErrorMessage('La cantidad seleccionada excede el stock disponible.');
                return;
            }
        }
        changeQuantity(parseInt(itemQuantity));//nos aseguramos de que el valor sea un numero para evitar el error que ocurre al enviarlo y lo toma como un string. Luego al modificar la cantidad con los botones genera el bug que lo suma como string
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
                        onClick={() => onClose()}
                    >
                        <ReturnIcon className="w-4 h-4 text-white" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                        onClick={() => editQuantity()}
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

QuantityModificationModal.propTypes = {
    onClose: PropTypes.func,
    quantity: PropTypes.number,
    changeQuantity: PropTypes.func,
    maxQuantity: PropTypes.number,
    mode: PropTypes.string
}