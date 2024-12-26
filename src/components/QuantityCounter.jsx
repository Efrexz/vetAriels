import PropTypes from "prop-types";
import PlusIcon from '@assets/plusIcon.svg?react';
import MinusIcon from '@assets/minusIcon.svg?react';

const QuantityCounter = ({ openQuantityModal, itemCount, changeQuantity, maxQuantity, mode }) => {

    function increaseQuantity() {
        if (mode === "discharge" || mode === "sales") {
            // En descarga o venta, no permitimos que la cantidad supere el stock disponible
            if (itemCount < maxQuantity) {
                changeQuantity(itemCount + 1);
            }
        } else if (mode === "restock") {
            // En restock, no hay límite para la cantidad a cargar
            changeQuantity(itemCount + 1);
        }
    }

    function decreaseQuantity() {
        if (itemCount > 1) {
            changeQuantity(itemCount - 1);
        }
    }

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 focus:outline-none"
                onClick={decreaseQuantity}
            >
                <MinusIcon className="w-4 h-4" />
            </button>

            <div
                className="border border-gray-300 bg-white px-4 py-1 rounded text-center w-12 cursor-pointer"
                onClick={() => openQuantityModal()}
            >
                {itemCount}
            </div>

            <button
                className="bg-green-500 text-white px-2 py-2 rounded hover:bg-green-600 focus:outline-none"
                onClick={increaseQuantity}
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export { QuantityCounter };

QuantityCounter.propTypes = {
    openQuantityModal: PropTypes.func,
    itemCount: PropTypes.number,
    changeQuantity: PropTypes.func,
    maxQuantity: PropTypes.number,
    mode: PropTypes.string
}