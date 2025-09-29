import PlusIcon from '@assets/plusIcon.svg?react';
import MinusIcon from '@assets/minusIcon.svg?react';

type CounterMode = 'sales' | 'discharge' | 'restock';

interface QuantityCounterProps {
    openQuantityModal: () => void;
    itemCount: number;
    changeQuantity: (quantity: number) => void;
    maxQuantity?: number;
    mode: CounterMode;
}

function QuantityCounter ({ openQuantityModal, itemCount, changeQuantity, maxQuantity, mode } : QuantityCounterProps) {

    // Deshabilitar el botón de disminución si la cantidad es 1 o menos
    const isDecreaseDisabled = itemCount <= 1;

    // El aumento se deshabilita solo en 'sales' o 'discharge' si se alcanza el stock máximo.
    const isIncreaseDisabled =
        (mode === 'sales' || mode === 'discharge') &&
        maxQuantity !== undefined &&
        itemCount >= maxQuantity;

    function increaseQuantity () {
        if (!isIncreaseDisabled) {
            changeQuantity(itemCount + 1);
        }
    };

    function decreaseQuantity() {
        if (!isDecreaseDisabled) {
            changeQuantity(itemCount - 1);
        }
    }

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                type='button'
                className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 focus:outline-none disabled:bg-red-300 disabled:cursor-not-allowed"
                onClick={decreaseQuantity}
                disabled={isDecreaseDisabled}
            >
                <MinusIcon className="w-4 h-4" />
            </button>

            <div
                className="border border-gray-300 bg-white rounded text-center w-6 h-6 cursor-pointer text-black"
                onClick={() => openQuantityModal()}
            >
                {itemCount}
            </div>

            <button
                type='button'
                className="bg-green-500 text-white px-1 py-1 rounded hover:bg-green-600 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed"
                onClick={increaseQuantity}
                disabled={isIncreaseDisabled}
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export { QuantityCounter };
