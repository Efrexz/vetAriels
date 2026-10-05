import { ChangeEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { useToast } from '@context/ToastContext';
import SaveIcon from '@assets/diskIcon.svg?react';
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
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    function validateForm() {
        const newErrors: FormErrors = {};
        if (!/^\d{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'El número de teléfono debe tener 9 caracteres';
        } if (formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        } if (formData.lastName.trim().length < 3) {
            newErrors.lastName = 'El apellido debe tener al menos 3 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function updateData() {
        if (!validateForm() || !id) {
            return;
        }
        const updatedUserData: Partial<User> = {
            phone: formData.mobile,
            name: formData.name.trim(),
            lastName: formData.lastName.trim(),
        };
        setIsSubmitting(true);
        try {
            // updateUserData (GlobalContext) decide: name/lastName/phone van
            // via profiles (RLS), rol/status via Edge Function. Aqui solo
            // pasamos los campos no-sensibles.
            await updateUserData(id, updatedUserData);
            toast.success('Perfil actualizado correctamente');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo actualizar el perfil.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
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
        <div className="p-6 text-center text-slate">
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
            label: 'Teléfono Móvil',
            id: 'mobile',
            type: 'text',
            value: formData.mobile,
            icon: phoneIcon,
            required: true,
        },
        {
            label: 'Nombre',
            id: 'name',
            type: 'text',
            value: formData.name,
            icon: RoleUserIcon,
            required: true,
        },
        {
            label: 'Apellido',
            id: 'lastName',
            type: 'text',
            value: formData.lastName,
            icon: RoleUserIcon,
            required: true,
        },
        {
            label: 'Rol en esta clinica',
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 mt-4 mb-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-ink mb-1.5">{field.label}</label>
                            <div className="flex items-center">
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-slate-50 px-3 py-2 rounded-l-lg border border-slate-200 border-r-0">
                                        <field.icon className="w-5 h-5 text-slate" />
                                    </div>
                                }
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={field.value}
                                    onChange={handleChange}
                                    disabled={field.disabled}
                                    className={`border rounded-r-lg py-2 px-3 w-full focus:outline-none text-sm bg-white text-ink ${errors[field.id as keyof FormErrors] ? 'border-danger' : 'border-slate-200 hover:border-primary focus:border-primary'} `}
                                />
                            </div>
                            {
                                errors[field.id as keyof FormErrors] && (
                                    <p className="text-danger text-xs mt-1">{errors[field.id as keyof FormErrors]}</p>
                                )
                            }
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center sm:justify-end items-center py-3 px-4 border-t border-slate-100 pt-4">
                <button
                    className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-semibold font-display shadow-sm shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={updateData}
                    disabled={isSubmitting}
                >
                    <SaveIcon className="w-4 h-4" />
                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>
        </div>
    );
}

export { UserProfile };