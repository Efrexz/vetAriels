import { useContext, useState } from 'react';
import { FinancialContext } from '@context/FinancialContext';
import { GlobalContext } from '@context/GlobalContext';
import { ActionButtons } from '@components/ActionButtons';
import CalendarIcon from '@assets/calendarIcon.svg?react';
import Fileinvoice from '@assets/file-invoice.svg?react';
import MoneyIcon from '@assets/moneyIcon.svg?react';
import PropTypes from "prop-types";

function PaymentAndDepositModal({ onClose, typeOfOperation }) {

    const { addNewPayment } = useContext(FinancialContext);
    const { activeUser, companyData, users } = useContext(GlobalContext);

    const [errors, setErrors] = useState({});

    const now = new Date();
    const currentDate = now.toLocaleDateString(); //  "22/05/2023"
    const currentTime = now.toLocaleTimeString(); //  "07:43 PM"
    const [formData, setFormData] = useState({
        company: companyData?.clinicName,
        generatedBy: `${activeUser?.name} ${activeUser?.lastName}`,
        responsible: 'administracion ariel',
        date: `${currentDate} ${currentTime}`,
        reason: '',
        amount: '',
        methodOfPayment: 'EFECTIVO',
        tag: '',
    });

    function validateForm() {
        const newErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.reason || formData.reason.length < 4) {
            newErrors.reason = 'El motivo debe tener al menos 4 caracteres';
        }
        if (!formData.amount || formData.amount < 1) {
            newErrors.amount = 'El monto debe ser mayor a 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleSubmit() {
        if (!validateForm()) {
            return;
        }
        function generateId() {
            const part1 = Date.now().toString(35)
            const part2 = Math.random().toString(36).slice(2)
            return part1 + part2
        }
        const newPayment = {
            id: generateId(),
            date: formData.date,
            description: formData.reason,
            paymentMethod: formData.methodOfPayment,
            income: typeOfOperation == 'ENTRADA' ? formData.amount : null,
            expense: typeOfOperation == 'SALIDA' ? formData.amount : null,
            docRef: formData.tag,
            movementType: typeOfOperation
        };
        addNewPayment(newPayment);
        onClose();
    }

    const userOptions = users.map(user => `${user.name} ${user.lastName}`);

    const fields = [
        {
            label: 'Empresa',
            name: 'company',
            type: 'text',
            value: formData.company,
            disabled: true,
            fullWidth: true
        },
        {
            label: 'Generado Por',
            name: 'generatedBy',
            type: 'text',
            fullWidth: true,
            disabled: true
        },
        {
            label: 'Responsable',
            name: 'responsible',
            type: 'select',
            options: userOptions,
            fullWidth: true
        },
        {
            label: 'Fecha',
            name: 'date',
            type: 'text',
            icon: CalendarIcon,
            disabled: true
        },
        {
            label: 'Seleccione una etiqueta (Opcional)',
            name: 'tag',
            type: 'select',
            options: ['Etiquetas...']
        },
        {
            label: 'Motivo (descripción)',
            name: 'reason',
            type: 'text',
            icon: Fileinvoice,
            fullWidth: true
        },
        {
            label: 'Monto',
            name: 'amount',
            type: 'number',
            icon: MoneyIcon
        },
        {
            label: 'Metodo de pago',
            name: 'methodOfPayment',
            type: 'select',
            options: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA']
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 modal-appear">
                <h2
                    className="text-md font-medium mb-4 pb-4 border-b-2 text-gray-600">
                    Crear registro de
                    <span className={`text-white ${typeOfOperation === 'ENTRADA' ? 'bg-green-600' : 'bg-red-600'} rounded-full px-2 ml-1`}>{typeOfOperation}
                    </span>
                </h2>
                <form className="grid grid-cols-2 gap-4">
                    {fields.map((field, index) => (
                        <div className={`${field.fullWidth ? 'col-span-2' : ''}`} key={index}>
                            <label className="block text-sm font-medium text-gray-700 pb-1">{field.label}</label>
                            <div className="flex">
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-gray-100 px-3">
                                        <field.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                }
                                {field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className={`border border-gray-300 rounded-md p-2 w-full  text-gray-600 focus:outline-none ${errors[field.name] ? 'border-red-500' : 'hover:border-blue-300 focus-within:border-blue-300'}`}
                                    >
                                        {field.options.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        className={`border border-gray-300 ${field.icon ? 'rounded-r-md' : 'rounded-md'} p-2 w-full text-gray-600 ${errors[field.name] ? 'border-red-500' : 'hover:border-blue-300 focus-within:border-blue-300'}`}
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        disabled={field.disabled}
                                        placeholder={field.label}
                                    />
                                )}
                            </div>
                            {
                                errors[field.name] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                                )
                            }
                        </div>
                    ))}

                    <div className="col-span-2 mt-4 border-t border-gray-300 pt-4">
                        <ActionButtons
                            mode="modal"
                            onCancel={onClose}
                            submitText="GENERAR"
                            onSubmit={handleSubmit} />
                    </div>
                </form >
            </div >
        </div >
    );
}

export { PaymentAndDepositModal }

PaymentAndDepositModal.propTypes = {
    onClose: PropTypes.func,
    typeOfOperation: PropTypes.string
}