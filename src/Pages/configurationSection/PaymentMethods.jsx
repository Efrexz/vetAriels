import PlusIcon from '../../assets/plusIcon.svg?react';
import FileInvoiceIcon from '../../assets/file-invoice.svg?react';
import RefreshIcon from '../../assets/refreshIcon.svg?react';
import EraserIcon from '../../assets/eraserIcon.svg?react';
import EditIcon from '../../assets/editIcon.svg?react';
import UserIcon from '../../assets/userIcon.svg?react';


const tableHeaders = ["Nombre", "Tipo de pago", "Observaciones", "Estado", "Opciones"];

function PaymentMethods() {

    const paymentsData = [{
        name: 'AMERICAN EXPRESS',
        paymentType: 'TARJETA DE CRÉDITO',
        observations: '',
        state: true,
    }]

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-orange-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <FileInvoiceIcon className="w-8 h-8 mr-2" />
                Metodos de pago
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex items-center space-x-4 mb-4">
                        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                        >
                            <PlusIcon className="w-5 h-5 text-white" />
                            AGREGAR METODO DE PAGO
                        </button>
                        <div className="w-[50%] flex gap-2">
                            <select
                                name="state"
                                className=" w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2"
                            >
                                <option value="">Estado</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                            <select
                                name="paymentType"
                                className=" w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2"
                            >
                                <option value="">Seleccione el tipo de pago</option>
                                <option value="defaultType">Tipos de pagos por defecto</option>
                                <option value="customType">Tipos de pagos personalizados</option>
                            </select>

                        </div>
                        <div>
                            <button className="bg-transparent border border-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-200">
                                <EraserIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-200">
                                <RefreshIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 border text-gray-700 text-center">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsData.map((payment, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center border">{payment.name}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.paymentType}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.observations}</td>
                                    <td className="py-2 px-4 text-center border">
                                        <span className={`inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-white ${payment.state ? 'bg-green-500' : 'bg-red-500'} rounded-full`}>
                                            {payment.state ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b text-center flex items-center justify-center gap-2">
                                        <button className="text-green-500 hover:text-green-600" title="Ver imagen">
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button className="text-blue-400 hover:text-blue-500">
                                            <UserIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export { PaymentMethods };