import { useState , ChangeEvent} from 'react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import type { PurchasedItem,  } from '@t/inventory.types';


interface PriceModificationModalProps {
    onClose: () => void;
    productToEdit: PurchasedItem;
    updateProductPrice: (updatedProduct: PurchasedItem) => void;
}

function PriceModificationModal({ onClose, productToEdit, updateProductPrice }: PriceModificationModalProps) {
    const [itemPrice, setItemPrice] = useState<number>(productToEdit?.salePrice || 0);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const valueAsNumber = parseFloat(e.target.value);
        setItemPrice(isNaN(valueAsNumber) ? 0 : valueAsNumber)
    }

    function editPrice() {
        const updatedProduct = {
            ...productToEdit,
            salePrice: itemPrice,
        };
        updateProductPrice(updatedProduct);
        onClose();
    }
    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-900 bg-opacity-70 z-50 pt-20">
            <div className="bg-gray-800 p-6 rounded-xl w-full h-auto max-w-xl modal-appear mx-4 border border-gray-700">
                <h2 className="text-xl font-medium text-cyan-500 mb-4 border-b-2 pb-4 border-gray-700">Cambiar precio</h2>
                <div className="flex flex-col gap-4 border-b border-gray-700 pb-8">
                    <div className="bg-amber-500 bg-opacity-10 text-amber-500 p-4 rounded-lg border border-amber-500/20">
                        Los precios solo se pueden modificar desde catálogo. Solo se pueden modificar directamente en casos especiales como por ejemplo &quot;adelantos&quot;.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Precio de Venta</label>
                        <input
                            name="price"
                            type="number"
                            placeholder="Precio de venta"
                            value={itemPrice === 0 && '' || itemPrice}
                            onChange={handleChange}
                            className="bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 w-full text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex flex-col xs:flex-row justify-end mt-6 gap-4">
                    <button
                        className="bg-gray-700 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center gap-3 transition-colors"
                        onClick={onClose}
                        type='button'
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-200" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 flex items-center gap-3 transition-colors"
                        onClick={editPrice}
                        type='button'
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                        CAMBIAR PRECIO
                    </button>
                </div>
            </div>
        </div>
    )
}

export { PriceModificationModal };
