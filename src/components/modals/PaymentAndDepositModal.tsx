import { useState, ChangeEvent } from 'react';
import { useFinancial } from '@context/FinancialContext';
import { useGlobal } from '@context/GlobalContext';
import { Payment } from '@t/financial.types';
import { User } from '@t/user.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import { generateUniqueId } from '@utils/idGenerator';
import CalendarIcon from '@assets/calendarIcon.svg?react';
import Fileinvoice from '@assets/file-invoice.svg?react';
import MoneyIcon from '@assets/moneyIcon.svg?react';

type OperationType = Payment['movementType'];

type MethodOfPayment = Payment['paymentMethod'];

interface PaymentAndDepositModalProps {
    onClose: () => void;
    typeOfOperation: OperationType;
}

interface FormDataState {
    company: string;
    generatedBy: string;
    responsible: string;
    date: string;
    reason: string;
    amount: string;
    methodOfPayment: MethodOfPayment;
    tag: string;
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

function PaymentAndDepositModal({ onClose, typeOfOperation }: PaymentAndDepositModalProps) {

    const { addNewPayment } = useFinancial();
    const { activeUser, companyData, users } = useGlobal();

    const [errors, setErrors] = useState<FormErrors>({});

    const now = new Date();
    const [formData, setFormData] = useState({
        company: companyData?.clinicName || '',
        generatedBy: `${activeUser?.name} ${activeUser?.lastName}`,
        responsible: `${activeUser?.name} ${activeUser?.lastName}`,
        date: now.toLocaleString(),
        reason: '',
        amount: '',
        methodOfPayment: 'EFECTIVO' as MethodOfPayment,
        tag: '',
    });

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    function validateForm() {
        const newErrors: FormErrors = {};
        //Validamos si todos los campos son válidos
        if (formData.reason.trim().length < 4) {
            newErrors.reason = 'El motivo debe tener al menos 4 caracteres';
        }
        if (Number(formData.amount) <= 0 || isNaN(Number(formData.amount))) {
            newErrors.amount = 'El monto debe ser un número mayor a 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function handleSubmit() {
        if (!validateForm()) {
            return;
        }
        const newPayment: Payment = {
            id: generateUniqueId(),
            date: formData.date,
            description: formData.reason.trim(),
            paymentMethod: formData.methodOfPayment,
            income: typeOfOperation === 'ENTRADA' ? Number(formData.amount).toFixed(2) : null,
            expense: typeOfOperation === 'SALIDA' ? Number(formData.amount).toFixed(2) : null,
            docRef: formData.tag,
            movementType: typeOfOperation
        };
        addNewPayment(newPayment);
        onClose();
    }

    const userOptions = users.map((user: User) => `${user.name} ${user.lastName}`);

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
        <div className="fixed inset-0 bg-ink/40 flex justify-center items-start z-50 p-4">
            <div className="bg-paper rounded-2xl w-full max-w-2xl max-h-screen overflow-y-auto p-6 modal-appear custom-scrollbar shadow-sm">
                <h2 className="text-lg font-semibold font-display mb-4 pb-4 border-b border-slate-200 text-ink">
                    Crear registro de
                    <span
                        className={`text-white ${typeOfOperation === 'ENTRADA' ? 'bg-primary' : 'bg-danger'} rounded-full px-2 ml-1.5 text-sm`}
                    >
                        {typeOfOperation}
                    </span>
                </h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 sm:mb-0">
                    {fields.map((field) => (
                        <div
                            className={`${field.fullWidth ? 'col-span-1 sm:col-span-2' : ''}`}
                            key={field.name}
                        >
                            <label className="block text-sm font-medium text-ink pb-1.5" htmlFor={field.name}>
                                {field.label}
                            </label>
                            <div className="flex">
                                {field.icon && (
                                    <div className="flex items-center justify-center bg-white border border-slate-200 rounded-l-xl px-3 py-2">
                                        <field.icon className="w-4 h-4 text-slate" />
                                    </div>
                                )}
                                {field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        id={field.name}
                                        value={formData[field.name as keyof FormDataState]}
                                        onChange={handleChange}
                                        className={`bg-white border border-slate-200 rounded-xl px-3 py-2 w-full text-ink text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary ${errors[field.name as keyof FormDataState]
                                                ? 'border-danger'
                                                : ''
                                            }`}
                                    >
                                        {field.options?.map((option) => (
                                            <option key={option} value={option} className="bg-white text-ink">
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        className={`bg-white border border-slate-200 py-2 ${field.icon ? 'rounded-r-xl' : 'rounded-xl'
                                            } px-3 w-full outline-none text-ink text-sm focus:ring-1 focus:ring-primary/30 focus:border-primary ${errors[field.name as keyof FormDataState]
                                                ? 'border-danger'
                                                : ''
                                            } ${field.disabled ? 'bg-slate-50 text-slate/60 cursor-not-allowed' : ''}`}
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name as keyof FormDataState]}
                                        onChange={handleChange}
                                        disabled={field.disabled}
                                        placeholder={field.label}
                                    />
                                )}
                            </div>
                            {errors[field.name as keyof FormDataState] && (
                                <p className="text-danger text-sm mt-1">
                                    {errors[field.name as keyof FormDataState]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="col-span-1 sm:col-span-2 mt-4 border-t border-slate-200 pt-2">
                        <ActionButtons
                            mode="modal"
                            onCancel={onClose}
                            submitText="Generar"
                            onSubmit={handleSubmit}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export { PaymentAndDepositModal }
