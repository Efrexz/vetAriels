import { useContext, useState } from 'react';
import { GlobalContext } from '@context/GlobalContext';
import { useParams } from 'react-router-dom';
import { SuccessModal } from '@components/modals/SuccessModal';
import PlusIcon from '@assets/plusIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import phoneIcon from '@assets/phoneIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';


function UserProfile() {
    const { activeUser, updateUserData } = useContext(GlobalContext);
    const [errors, setErrors] = useState({});
    const { id } = useParams();

    //Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        email: activeUser?.email || '',
        mobile: activeUser?.phone || '',
        name: activeUser?.name || '',
        lastName: activeUser?.lastName || '',
        role: activeUser?.rol || '',
    });

    // Validación de los campos
    function validateForm() {
        const newErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.mobile || formData.mobile.length < 9) {
            newErrors.mobile = 'El número de teléfono debe tener al menos 9 caracteres';
        } if (!formData.name || formData.name.length < 4) {
            newErrors.name = 'El nombre debe tener al menos 4 caracteres';
        } if (!formData.lastName || formData.lastName.length < 4) {
            newErrors.lastName = 'El apellido debe tener al menos 4 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }


    function updateData() {
        if (!validateForm()) {
            return;
        }
        const updatedUserData = {
            ...activeUser,
            phone: formData.mobile,
            name: formData.name,
            lastName: formData.lastName,
        };
        updateUserData(Number(id), updatedUserData);
        setIsModalOpen(true)
    }

    function handleChange(e) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }


    const formFields = [
        {
            label: 'Correo electrónico',
            id: 'email',
            type: 'text',
            value: formData.email,
            icon: EmailIcon,
            required: true,
            disabled: true
        },
        {
            label: "Télefono Móvil",
            id: 'mobile',
            type: 'text',
            value: formData.mobile,
            icon: phoneIcon,
            required: true,
        },
        {
            label: "Nombre",
            id: 'name',
            type: 'text',
            value: formData.name,
            icon: RoleUserIcon,
            required: true,
        },
        {
            label: "Apellido",
            id: 'lastName',
            type: 'text',
            value: formData.lastName,
            icon: RoleUserIcon,
            required: true,
        },
        {
            label: "Rol en esta clinica",
            id: 'role',
            type: 'text',
            value: formData.role,
            icon: RoleUserIcon,
            disabled: true,
        }
    ];

    return (
        <div className="flex flex-col w-full">
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4 mt-4 mb-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-600 mb-1">{field.label}</label>
                            <div className="flex items-center ">
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-gray-100 px-3 py-3.5 rounded-l-lg">
                                        <field.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                }
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    disabled={field.disabled}
                                    className={`border rounded-r-lg p-3 w-full focus:outline-none ${errors[field.id] ? 'border-red-500' : 'border-gray-300 hover:border-blue-300 focus-within:border-blue-300'} `}
                                />
                            </div>
                            {
                                errors[field.id] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                                )
                            }
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-center sm:justify-end items-center bg-gray-100 py-3 px-4 shadow-lg rounded-b-lg'>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-3 w-full sm:w-auto"
                    onClick={updateData}
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    GUARDAR CAMBIOS
                </button>
            </div>
            {
                isModalOpen && (
                    <SuccessModal onClose={() => setIsModalOpen(false)} />
                )
            }
        </div >

    );
}

export { UserProfile };