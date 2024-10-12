import { useState } from 'react';
import PlusIcon from '../assets/plusIcon.svg?react';


const QuantityCounter = ({ openQuantityModal }) => {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 focus:outline-none"
                onClick={decreaseQuantity}
            >
                <PlusIcon className="w-4 h-4" />
            </button>

            <div
                className="border border-gray-300 bg-white px-4 py-1 rounded text-center w-12 cursor-pointer"
                onClick={() => openQuantityModal()}
            >
                {quantity}
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