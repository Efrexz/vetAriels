import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ClientsContext } from '@context/ClientsContext';
import { ActionButtons } from '@components/ActionButtons';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import DocumentIcon from '@assets/documentIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import LocationIcon from '@assets/locationIcon.svg?react';

function CreateClientForm() {
    const { addClient } = useContext(ClientsContext);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        document: '',
        email: '',
        mobile: '',
        phone: '',
        district: 'LIMA',
        address: '',
        reference: '',
        observations: ''
    });

    // Validación de los campos
    function validateForm() {
        const newErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.name || formData.name.length < 4) {
            newErrors.name = 'El nombre del cliente debe tener al menos 4 caracteres';
        }
        if (!formData.lastName || formData.lastName.length < 4) {
            newErrors.lastName = 'El apellido del cliente debe tener al menos 4 caracteres';
        }
        if (!formData.document || formData.document.length < 8) {
            newErrors.document = 'El número de documento de identidad debe tener al menos 8 caracteres';
        }
        if (!formData.email || formData.email.length < 6) {
            newErrors.email = 'El correo electrónico del cliente debe tener al menos 6 caracteres';
        }
        if (!formData.mobile || formData.mobile.length < 9) {
            newErrors.mobile = 'El número de teléfono móvil del cliente debe tener al menos 9 caracteres';
        }
        if (!formData.address || formData.address.length < 4) {
            newErrors.address = 'La dirección del cliente debe tener al menos 4 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    const handleChange = (e) => {
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

        const newClient = {
            id: Date.now(),
            firstName: formData.name,
            lastName: formData.lastName,
            email: formData.email,
            dni: formData.document,
            date: currentDate,
            hour: currentTime,
            phone1: formData.mobile,
            phone2: formData.phone,
            address: formData.address,
            distrit: formData.district,
            reference: formData.reference,
            observations: formData.observations,
            pets: []
        };

        addClient(newClient);
        navigate(`/clients/client/${newClient.id}/update`);
    }

    const formFields = [
        {
            label: 'Nombre *',
            id: 'name',
            type: 'text',
            icon: RoleUserIcon,
            required: true
        },
        {
            label: 'Apellido *',
            id: 'lastName',
            type: 'text',
            icon: RoleUserIcon,
            required: true
        },
        {
            label: 'Número de documento de identidad',
            id: 'document',
            icon: DocumentIcon,
            type: 'text'
        },
        {
            label: 'Correo electrónico',
            id: 'email',
            icon: EmailIcon,
            type: 'email',
            helperText: 'Para enviar notificaciones o correos masivos, el cliente debe confirmar su correo electrónico'
        },
        {
            label: 'Teléfono móvil *',
            id: 'mobile',
            icon: PhoneIcon,
            type: 'text',
            helperText: 'Para utilizar WhatsApp, registrar el código de país delante del teléfono móvil. Ej. +51',
            required: true
        },
        {
            label: 'Teléfono de trabajo',
            id: 'phone',
            icon: PhoneIcon,
            type: 'text'
        },
        {
            label: 'Distrito',
            id: 'district',
            type: 'select',
            options: ['LIMA']
        },
        {
            label: 'Dirección *',
            id: 'address',
            type: 'text'
        },
        {
            label: 'Referencias de la dirección',
            id: 'reference',
            icon: LocationIcon,
            type: 'text'
        },
        {
            label: 'Observaciones del cliente',
            id: 'observations',
            icon: LocationIcon,
            type: 'text'
        },
    ];

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-xl sm:text-2xl font-medium text-blue-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <UserGroupIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                Clientes
            </h1>
            <div className="bg-white p-4 pb-10 rounded-t-lg shadow-lg">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full border-gray-200 border rounded-lg overflow-hidden ${errors[field.id] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus-within:border-blue-300'}`}>
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-gray-100 px-3">
                                        <field.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                }

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        className={`w-full px-3 py-2 border-none focus:outline-none focus:ring-0`}
                                    >
                                        {field.options.map((option, i) => (
                                            <option key={i} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                )}
                            </div>
                            {errors[field.id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                            )}
                            {field.helperText && (
                                <p className="text-sm text-gray-600 mt-1">{field.helperText}</p>
                            )}
                        </div>
                    ))}
                </form>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                onSubmit={createNewClient}
                submitText="CREAR NUEVO CLIENTE"
            />
        </section>
    )
}

export { CreateClientForm }