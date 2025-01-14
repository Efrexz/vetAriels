import { useContext, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { ClientsContext } from '@context/ClientsContext';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import DocumentIcon from '@assets/documentIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import LocationIcon from '@assets/locationIcon.svg?react';

function ClientProfile() {

    const { updateClientData, clients } = useContext(ClientsContext);
    const { id } = useParams();
    const navigate = useNavigate();


    const individualClientData = clients.find(client => client.id === Number(id));
    const [errors, setErrors] = useState({});


    const [formData, setFormData] = useState({
        name: individualClientData?.firstName || '',
        lastName: individualClientData?.lastName || '',
        document: individualClientData?.dni || '',
        email: individualClientData?.email || '',
        mobile: individualClientData?.phone1 || '',
        phone: individualClientData?.phone2 || '',
        district: individualClientData?.district || '',
        address: individualClientData?.address || '',
        reference: individualClientData?.reference || '',
        observations: individualClientData?.observations || ''
    });

    function validateForm() {
        const newErrors = {};
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

    function handleChange(e) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }

    function updateData() {
        if (!validateForm()) {
            return;
        }
        const updatedClient = {
            ...individualClientData, //Mantenemos el id y las mascotas existentes
            firstName: formData.name,
            lastName: formData.lastName,
            email: formData.email,
            dni: formData.document,
            phone1: formData.mobile,
            phone2: formData.phone,
            address: formData.address,
            district: formData.district,
            reference: formData.reference,
            observations: formData.observations,
        };

        updateClientData(individualClientData.id, updatedClient);
        navigate(`/clients`);
    }

    const formFields = [
        {
            label: 'Nombre',
            id: 'name',
            type: 'text',
            value: formData.name,
            icon: RoleUserIcon,
            required: true
        },
        {
            label: 'Apellido',
            id: 'lastName',
            type: 'text',
            value: formData.lastName,
            icon: RoleUserIcon,
            required: true
        },
        {
            label: 'Número de documento de identidad',
            id: 'document',
            type: 'text',
            value: formData.document,
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
            id: 'mobile',
            type: 'text',
            value: formData.mobile,
            icon: PhoneIcon,
            required: true
        },
        {
            label: 'Teléfono de trabajo',
            id: 'phone',
            type: 'text',
            value: formData.phone,
            icon: PhoneIcon,
        },
        {
            label: 'Dirección',
            id: 'address',
            type: 'text',
            value: formData.address,
            icon: LocationIcon,
        },
        {
            label: 'Referencias de la dirección',
            id: 'reference',
            type: 'text',
            value: formData.reference,
            icon: LocationIcon,
        },
        {
            label: 'Observaciones del cliente',
            id: 'observations',
            type: 'text',
            value: formData.observation,
            icon: LocationIcon,
        },
    ];

    return (
        <div className="flex flex-col w-full">
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
                                    className={`border rounded-r-lg p-3 bg-gray-50 w-full focus:outline-none ${errors[field.id] ? "border-red-500" : "hover:border-blue-300 focus-within:border-blue-300"} `}
                                    type={field.type}
                                    id={field.id}
                                    value={formData[field.id]}
                                    required={field.required}
                                    onChange={handleChange}
                                />
                            </div>
                            {
                                errors[field.id] && <p className="text-red-500 text-xs">{errors[field.id]}</p>
                            }
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex w-full justify-end  items-center bg-gray-100 py-3 px-5 shadow-lg rounded-b-lg'>
                <button
                    onClick={updateData}
                    className="bg-green-500 w-full sm:w-auto justify-center text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3">
                    <PlusIcon className="w-5 h-5 text-white" />
                    GUARDAR CAMBIOS
                </button>
            </div>
        </div >
    );
}

export { ClientProfile };

