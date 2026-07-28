import { useState, ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { ErrorModal } from '@components/modals/ErrorModal';
import { SuccessModal } from '@components/modals/SuccessModal';
import PlusIcon from '@assets/plusIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';
import InfoIcon from '@assets/infoIcon.svg?react';

interface PasswordFormData {
    oldPassword: string;
    newPassword: string;
}

type FormErrors = Partial<Record<keyof PasswordFormData, string>>;

interface FormFieldConfig {
    label: string;
    id: keyof PasswordFormData;
    type: 'password';
    icon: ComponentType<React.SVGProps<SVGSVGElement>>;
}

const formFields: FormFieldConfig[] = [
    { label: "Contraseña Actual", id: 'oldPassword', type: 'password', icon: KeyIcon },
    { label: "Contraseña Nueva", id: 'newPassword', type: 'password', icon: KeyIcon },
];

function UserPassword() {

    const { activeUser, updateUserData } = useGlobal();
    const [formData, setFormData] = useState<PasswordFormData>({ oldPassword: '', newPassword: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();
    //Modales
    const [isErrorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }

    // Validación de los campos
    function validateForm() {
        const newErrors: FormErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.oldPassword || formData.oldPassword.length < 6) {
            newErrors.oldPassword = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!formData.newPassword || formData.newPassword.length < 6) {
            newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }


    function updatePassword() {
        if (!activeUser) return;
        //Si el formulario no es válido, no actualizamos nada y mostramos los errores
        if (!validateForm()) {
            return;
        }

        if (formData.oldPassword !== activeUser.password) {
            setErrorModalOpen(true);
            return;
        }

        const updatedData: Partial<User> = {
            password: formData.newPassword,
        };

        updateUserData(activeUser.id, updatedData);
        setSuccessModalOpen(true);
    }

    return (
        <div className="flex flex-col w-full">
            <div className="mt-4 p-4 bg-primary text-white rounded-xl mx-4 flex gap-2">
                <InfoIcon className="w-5 h-5 text-white flex-shrink-0" />
                <p className="text-sm">
                    Ingresa tu contrase&ntilde;a actual y luego la contrase&ntilde;a nueva por la que quieres cambiarla.
                </p>
            </div>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 mt-4 mb-8">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-ink mb-1.5">{field.label}</label>
                            <div className="flex items-center ">
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-slate-50 px-3 py-2 rounded-l-lg border border-slate-200 border-r-0">
                                        <field.icon className="w-5 h-5 text-slate" />
                                    </div>
                                }
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    className={`border rounded-r-lg py-2 px-3 w-full text-sm hover:border-primary focus:outline-none focus:border-primary bg-white text-ink ${errors[field.id] ? 'border-danger' : 'border-slate-200'}`}
                                />
                            </div>
                            {errors[field.id] && (
                                <p className="text-danger text-xs mt-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end items-center py-3 px-4 border-t border-slate-100 pt-4">
                <button className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 text-sm font-semibold font-display shadow-sm shadow-primary/25 transition-colors"
                    onClick={updatePassword}
                >
                    <PlusIcon className="w-4 h-4" />
                    Guardar cambios
                </button>
            </div>
            {
                isErrorModalOpen && (
                    <ErrorModal onClose={() => setErrorModalOpen(false)} typeOfError="password" />
                )
            }
            {
                isSuccessModalOpen && (
                    <SuccessModal onClose={() => setSuccessModalOpen(false)} />
                )
            }
        </div>
    );
}

export { UserPassword };