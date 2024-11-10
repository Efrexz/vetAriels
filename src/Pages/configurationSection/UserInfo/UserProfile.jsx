import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import PlusIcon from '../../../assets/plusIcon.svg?react';
import RoleUserIcon from '../../../assets/roleUserIcon.svg?react';
import phoneIcon from '../../../assets/phoneIcon.svg?react';
import EmailIcon from '../../../assets/emailIcon.svg?react';


function UserProfile() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: 'AdministracionAriels@gmail.com',
        mobile: '917104426',
        name: 'Administracion',
        lastName: 'Ariels',
        role: 'Jefe de jefes',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };

    const updateData = () => {
        const updatedUserData = {
            ...formData,
            mobile: formData.mobile,
            name: formData.name,
            lastName: formData.lastName,
        };
        // updatePetData(individualPetData.id, updatedPetInfo);
    };

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

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-0"
                                        onChange={handleChange}
                                        value={formData[field.id]}
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
                                        className="border rounded-r-lg p-3  w-full hover:border-blue-300 focus-within:border-blue-300"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-end items-center bg-gray-100 py-3 px-4 shadow-lg rounded-b-lg'>
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                    onClick={updateData}
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    GUARDAR CAMBIOS
                </button>
            </div>
        </div >

    );
}

export { UserProfile };