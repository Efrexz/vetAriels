import PropTypes from "prop-types";
import FileContract from '@assets/fileContract.svg?react';

function EditOperation({ typeOfOperation, operationData, tableCategories }) {

    const selectedProducts = operationData?.products || [];

    return (
        <main className="w-full mx-auto p-6 bg-white shadow-md ">
            <div className="w-full flex flex-wrap gap-4">
                <div className="w-full md:w-[30%]">
                    <label
                        htmlFor="responsible"
                        className="block mb-1 text-sm font-medium text-gray-600"
                    >
                        Responsable / Solicitante
                    </label>
                    <select
                        name="responsible"
                        id="responsible"
                        className="w-full py-2 px-4 border-gray-200 border rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
                    >
                        <option value="">Seleccionar Responsable</option>
                        <option value="1">Juan Perez</option>
                        <option value="2">Carlos Perez</option>
                    </select>
                </div>
                <div className="w-full md:w-[50%]">
                    <label
                        htmlFor="reason"
                        className="block mb-1 text-sm font-medium text-gray-600"
                    >
                        Motivo
                    </label>
                    <div className="flex border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                        <div className="flex items-center justify-center bg-gray-100 px-3">
                            <FileContract className="w-5 h-5 text-gray-600" />
                        </div>
                        <input
                            type="text"
                            id="reason"
                            defaultValue={operationData?.operationType}
                            placeholder="Motivo..."
                            className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                        />
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

        </main>
    );
}

export { EditOperation };


EditOperation.propTypes = {
    typeOfOperation: PropTypes.string,
    operationData: PropTypes.object,
    tableCategories: PropTypes.array
}