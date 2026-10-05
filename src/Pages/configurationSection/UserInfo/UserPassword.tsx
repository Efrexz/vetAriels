import { useState, ChangeEvent } from 'react';
import { useGlobal } from '@context/GlobalContext';
import { changePassword } from '../../../services/authService';
import { useToast } from '@context/ToastContext';
import KeyIcon from '@assets/keyIcon.svg?react';
import InfoIcon from '@assets/infoIcon.svg?react';
import SaveIcon from '@assets/diskIcon.svg?react';

interface PasswordFormData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

type FormErrors = Partial<Record<keyof PasswordFormData, string>>;

function UserPassword() {
    const { activeUser } = useGlobal();
    const [formData, setFormData] = useState<PasswordFormData>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }

    function validateForm() {
        const newErrors: FormErrors = {};
        if (!formData.oldPassword || formData.oldPassword.length < 6) {
            newErrors.oldPassword = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!formData.newPassword || formData.newPassword.length < 6) {
            newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres.';
        }
        if (formData.newPassword === formData.oldPassword) {
            newErrors.newPassword = 'La nueva contraseña debe ser distinta a la actual.';
        }
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function updatePassword() {
        if (!activeUser) return;
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await changePassword(formData.oldPassword, formData.newPassword);
            toast.success('Contrasena actualizada correctamente');
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo actualizar la contrasena.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
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
                    {(['oldPassword', 'newPassword', 'confirmPassword'] as const).map((field, index) => {
                        const labels: Record<string, string> = {
                            oldPassword: 'Contraseña Actual',
                            newPassword: 'Contraseña Nueva',
                            confirmPassword: 'Confirmar Contraseña',
                        };
                        return (
                            <div key={index}>
                                <label className="block text-sm font-medium text-ink mb-1.5">{labels[field]}</label>
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center bg-slate-50 px-3 py-2 rounded-l-lg border border-slate-200 border-r-0">
                                        <KeyIcon className="w-5 h-5 text-slate" />
                                    </div>
                                    <input
                                        type="password"
                                        id={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className={`border rounded-r-lg py-2 px-3 w-full text-sm hover:border-primary focus:outline-none focus:border-primary bg-white text-ink ${errors[field] ? 'border-danger' : 'border-slate-200'}`}
                                    />
                                </div>
                                {errors[field] && (
                                    <p className="text-danger text-xs mt-1">{errors[field]}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end items-center py-3 px-4 border-t border-slate-100 pt-4">
                <button
                    className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 text-sm font-semibold font-display shadow-sm shadow-primary/25 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={updatePassword}
                    disabled={isSubmitting}
                >
                    <SaveIcon className="w-4 h-4" />
                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>
        </div>
    );
}

export { UserPassword };