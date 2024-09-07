import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ClientsContext } from '../context/ClientsContext';
import UserGroupIcon from '../assets/userGroupIcon.svg?react';
import RoleUserIcon from '../assets/roleUserIcon.svg?react';
import DocumentIcon from '../assets/documentIcon.svg?react';
import EmailIcon from '../assets/emailIcon.svg?react';
import PhoneIcon from '../assets/phoneIcon.svg?react';
import LocationIcon from '../assets/locationIcon.svg?react';
import PlusIcon from '../assets/plusIcon.svg?react';


function CreateClientForm() {
    const { addClient } = useContext(ClientsContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        documento: '',
        email: '',
        telefono_movil: '',
        telefono_trabajo: '',
        distrito: 'LIMA',
        direccion: '',
        referencia: '',
        observaciones: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newClient = {
            id: Date.now(),
            firstName: formData.nombre,
            lastName: formData.apellido,
            email: formData.email,
            dni: formData.documento,
            date: currentDate,
            hour: currentTime,
            phone1: formData.telefono_movil,
            phone2: formData.telefono_trabajo,
            address: formData.direccion,
            distrit: formData.distrito,
            reference: formData.referencia,
            observations: formData.observaciones,
            pets: []
        };

        addClient(newClient);
        navigate(`/clients/client/${newClient.id}/update`);
    };

    const formFields = [
        {
            label: 'Nombre *',
            id: 'nombre',
            type: 'text',
            icon: RoleUserIcon,
            required: true
        },
        {
            label: 'Apellido *',
            id: 'apellido',
            type: 'text',
            icon: RoleUserIcon,
            required: true
        },
        {
            label: 'Número de documento de identidad',
            id: 'documento',
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
            id: 'telefono_movil',
            icon: PhoneIcon,
            type: 'text',
            helperText: 'Para utilizar WhatsApp, registrar el código de país delante del teléfono móvil. Ej. +51',
            required: true
        },
        {
            label: 'Teléfono de trabajo',
            id: 'telefono_trabajo',
            icon: PhoneIcon,
            type: 'text'
        },
        {
            label: 'Distrito',
            id: 'departamento',
            type: 'select',
            options: ['LIMA']
        },
        {
            label: 'Dirección *',
            id: 'direccion',
            type: 'text'
        },
        {
            label: 'Referencias de la dirección',
            id: 'referencia',
            icon: LocationIcon,
            type: 'text'
        },
        {
            label: 'Observaciones del cliente',
            id: 'observaciones',
            icon: LocationIcon,
            type: 'text'
        },
    ];

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-blue-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <UserGroupIcon className="w-9 h-9  mr-2" />
                Clientes
            </h1>
            <div className="bg-white p-4 pb-10 rounded-t-lg shadow-lg">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-gray-100 px-3">
                                        <field.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                }

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        className="w-full px-3 py-2 border-none focus:outline-none focus:ring-0"
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
                            {field.helperText && (
                                <p className="text-sm text-gray-600 mt-1">{field.helperText}</p>
                            )}
                        </div>
                    ))}
                </form>
            </div>
            <div className='flex justify-between items-center bg-gray-100 py-3 px-4 shadow-lg rounded-b-lg'>
                <button
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                    onClick={() => navigate(-1)}
                >
                    <PlusIcon className="w-5 h-5 text-gray-700" />
                    CANCELAR
                </button>
                <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3">
                    <PlusIcon className="w-5 h-5 text-white" />
                    CREAR NUEVO CLIENTE
                </button>
            </div>
        </section>
    )
}

export { CreateClientForm }