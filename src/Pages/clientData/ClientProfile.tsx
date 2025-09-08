import { useContext, useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { Client } from '@t/client.types';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import DocumentIcon from '@assets/documentIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import LocationIcon from '@assets/locationIcon.svg?react';

interface FormDataState {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    phone1: string;
    phone2: string;
    district: string;
    address: string;
    reference: string;
    observations: string;
}

function ClientProfile() {

    const { updateClientData, clients } = useClients();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    const individualClientData = clients.find(client => client.id === id);
    const [errors, setErrors] = useState<Record<string, string>>({});


    const [formData, setFormData] = useState<FormDataState>({
        firstName: '',
        lastName: '',
        dni: '',
        email: '',
        phone1: '',
        phone2: '',
        district: '',
        address: '',
        reference: '',
        observations: ''
    });

    //Aplicamos la misma solución que en PetProfile para que se actualice el formulario al cambiar de cliente
    useEffect(() => {
        if (individualClientData) {
            setFormData({
                firstName: individualClientData.firstName || '',
                lastName: individualClientData.lastName || '',
                dni: individualClientData.dni || '',
                email: individualClientData.email || '',
                phone1: individualClientData.phone1 || '',
                phone2: individualClientData.phone2 || '',
                district: individualClientData.district || '',
                address: individualClientData.address || '',
                reference: individualClientData.reference || '',
                observations: individualClientData.observations || ''
            });
            setErrors({});
        }
    }, [individualClientData]);

    function handleChange (e: ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    function validateForm(): boolean {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName || formData.firstName.length < 4) {
            newErrors.firstName = 'El nombre del cliente debe tener al menos 4 caracteres';
        }
        if (!formData.lastName || formData.lastName.length < 4) {
            newErrors.lastName = 'El apellido del cliente debe tener al menos 4 caracteres';
        }
        if (!formData.dni || formData.dni.length < 8) {
            newErrors.document = 'El número de documento de identidad debe tener al menos 8 caracteres';
        }
        if (!formData.email || formData.email.length < 6) {
            newErrors.email = 'El correo electrónico del cliente debe tener al menos 6 caracteres';
        }
        if (!formData.phone1 || formData.phone1.length < 9) {
            newErrors.mobile = 'El número de teléfono móvil del cliente debe tener al menos 9 caracteres';
        }
        if (!formData.address || formData.address.length < 4) {
            newErrors.address = 'La dirección del cliente debe tener al menos 4 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }


    function updateData() {
        if (!validateForm() || !individualClientData) {
            return;
        }
        const updatedClient: Partial<Client> = {
            ...individualClientData, //Mantenemos el id y las mascotas existentes
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            dni: formData.dni,
            phone1: formData.phone1,
            phone2: formData.phone2,
            address: formData.address,
            district: formData.district,
            reference: formData.reference,
            observations: formData.observations,
        };

        updateClientData(individualClientData.id, updatedClient);
        navigate(`/clients`);
    }

    if (!individualClientData) {
        return <div className="p-6 text-center text-gray-500">Cargando datos del cliente...</div>;
    }

    const formFields = [
    { label: 'Nombre', id: 'firstName', type: 'text', icon: RoleUserIcon, required: true },
    { label: 'Apellido', id: 'lastName', type: 'text', icon: RoleUserIcon, required: true },
    { label: 'Número de documento de identidad', id: 'dni', type: 'text', icon: DocumentIcon },
    { label: 'Correo electrónico', id: 'email', type: 'email', icon: EmailIcon },
    { label: 'Teléfono móvil', id: 'phone1', type: 'text', icon: PhoneIcon, required: true },
    { label: 'Teléfono de trabajo', id: 'phone2', type: 'text', icon: PhoneIcon },
    { label: 'Dirección', id: 'address', type: 'text', icon: LocationIcon },
    { label: 'Referencias de la dirección', id: 'reference', type: 'text', icon: LocationIcon },
    { label: 'Observaciones del cliente', id: 'observations', type: 'text', icon: LocationIcon },
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
                                    value={formData[field.id as keyof FormDataState]}
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

