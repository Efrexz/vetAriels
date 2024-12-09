import { useState } from 'react';
import PlusIcon from '@assets/plusIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';
import InfoIcon from '@assets/infoIcon.svg?react';


function UserPassword() {


    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
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
            label: "Contraseña Actual",
            id: 'oldPassword',
            type: 'password',
            value: formData.oldPassword,
            icon: KeyIcon,
            required: true,
        },
        {
            label: "Contraseña Nueva",
            id: 'newPassword',
            type: 'password',
            value: formData.newPassword,
            icon: KeyIcon,
            required: true,
        },
    ];

    return (
        <div className="flex flex-col w-full">
            <div className="mt-6 p-4 bg-blue-500 text-white rounded-lg m-3 flex gap-2">
                <InfoIcon className="w-5 h-5 text-white" />
                <p>
                    Ingresa tu contraseña actual y luego la contraseña nueva por la que quieres cambiarla.
                </p>
            </div>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4 mt-4 mb-8">
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
                                    className="border rounded-r-lg p-3  w-full hover:border-blue-300 focus-within:border-blue-300"
                                />

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

export { UserPassword };