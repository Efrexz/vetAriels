import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAndServicesContext } from '../context/ProductsAndServicesContext';
import ReturnIcon from '../assets/returnIcon.svg?react';
import PlusIcon from '../assets/plusIcon.svg?react';



function QuantityModificationModal({ onClose }) {
    const navigate = useNavigate();

    const { addNewService } = useContext(ProductsAndServicesContext);
    const [formData, setFormData] = useState({
        serviceName: '',
        line: '',
        category: '',
        cost: 0,
        price: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    function createService() {
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newService = {
            serviceName: formData.serviceName,
            line: formData.line,
            category: formData.category,
            cost: formData.cost,
            price: formData.price,
            registrationDate: currentDate,
            registrationTime: currentTime,
            status: true,
        };
        addNewService(newService);
        onClose();
        navigate(`/services`);
    }

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-full h-auto max-w-md mt-8">
                <h2 className="text-xl font-medium text-gray-500 mb-4 border-b-2 pb-4">Modificar Cantidad</h2>
                <div className="flex flex-col gap-4 pb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                        <input
                            name="quantity"
                            type="number"
                            placeholder="Cantidad"
                            value={1}
                            // onChange={handleQuantityChange}
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
                    // onClick={() => confirmQuantity()}
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