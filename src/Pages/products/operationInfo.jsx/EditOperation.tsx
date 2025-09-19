import { useState, useEffect, ChangeEvent } from 'react';
import { InventoryOperation, PurchasedItem } from "@t/inventory.types";
import {useGlobal} from '@context/GlobalContext';
import FileContract from '@assets/fileContract.svg?react';

type OperationMode = 'restock' | 'discharge';

interface EditOperationProps {
    typeOfOperation: OperationMode;
    operationData: InventoryOperation;
    tableCategories: string[];
}

type FormDataState = {
    responsible: string;
    reason: string;
};


function EditOperation({ typeOfOperation, operationData, tableCategories }: EditOperationProps) {
    const { users } = useGlobal();

    const [formData, setFormData] = useState<FormDataState>({
        responsible: '',
        reason: '',
    });

    useEffect(() => {
        if (operationData) {
        setFormData({
            responsible: operationData.responsible || '',
            reason: operationData.reason || '',
        });
        }
    }, [operationData]);

    function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>)  {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const selectedProducts: PurchasedItem[] = operationData.products;

    return (
        <section className="w-full mx-auto p-6 bg-gray-900 shadow-xl rounded-lg">
            <div className="w-full flex flex-wrap gap-4 p-4 bg-gray-800 rounded-lg border-2 border-cyan-500/30">
                <div className="w-full md:w-[30%]">
                    <label
                        htmlFor="responsible"
                        className="block mb-1 text-sm font-medium text-gray-400"
                    >
                        Responsable / Solicitante
                    </label>
                    <select
                        name="responsible"
                        id="responsible"
                        value={formData.responsible}
                        onChange={handleChange}
                        className="w-full py-2 px-4 border border-gray-600 rounded-lg focus:outline-none bg-gray-700 text-gray-200 hover:border-cyan-500 focus-within:border-cyan-500"
                    >
                        <option value="">Seleccionar Responsable</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.name}>{user.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-[50%]">
                    <label
                        htmlFor="reason"
                        className="block mb-1 text-sm font-medium text-gray-400"
                    >
                        Motivo
                    </label>
                    <div className="flex border border-gray-600 rounded-lg overflow-hidden hover:border-cyan-500 focus-within:border-cyan-500">
                        <div className="flex items-center justify-center bg-gray-700 px-3">
                            <FileContract className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Motivo..."
                            className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent bg-gray-700 text-gray-200"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-8 border border-gray-700 rounded-lg">
                <table className="min-w-full bg-gray-800 overflow-hidden">
                    <thead>
                        <tr>
                            {tableCategories.map((category) => (
                                <th
                                    key={category}
                                    className="py-2 px-4 bg-gray-900 text-gray-300 font-bold uppercase text-xs border border-gray-700"
                                >
                                    {category}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map((product: PurchasedItem) => (
                            <tr key={product.provisionalId} className="border-b border-gray-700">
                                <td className="py-2 px-4 border border-gray-700 text-center text-gray-400">
                                    {product.systemCode?.slice(0, 9).toUpperCase()}
                                </td>
                                <td className="py-2 px-4 border border-gray-700 text-center text-gray-400">
                                    {product.productName}
                                </td>
                                <td className="py-2 px-4 border border-gray-700 text-center text-gray-400">
                                    {product.cost}
                                </td>
                                {
                                    typeOfOperation === "restock" && (
                                        <td className="py-2 px-4 border border-gray-700 text-center text-gray-400">
                                            {product.salePrice}
                                        </td>
                                    )
                                }
                                <td className="py-2 px-4 border border-gray-700 text-center text-gray-400">
                                    {product.quantity}
                                </td>
                                <td className="py-2 px-4 border border-gray-700 text-center text-gray-400">
                                    {product.cost || 0 * product.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export { EditOperation };

