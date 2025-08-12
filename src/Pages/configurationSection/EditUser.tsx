import { useState, useEffect, ChangeEvent, } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
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
        <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-xl w-full text-center border-t-4 border-red-500">
                <AlertIcon className="text-red-500 w-16 mx-auto mb-6 opacity-80" />
                <h1 className="text-4xl font-extrabold text-gray-700 mb-4">Usuario no Encontrado</h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    No se encontró ningún usuario con el ID "<strong className="text-red-600">#{id}</strong>".
                </p>
                <Link
                    to="/config/user-subsidiaries"
                    className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Volver a la lista de usuarios
                </Link>
            </div>
        </div>
        );
    }

    return (
        <section className="w-full mx-auto p-6 bg-white">
            <h1 className="text-2xl md:text-3xl font-ligth text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <UserGroupIcon className="w-6 md:w-9 h-6 md:h-9 mr-2" />
                Editar Usuario
            </h1>
            <div className="bg-blue-100 p-4 rounded mb-4">
                <p className="text-blue-700">Los datos personales del usuario solo pueden ser editados desde su propio perfil.</p>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 bg-gray-50 p-6 shadow-md rounded-t-md">
                {userFields.map((field) => (
                    <div key={field.id}>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                        <div className={`flex w-full border-gray-200 border rounded-lg overflow-hidden ${errors[field.id as keyof FormErrors] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus-within:border-blue-300'}`}>
                            {field.icon &&
                                <div className="flex items-center justify-center bg-gray-100 px-3">
                                    <field.icon className="w-4 h-4 text-gray-600" />
                                </div>
                            }

                            {field.type === 'select' ? (
                                <select
                                    id={field.id}
                                    name={field.id}
                                    onChange={handleChange}
                                    value={formData[field.id as keyof FormDataState]}
                                    className="w-full px-3 py-2 border-none focus:outline-none focus:ring-0"
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
                                    className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                />
                            )}
                        </div>
                        {errors[field.id as keyof FormErrors] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.id as keyof FormErrors]}</p>
                        )}
                    </div>
                ))}
            </form>
            <div className='flex flex-col sm:flex-row justify-end items-center gap-4 p-4 border-t border-gray-200 bg-gray-50 shadow-md '>
                <button
                    className="bg-white w-full sm:w-auto border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center justify-center gap-3"
                    onClick={() => navigate(-1)}
                >
                    <ReturnIcon className="w-5 h-5 text-gray-700" />
                    CANCELAR
                </button>
                <button className="bg-green-500 w-full sm:w-auto text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-3"
                    onClick={updateUserInfo}
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    GUARDAR INFORMACION
                </button>
            </div>
        </section>
    );
}

export { EditUser };