import { useState, ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { Client } from '@t/client.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import { generateUniqueId } from '@utils/idGenerator';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import DocumentIcon from '@assets/documentIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import LocationIcon from '@assets/locationIcon.svg?react';

interface FormDataState {
    firstName: string;
    lastName: string;
    document: string;
    email: string;
    phone1: string;
    phone2: string;
    district: string;
    address: string;
    reference: string;
    observations: string;
}

type FormErrors = Partial<Record<keyof FormDataState, string>>;

interface FormField {
    label: string;
    id: keyof FormDataState; // el id debe ser una de las claves de nuestro estado
    type: 'text' | 'email' | 'select';
    icon?: React.ComponentType<any>;
    options?: string[];
    helperText?: string;
}

const formFields: FormField[] = [
    { label: 'Nombre *', id: 'firstName', type: 'text', icon: RoleUserIcon },
    { label: 'Apellido *', id: 'lastName', type: 'text', icon: RoleUserIcon },
    { label: 'Número de documento de identidad', id: 'document', icon: DocumentIcon, type: 'text' },
    { label: 'Correo electrónico', id: 'email', icon: EmailIcon, type: 'email', helperText: 'Para enviar notificaciones o correos masivos, el cliente debe confirmar su correo electrónico' },
    { label: 'Teléfono móvil *', id: 'phone1', icon: PhoneIcon, type: 'text', helperText: 'Para utilizar WhatsApp, registrar el código de país delante del teléfono móvil. Ej. +51' },
    { label: 'Teléfono de trabajo', id: 'phone2', icon: PhoneIcon, type: 'text' },
    { label: 'Distrito', id: 'district', type: 'select', options: ['LIMA', 'MIRAFLORES', 'SAN ISIDRO'] },
    { label: 'Dirección *', id: 'address', type: 'text' },
    { label: 'Referencias de la dirección', id: 'reference', icon: LocationIcon, type: 'text' },
    { label: 'Observaciones del cliente', id: 'observations', icon: LocationIcon, type: 'text' },
];

function CreateClientForm() {
    const { addClient } = useClients();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormDataState>({
        firstName: '',
        lastName: '',
        document: '',
        email: '',
        phone1: '',
        phone2: '',
        district: 'LIMA',
        address: '',
        reference: '',
        observations: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Validación de los campos
    function validateForm() {
        const newErrors : FormErrors = {};
        //Validamos si todos los campos son válidos
        if (formData.firstName.length < 4) newErrors.firstName = 'El nombre debe tener al menos 4 caracteres';
        if (formData.lastName.length < 4) newErrors.lastName = 'El apellido debe tener al menos 4 caracteres';
        if (formData.document && formData.document.length < 8) newErrors.document = 'El documento debe tener al menos 8 caracteres';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El correo electrónico no es válido';
        if (formData.phone1.length < 9) newErrors.phone1 = 'El teléfono móvil debe tener al menos 9 caracteres';
        if (formData.address.length < 4) newErrors.address = 'La dirección debe tener al menos 4 caracteres';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };

    function createNewClient() {
        if (!validateForm()) {
            return;
        }
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newClient : Client = {
            id: generateUniqueId(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            dni: formData.document,
            date: currentDate,
            hour: currentTime,
            phone1: formData.phone1,
            phone2: formData.phone2,
            address: formData.address,
            district: formData.district,
            reference: formData.reference,
            observations: formData.observations,
            pets: [],
            products: []
        };

        addClient(newClient);
        navigate(`/clients/client/${newClient.id}/update`);
    }


    return (
        <section className="p-4 sm:p-6 bg-gray-950 text-gray-200">
            <h1 className="text-xl sm:text-3xl font-medium text-cyan-500 mb-4 pb-4 border-b border-cyan-500 flex items-center">
                <UserGroupIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 mr-3 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400"> Clientes</span>
            </h1>
            <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6 border border-gray-700">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-800 border-2 border-cyan-500/30 mb-5">
                    {formFields.map((field) => (
                        <div key={field.id}>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full rounded-md overflow-hidden ${errors[field.id] ? 'border border-red-500' : 'border border-gray-700 hover:border-cyan-500 focus-within:border-cyan-500'}`}>
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-gray-700 px-3">
                                        <field.icon className="w-5 h-5 text-gray-400" />
                                    </div>
                                }
                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-800 p-3 border-none focus:outline-none focus:ring-0 focus:border-transparent ${field.disabled ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'text-gray-100'}`}
                                    >
                                        {field.options?.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className={`w-full bg-gray-800 py-3 px-4 focus:outline-none focus:ring-0 focus:border-transparent ${field.disabled ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'text-gray-100'}`}
                                    />
                                )}
                            </div>
                            {errors[field.id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                            )}
                            {field.helperText && (
                                <p className="text-sm text-gray-500 mt-1">{field.helperText}</p>
                            )}
                        </div>
                    ))}
                </form>
                <ActionButtons
                    onCancel={() => navigate(-1)}
                    onSubmit={createNewClient}
                    submitText="CREAR NUEVO CLIENTE"
                />
            </div>
        </section>
    )
}

export { CreateClientForm }