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
        <div className="fixed inset-0 flex justify-center items-start bg-ink/40 z-50 pt-20">
            <div className="bg-paper p-6 rounded-xl w-full h-auto max-w-xl modal-appear mx-4 border border-slate-200">
                <h2 className="text-xl font-medium text-ink font-display mb-4 border-b-2 pb-4 border-slate-200">Cambiar precio</h2>
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-8">
                    <div className="bg-amber/10 text-amber-dark p-4 rounded-lg border border-amber/20">
                        Los precios solo se pueden modificar desde catálogo. Solo se pueden modificar directamente en casos especiales como por ejemplo &quot;adelantos&quot;.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate mb-2">Precio de Venta</label>
                        <input
                            name="price"
                            type="number"
                            placeholder="Precio de venta"
                            value={itemPrice === 0 && '' || itemPrice}
                            onChange={handleChange}
                            className="bg-white border border-slate-200 rounded-lg py-2 px-4 w-full text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex flex-col xs:flex-row justify-end mt-6 gap-4">
                    <button
                        className="bg-white text-ink py-2 px-4 rounded-lg hover:bg-slate-100 flex items-center gap-3 transition-colors"
                        onClick={onClose}
                        type='button'
                    >
                        <ReturnIcon className="w-4 h-4 text-ink" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-primary text-white py-2 px-4 rounded-lg hover:opacity-90 flex items-center gap-3 transition-colors"
                        onClick={editPrice}
                        type='button'
                    >
                        <PlusIcon className="w-4 h-4 text-white" />
                        Cambiar precio
                    </button>
                </div>
            </div>
        </div>
    )
}

export { PriceModificationModal };
