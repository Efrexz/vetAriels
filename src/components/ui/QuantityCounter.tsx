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
    }

    function decreaseQuantity() {
        if (!isDecreaseDisabled) {
            changeQuantity(itemCount - 1);
        }
    }

    return (
        <div className="flex items-center justify-center gap-1.5">
            <button
                type='button'
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={decreaseQuantity}
                disabled={isDecreaseDisabled}
            >
                <MinusIcon className="w-3.5 h-3.5" />
            </button>

            <div
                className="min-w-[28px] h-7 flex items-center justify-center border border-slate-200 bg-white rounded-lg cursor-pointer text-ink text-sm font-medium font-mono tabular-nums hover:border-primary/40 transition-colors"
                onClick={() => openQuantityModal()}
            >
                {itemCount}
            </div>

            <button
                type='button'
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={increaseQuantity}
                disabled={isIncreaseDisabled}
            >
                <PlusIcon className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

export { QuantityCounter };
