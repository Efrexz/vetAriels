import { ChangeEvent,useState, useEffect } from 'react';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { useParams } from 'react-router-dom';
import { SuccessModal } from '@components/modals/SuccessModal';
import PlusIcon from '@assets/plusIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import phoneIcon from '@assets/phoneIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';

interface FormDataState {
    email: string;
    mobile: string;
    name: string;
    lastName: string;
    role: string;
}

type FormErrors = Partial<Record<keyof Omit<FormDataState, 'email' | 'role'>, string>>;

function UserProfile() {
    const { activeUser, updateUserData } = useGlobal();
    const { id } = useParams<{ id: string }>();

    //Modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormDataState>({
        email: activeUser?.email || '',
        mobile: activeUser?.phone || '',
        name: activeUser?.name || '',
        lastName: activeUser?.lastName || '',
        role: activeUser?.rol || '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (activeUser) {
        setFormData({
            email: activeUser.email || '',
            mobile: activeUser.phone || '',
            name: activeUser.name || '',
            lastName: activeUser.lastName || '',
            role: activeUser.rol || '',
        });
        }
    }, [activeUser]);

    // Validación de los campos
    function validateForm() {
        const newErrors: FormErrors = {};
        //Validamos si todos los campos son válidos
        if (!/^\d{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'El número de teléfono debe tener 9 caracteres';
        } if (formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        } if (formData.lastName.trim().length < 3) {
            newErrors.lastName = 'El apellido debe tener al menos 3 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }


    function updateData() {
        if (!validateForm() || !id) {
            return;
        }
        const updatedUserData: Partial<User> = {
            phone: formData.mobile,
            name: formData.name.trim(),
            lastName: formData.lastName.trim(),
        };
        updateUserData(id, updatedUserData);
        setIsModalOpen(true)
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }

    if (!activeUser) {
        return (
        <div className="p-6 text-center text-gray-500">
            No hay un usuario activo para mostrar el perfil.
        </div>
        );
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
                            <label className="block text-gray-300 mb-1">{field.label}</label>
                            <div className="flex items-center">
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-gray-800 px-3 py-3.5 rounded-l-lg">
                                        <field.icon className="w-5 h-5 text-gray-400" />
                                    </div>
                                }
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={formData[field.id as keyof FormDataState]}
                                    onChange={handleChange}
                                    disabled={field.disabled}
                                    className={`border rounded-r-lg p-3 w-full focus:outline-none bg-gray-800 text-gray-200 ${errors[field.id as keyof FormErrors] ? 'border-rose-500' : 'border-gray-700 hover:border-cyan-500 focus:border-cyan-500'} `}
                                />
                            </div>
                            {
                                errors[field.id as keyof FormErrors] && (
                                    <p className="text-rose-500 text-sm mt-1">{errors[field.id as keyof FormErrors]}</p>
                                )
                            }
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-center sm:justify-end items-center bg-gray-900 py-3 px-4 shadow-xl border-t border-gray-700 pt-4'>
                <button
                    className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3 w-full sm:w-auto"
                    onClick={updateData}
                >
                    <PlusIcon className="w-5 h-5" />
                    GUARDAR CAMBIOS
                </button>
            </div>
            {
                isModalOpen && (
                    <SuccessModal onClose={() => setIsModalOpen(false)} />
                )
            }
        </div>
    );
}

export { UserProfile };