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
        <section className="w-full p-1 md:p-6 bg-gray-950">
            <h1 className="text-2xl md:text-2xl font-medium mb-4 pb-4 border-b-2 border-cyan-500 flex items-center ">
                <UserGroupIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-cyan-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Editar Usuario</span>
            </h1>
            <div className="bg-cyan-900 p-4 rounded-lg mb-4">
                <p className="text-cyan-200">Los datos personales del usuario solo pueden ser editados desde su propio perfil.</p>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6 border border-gray-700">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 bg-gray-900 p-6 shadow-xl rounded-t-lg border border-cyan-500/30">
                    {userFields.map((field) => (
                        <div key={field.id}>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full border rounded-lg overflow-hidden ${errors[field.id as keyof FormErrors] ? 'border-rose-500' : 'border-gray-700 hover:border-cyan-500 focus-within:border-cyan-500'}`}>
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-gray-700 px-3 py-1 border-r border-gray-600">
                                        <field.icon className="w-4 h-4 text-gray-400" />
                                    </div>
                                }

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        name={field.id}
                                        onChange={handleChange}
                                        value={formData[field.id as keyof FormDataState]}
                                        className="w-full px-3 py-1 border-none focus:outline-none focus:ring-0 bg-gray-700 text-gray-200"
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
                                        className="w-full py-1 px-4 focus:outline-none focus:ring-0 focus:border-transparent bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                            {errors[field.id as keyof FormErrors] && (
                                <p className="text-rose-500 text-sm mt-1">{errors[field.id as keyof FormErrors]}</p>
                            )}
                        </div>
                    ))}
                </form>
                <div className='flex flex-col sm:flex-row justify-end items-center gap-4 p-4 border-t border-gray-700 bg-gray-900 shadow-xl rounded-b-lg'>
                    <button
                        className="bg-gray-700 hover:bg-gray-600 w-full sm:w-auto border border-gray-700 text-white px-3 py-1 rounded-lg  transition-colors flex items-center justify-center gap-3"
                        onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-4 h-4 text-gray-300" />
                        CANCELAR
                    </button>
                    <button className="bg-emerald-600 w-full sm:w-auto text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3"
                        onClick={updateUserInfo}
                    >
                        <PlusIcon className="w-4 h-4 text-white" />
                        GUARDAR INFORMACION
                    </button>
                </div>
            </div>
        </section>
    );
}

export { EditUser };