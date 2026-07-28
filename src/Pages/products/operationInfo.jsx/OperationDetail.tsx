import { InventoryOperation, PurchasedItem } from "@t/inventory.types";
import RoleUserIcon from "@assets/roleUserIcon.svg?react";
import BookIcon from '@assets/bookIcon.svg?react';


type OperationMode = 'restock' | 'discharge';

interface OperationDetailProps {
    typeOfOperation: OperationMode;
    operationData: InventoryOperation;
    tableCategories: string[];
}

function OperationDetail({ typeOfOperation, operationData, tableCategories }: OperationDetailProps) {

    const selectedProducts: PurchasedItem[] = operationData.products;

    const subtotal = selectedProducts.reduce(
        (acc, product) => acc + (product.cost || 0) * (product.quantity || 0),
        0
    );

    return (
        <section className="w-full mx-auto p-6 bg-paper shadow-sm rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm gap-6 p-4 bg-paper rounded-lg border border-slate-200">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b md:border-b-0 md:border-r border-slate-200 text-slate pb-4 md:pb-0 md:pl-6">
                    <div className="flex-shrink-0">
                        <BookIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-xs">
                        <p>Fecha de registro:</p>
                        <span className="font-medium text-ink">{operationData.date} - {operationData.time}</span>
                        <p>Motivo:</p>
                        <span className="font-medium text-ink">{operationData.reason}</span>
                        <p>Almacén de destino:</p>
                        <span className="font-medium text-ink">{operationData.store}</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-slate-200 text-slate pt-4 md:pt-0 md:pl-6">
                    <div className="flex-shrink-0">
                        <RoleUserIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-xs">
                        <p>Responsable:</p>
                        <span className="font-medium text-ink">{operationData.responsible}</span>
                        <p>Registrado por:</p>
                        <span className="font-medium text-ink">{operationData.registeredBy}</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-8 rounded-lg">
                <table className="min-w-full bg-white overflow-hidden">
                    <thead>
                        <tr className="border-b border-slate-200">
                            {tableCategories.map((category, index) => (
                                <th
                                    key={index}
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
                                    {product.cost ?? 0 * product.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-slate flex flex-col justify-center items-end gap-2 border-t border-slate-200 bg-paper p-4 rounded-b-lg text-sm">
                <div className="flex justify-between w-full max-w-sm">
                    <p>Subtotal:</p>
                    <span className="font-medium text-ink">{(subtotal - subtotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-sm">
                    <p>Impuestos (18%):</p>
                    <span className="font-medium text-ink">{(subtotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-sm text-xl font-semibold text-emerald-400">
                    <p>TOTAL:</p>
                    <span>{subtotal.toFixed(2)}</span>
                </div>
            </div>
        </section>
    );
}

export { OperationDetail };
