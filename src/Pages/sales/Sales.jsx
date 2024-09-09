import ShoppingCartPlusIcon from '../../assets/shoppingCartPlus.svg?react';
import NewUserIcon from '../../assets/newUserIcon.svg?react';
import UserPenIcon from '../../assets/userPenIcon.svg?react';


const Sales = () => {

    const tableCategories = [
        "Select",
        "Concepto",
        "Valor Unitario",
        "Cantidad",
        "Sub Total",
        "Impuestos",
        "Total",
        "Mascota",
        "Opciones"
    ];

    const tableData = [
        { label: 'Valor de venta bruto (sin descuentos)', value: '0.00' },
        { label: 'Total descuentos', value: '- 0.00' },
        { label: 'Valor de venta incluyendo descuentos', value: '0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'ICBPER', value: '0.00' },
        { label: 'TOTAL', value: '0.00', bold: true },
    ];

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-[#4CAF50] flex items-center mb-4">
                <ShoppingCartPlusIcon className="h-8 w-8 mr-2" />
                Ventas
            </h1>

            <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientSearch">
                    Buscar y seleccionar cliente:
                </label>
                <div className="flex gap-4">
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="clientSearch" type="text" placeholder="Buscar cliente..." />
                    <button className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline px-16" type="button">
                        <NewUserIcon className="w-5 h-5" />
                    </button>
                    <button className="ml-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline px-16" type="button">
                        <UserPenIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6 flex justify-between items-center gap-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 rounded focus:outline-none focus:shadow-outline mx-1 w-full" type="button">
                    Enviar a la cola médica
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-medium py-1 rounded focus:outline-none focus:shadow-outline mx-1 w-full" type="button">
                    Enviar a cola de grooming
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                {
                                    tableCategories.map((category, index) => (
                                        <th className="py-2 px-4 bg-gray-100 text-gray-600 font-bold uppercase text-sm border-gray-300 border-2" key={index}>{category}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {/* Aquí irían las filas de la tabla */}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-6 mb-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full bg-white">
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr key={index} className={`border-t border-gray-200 ${row.bold ? 'font-bold' : ''}`}>
                                        <td className="py-2 text-gray-600">{row.label}</td>
                                        <td className="py-2 text-right text-gray-600">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-4 mt-6 flex justify-end">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Ir a caja y generar comprobante
                </button>
            </div>
        </section>
    )
}

export { Sales };
