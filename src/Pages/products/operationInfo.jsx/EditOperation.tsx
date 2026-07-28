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
        <section className="w-full mx-auto p-6 bg-paper shadow-sm rounded-2xl">
            <div className="w-full flex flex-wrap gap-4 p-4 bg-paper rounded-lg border-2 border-slate-200">
                <div className="w-full md:w-[30%]">
                    <label
                        htmlFor="responsible"
                        className="block mb-1 text-sm font-medium text-slate"
                    >
                        Responsable / Solicitante
                    </label>
                    <select
                        name="responsible"
                        id="responsible"
                        value={formData.responsible}
                        onChange={handleChange}
                        className="w-full py-1 px-4 border border-slate-200 rounded-lg focus:outline-none bg-white text-ink hover:border-primary focus-within:border-primary"
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
                        className="block mb-1 text-sm font-medium text-slate"
                    >
                        Motivo
                    </label>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden hover:border-primary focus-within:border-primary">
                        <div className="flex items-center justify-center bg-white px-3">
                            <FileContract className="w-5 h-5 text-slate" />
                        </div>
                        <input
                            type="text"
                            id="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Motivo..."
                            className="w-full py-1 px-4 focus:outline-none focus:ring-0 focus:border-transparent bg-white text-ink"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-8 rounded-lg">
                <table className="min-w-full bg-white overflow-hidden">
                    <thead>
                        <tr className="border-b border-slate-200">
                            {tableCategories.map((category) => (
                                <th
                                    key={category}
                                    className="py-1 px-4 bg-slate-100 text-ink font-bold text-sm"
                                >
                                    {category}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map((product: PurchasedItem) => (
                            <tr key={product.provisionalId} className="border-b border-slate-100 hover:bg-slate-50/50 text-sm">
                                <td className="py-1 px-4 text-center text-slate">
                                    {product.systemCode?.slice(0, 9).toUpperCase()}
                                </td>
                                <td className="py-1 px-4 text-center text-slate">
                                    {product.productName}
                                </td>
                                <td className="py-1 px-4 text-center text-slate">
                                    {product.cost}
                                </td>
                                {
                                    typeOfOperation === "restock" && (
                                        <td className="py-1 px-4 text-center text-slate">
                                            {product.salePrice}
                                        </td>
                                    )
                                }
                                <td className="py-1 px-4 text-center text-slate">
                                    {product.quantity}
                                </td>
                                <td className="py-1 px-4 text-center text-slate">
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
