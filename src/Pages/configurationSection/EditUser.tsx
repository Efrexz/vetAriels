import { useState, useEffect, ChangeEvent, } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { NotFound } from "@components/ui/NotFound";
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import AlertIcon from '@assets/alertIcon.svg?react';

interface FormDataState {
    email: string;
    name: string;
    lastName: string;
    phone: string;
    rol: string;
    status: 'ACTIVO' | 'INACTIVO';
}

type FormErrors = Partial<Record<keyof FormDataState, string>>;

function EditUser() {
    const { users, updateUserData, roles } = useGlobal();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const rolNames = roles.map((role) => role.name);

    const individualUserData = users.find(user => user.id === id);

    const [formData, setFormData] = useState<FormDataState>({
        email: "",
        name: "",
        lastName: "",
        phone: "",
        rol: "",
        status: "ACTIVO",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    //aplicamos igual el useEffect para evitar el error que teniamos al cambiar de mascota sin actualizar la pagina cada vez que cambia el id lo detectamos y actualizamos los datos del formulario
    useEffect(() => {
        if (individualUserData) {
            setFormData({
                email: individualUserData.email || '',
                name: individualUserData.name || '',
                lastName: individualUserData.lastName || '',
                phone: individualUserData.phone || '',
                rol: individualUserData.rol || '',
                status: individualUserData.status || 'INACTIVO',
            });
        }
    }, [individualUserData]);

    // Validación de los campos
    function validateForm() {
        const newErrors: FormErrors = {};
        //Validamos si todos los campos son válidos
        if (formData.name.trim().length < 3) {
            newErrors.name = 'El nombre del cliente debe tener al menos 3 caracteres';
        }
        if (formData.lastName.trim().length < 3) {
            newErrors.lastName = 'El apellido del cliente debe tener al menos 3 caracteres';
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        if (!/^\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'El teléfono debe tener 9 dígitos';
        }
        if (!formData.rol) {
            newErrors.rol = 'Debe seleccionar un rol';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    }

    function updateUserInfo() {
        if (!validateForm() || !id) {
            return;
        }
        const updateData : Partial<User> = {
            email: formData.email,
            name: formData.name,
            lastName: formData.lastName,
            phone: formData.phone,
            rol: formData.rol,
            status: formData.status,
        };
        updateUserData(id, updateData);
        navigate("/config/user-subsidiaries");
    }

    const userFields = [
        { label: 'Correo Electrónico', type: 'email', id: 'email', icon: EmailIcon },
        { label: 'Nombre', type: 'text', id: 'name', icon: RoleUserIcon },
        { label: 'Apellido', type: 'text', id: 'lastName', icon: RoleUserIcon },
        { label: 'Teléfono Móvil', type: 'tel', id: 'phone', icon: PhoneIcon },
        { label: 'Estado', type: 'select', id: 'status', options: [ 'ACTIVO', 'INACTIVO'] },
        {
            label: 'Rol', type: 'select', id: 'rol', options: rolNames
        },
    ];

    // Si no se encuentra el usuario, mostramos un mensaje de error
    if (!individualUserData) {
        return (
            <NotFound
                entityName="Usuario"
                searchId={id!}
                returnPath="/config/user-subsidiaries"
            />
        );
    }

    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Configuraci&oacute;n
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Editar Usuario
                </h1>
            </div>
            <div className="bg-primary/5 p-4 rounded-xl mb-4 border border-primary/10">
                <p className="text-sm text-ink">Los datos personales del usuario solo pueden ser editados desde su propio perfil.</p>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-4">
                    {userFields.map((field) => (
                        <div key={field.id}>
                            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full border rounded-lg overflow-hidden ${errors[field.id as keyof FormErrors] ? 'border-danger' : 'border-slate-200 hover:border-primary focus-within:border-primary'}`}>
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-white px-3 py-1 border-r border-slate-200">
                                        <field.icon className="w-4 h-4 text-slate" />
                                    </div>
                                }

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        name={field.id}
                                        onChange={handleChange}
                                        value={formData[field.id as keyof FormDataState]}
                                        className="w-full px-3 py-2 text-sm border-none focus:outline-none focus:ring-0 bg-white text-ink"
                                    >
                                        {field.options?.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        value={formData[field.id as keyof FormDataState]}
                                        onChange={handleChange}
                                        className="w-full py-2 px-4 focus:outline-none focus:ring-0 bg-white text-sm text-ink"
                                    />
                                )}
                            </div>
                            {errors[field.id as keyof FormErrors] && (
                                <p className="text-danger text-xs mt-1">{errors[field.id as keyof FormErrors]}</p>
                            )}
                        </div>
                    ))}
                </form>
                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                        className="bg-white text-slate border border-slate-200 py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-medium"
                        onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-4 h-4 text-slate" />
                        Cancelar
                    </button>
                    <button className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-semibold font-display shadow-sm shadow-primary/25"
                        onClick={updateUserInfo}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Guardar informaci&oacute;n
                    </button>
                </div>
            </div>
        </section>
    );
}

export { EditUser };