import { useState } from 'react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';

import type { Product, Service } from '@t/inventory.types';

type EditableItem = Product | Service;

interface PriceModificationModalProps {
    onClose: () => void;
    productToEdit: EditableItem;
    updateProductPrice: (updatedProduct: EditableItem) => void;
}

function PriceModificationModal({ onClose, productToEdit, updateProductPrice }: PriceModificationModalProps) {
    const [itemPrice, setItemPrice] = useState<number>(productToEdit?.salePrice || 0);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full h-auto max-w-xl mt-8 modal-appear mx-4">
                <h2 className="text-xl font-medium text-gray-500 mb-4 border-b-2 pb-4">Cambiar precio</h2>
                <div className="flex flex-col gap-4 border-b border-gray-300 pb-8">
                    <div className="bg-orange-400 text-white p-4 rounded-md">
                        Los precios solo se pueden modificar desde catálogo. Solo se pueden modificar directamente en casos especiales como por ejemplo &quot;adelantos&quot;.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Precio de Venta</label>
                        <input
                            name="price"
                            type="number"
                            placeholder="Precio de venta"
                            value={itemPrice === 0 && '' || itemPrice}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg py-2 px-4 w-full hover:border-blue-300 focus-within:border-blue-300 outline-none"
                            autoFocus
                        />
                    </div>

                </div>

                <div className="flex flex-col xs:flex-row justify-end mt-6 gap-4">
                    <button
                        className="border bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex items-center gap-3"
                        onClick={onClose}
                        type='button'
                    >
                        <ReturnIcon className="w-5 h-5 text-white" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
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
