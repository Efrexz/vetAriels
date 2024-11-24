import { useState } from 'react';
import PropTypes from "prop-types";
import ReturnIcon from '../assets/returnIcon.svg?react';
import PlusIcon from '../assets/plusIcon.svg?react';



function QuantityModificationModal({ onClose, quantity, changeQuantity }) {

    const [itemQuantity, setItemQuantity] = useState(quantity);

    function handleChange(e) {
        setItemQuantity(e.target.value);
    }

    function editQuantity() {
        changeQuantity(parseInt(itemQuantity));//nos aseguramos de que el valor sea un numero para evitar el error que ocurre al enviarlo y lo toma como un string. Luego al modificar la cantidad con los botones genera el bug que lo suma como string
        onClose();
    }

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-full h-auto max-w-md mt-8 modal-appear">
                <h2 className="text-xl font-medium text-gray-500 mb-4 border-b-2 pb-4">Modificar Cantidad</h2>
                <div className="flex flex-col gap-4 pb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                        <input
                            name="quantity"
                            type="number"
                            value={itemQuantity}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg py-2 px-4 w-full hover:border-blue-300 focus-within:border-blue-300 text-center"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        className="border bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex items-center gap-3"
                        onClick={() => onClose()}
                    >
                        <ReturnIcon className="w-5 h-5 text-white" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                        onClick={() => editQuantity()}
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
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
    changeQuantity: PropTypes.func
}