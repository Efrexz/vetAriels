import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '@context/GlobalContext';
import { ActionButtons } from '@components/ActionButtons';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

const userFields = [
    { label: 'Correo Electrónico', type: 'email', id: 'email', icon: EmailIcon },
    { label: 'Nombre', type: 'text', id: 'name', icon: RoleUserIcon },
    { label: 'Apellido', type: 'text', id: 'lastName', icon: RoleUserIcon },
    { label: 'Teléfono Móvil', type: 'tel', id: 'phone', icon: PhoneIcon },
    { label: 'Estado', type: 'select', id: 'status', options: ['--Seleccionar--', 'ACTIVO', 'INACTIVO'] },
    {
        label: 'Rol', type: 'select', id: 'rol', options: [
            '--Seleccionar--',
            'Administrador',
            'Asistente Administrativo',
            'Auxiliar Veterinario',
            'Groomer',
            'Médico',
            'Recepcionista',
        ]
    },
];

function EditUser() {

    const { users, updateUserData } = useContext(GlobalContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const individualUserData = users.find(user => user.id === Number(id));
    console.log(individualUserData);



    const [formData, setFormData] = useState({
        email: individualUserData?.email,
        name: individualUserData?.name,
        lastName: individualUserData?.lastName,
        phone: individualUserData?.phone,
        rol: individualUserData?.rol,
        status: individualUserData?.status,
    });

    function handleChange(e) {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    }

    function updateUserInfo() {
        const updateData = {
            email: formData.email,
            name: formData.name,
            lastName: formData.lastName,
            phone: formData.phone,
            rol: formData.rol,
            status: formData.status,
        };
        updateUserData(Number(id), updateData);
        navigate("/config/user-subsidiaries");

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
                {userFields.map((field, index) => (
                    <div key={index}>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                        <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                            {field.icon &&
                                <div className="flex items-center justify-center bg-gray-100 px-3">
                                    <field.icon className="w-4 h-4 text-gray-600" />
                                </div>
                            }

                            {field.type === 'select' ? (
                                <select
                                    id={field.id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border-none focus:outline-none focus:ring-0"
                                >
                                    {field.options.map((option, i) => (
                                        <option key={i} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    disabled={field.disabled}
                                    className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                />
                            )}
                        </div>
                        {field.helperText && (
                            <p className="text-sm text-gray-600 mt-1">{field.helperText}</p>
                        )}
                    </div>
                ))}
            </form>
            <ActionButtons
                onCancel={() => navigate(-1)}
                onSubmit={updateUserInfo}
                submitText="GUARDAR INFORMACION"
            />


        </section>
    );
}

export { EditUser };