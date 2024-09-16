import { useContext, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { ClientsContext } from '../../context/ClientsContext';
import RoleUserIcon from '../../assets/roleUserIcon.svg?react';
import DocumentIcon from '../../assets/documentIcon.svg?react';
import EmailIcon from '../../assets/emailIcon.svg?react';
import PhoneIcon from '../../assets/phoneIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import LocationIcon from '../../assets/locationIcon.svg?react';

function ClientProfile() {

    const { updateClientData, clients } = useContext(ClientsContext);
    const { id } = useParams();
    const navigate = useNavigate();


    const individualClientData = clients.find(client => client.id === Number(id));


    const [formData, setFormData] = useState({
        nombre: individualClientData?.firstName || '',
        apellido: individualClientData?.lastName || '',
        documento: individualClientData?.dni || '',
        email: individualClientData?.email || '',
        telefono_movil: individualClientData?.phone1 || '',
        telefono_trabajo: individualClientData?.phone2 || '',
        distrito: individualClientData?.district || '',
        direccion: individualClientData?.address || '',
        referencia: individualClientData?.reference || '',
        observaciones: individualClientData?.observations || ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };

    const updateData = (e) => {
        e.preventDefault();

        const updatedClient = {
            ...individualClientData, //Mantenemos el id y las mascotas existentes
            firstName: formData.nombre,
            lastName: formData.apellido,
            email: formData.email,
            dni: formData.documento,
            phone1: formData.telefono_movil,
            phone2: formData.telefono_trabajo,
            address: formData.direccion,
            district: formData.distrito,
            reference: formData.referencia,
            observations: formData.observaciones,
        };

        updateClientData(individualClientData.id, updatedClient);
        navigate(`/clients`);
    };

    const formFields = [
        {
            label: 'Nombre',
            id: 'nombre',
            type: 'text',
            value: formData.nombre,
            icon: RoleUserIcon,
            required: true
        },
        {
            label: 'Apellido',
            id: 'apellido',
            type: 'text',
            value: formData.apellido,
            icon: RoleUserIcon,
            required: true
        },
        {
            label: 'Número de documento de identidad',
            id: 'documento',
            type: 'text',
            value: formData.documento,
            icon: DocumentIcon,
        },
        {
            label: 'Correo electrónico',
            id: 'email',
            type: 'email',
            value: formData.email,
            icon: EmailIcon,
            helperText: 'Para enviar notificaciones o correos masivos, el cliente debe confirmar su correo electrónico'
        },
        {
            label: 'Teléfono móvil',
            id: 'telefono_movil',
            type: 'text',
            value: formData.telefono_movil,
            icon: PhoneIcon,
            required: true
        },
        {
            label: 'Teléfono de trabajo',
            id: 'telefono_trabajo',
            type: 'text',
            value: formData.telefono_trabajo,
            icon: PhoneIcon,
        },
        {
            label: 'Dirección',
            id: 'direccion',
            type: 'text',
            value: formData.direccion,
            icon: LocationIcon,
        },
        {
            label: 'Referencias de la dirección',
            id: 'referencia',
            type: 'text',
            value: formData.referencia,
            icon: LocationIcon,
        },
        {
            label: 'Observaciones del cliente',
            id: 'observaciones',
            type: 'text',
            value: formData.observaciones,
            icon: LocationIcon,
        },
    ];

    return (
        <div className="flex flex-col w-full">
            {/* Información del cliente */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4 mt-4 mb-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-600">{field.label}</label>
                            <div className="flex items-center ">
                                <div className="flex items-center justify-center bg-gray-100 px-3 py-3.5 rounded-l-lg">
                                    <field.icon className="w-5 h-5 text-gray-500" />
                                </div>
                                <input
                                    className="border rounded-r-lg p-3 bg-gray-50 w-full hover:border-blue-300 focus-within:border-blue-300"
                                    type={field.type}
                                    id={field.id}
                                    value={formData[field.id]}
                                    required={field.required}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-end items-center bg-gray-100 py-3 px-5 shadow-lg rounded-b-lg'>
                <button
                    onClick={updateData}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3">
                    <PlusIcon className="w-5 h-5 text-white" />
                    GUARDAR CAMBIOS
                </button>
            </div>
        </div >

    );
}

export { ClientProfile };

