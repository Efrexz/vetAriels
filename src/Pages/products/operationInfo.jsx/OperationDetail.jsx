import RoleUserIcon from "@assets/roleUserIcon.svg?react";
import BookIcon from '@assets/bookIcon.svg?react';
import PropTypes from "prop-types";

function OperationDetail({ typeOfOperation, operationData, tableCategories }) {

    const selectedProducts = operationData?.products || [];


    const subtotal = operationData.products.reduce(
        (acc, product) => acc + product.cost * product.quantity,
        0
    );


    return (
        <main className="w-full mx-auto p-6 bg-white shadow-md ">
            <div className="grid grid-cols-2 text-sm">
                <div className="flex gap-8 border-r border-gray-200 text-gray-500 pl-6">
                    <BookIcon className="w-8 h-8 mr-2" />
                    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
                        <p>Fecha de registro:</p>
                        <span className="font-medium">{operationData.date} - {operationData.time}</span>
                        <p>Motivo:</p>
                        <span className="font-medium">{operationData.reason}</span>
                        <p>Almacén de destino:</p>
                        <span className="font-medium">{operationData.store}</span>
                    </div>
                </div>

                <div className="flex gap-8 border-l border-gray-200 text-gray-500 pl-6">
                    <RoleUserIcon className="w-8 h-8 mr-2" />
                    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
                        <p>Responsable:</p>
                        <span className="font-medium">{operationData.responsible}</span>
                        <p>Registrado por:</p>
                        <span className="font-medium">{operationData.registeredBy}</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-8">
                <table className="min-w-full bg-white overflow-hidden">
                    <thead>
                        <tr>
                            {tableCategories.map((category, index) => (
                                <th
                                    key={index}
                                    className="py-2 px-4 bg-gray-100 text-gray-600 font-bold uppercase text-xs border-gray-300 border-2"
                                >
                                    {category}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map((product) => (
                            <tr key={product.provisionalId} className="border-b">
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.systemCode.slice(0, 9).toUpperCase()}
                                </td>
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.productName}
                                </td>

                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.cost}
                                </td>
                                {
                                    typeOfOperation === "restock" && (
                                        <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                            {product.salePrice}
                                        </td>
                                    )
                                }
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.quantity}
                                </td>
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.cost * product.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-gray-600 flex flex-col justify-center items-end gap-4">
                <div className="flex justify-between w-full max-w-sm">
                    <p>Subtotal:</p>
                    <span className="font-medium">{(subtotal - subtotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-sm">
                    <p>Impuestos (18%):</p>
                    <span className="font-medium">{(subtotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-sm text-2xl font-medium">
                    <p>TOTAL:</p>
                    <span>{subtotal.toFixed(2)}</span>
                </div>
            </div>
        </main>
    );
}

export { OperationDetail };

OperationDetail.propTypes = {
    typeOfOperation: PropTypes.string,
    operationData: PropTypes.object,
    tableCategories: PropTypes.array

}