import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '@context/GlobalContext';
import { ErrorModal } from '@components/ErrorModal';
import { SuccessModal } from '@components/SuccessModal';
import PlusIcon from '@assets/plusIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';
import InfoIcon from '@assets/infoIcon.svg?react';


function UserPassword() {

    const { activeUser, updateUserData } = useContext(GlobalContext);
    const { id } = useParams();


    //Modales
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }

    // Validación de los campos
    function validateForm() {
        const newErrors = {};
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
        //Si el formulario no es válido, no actualizamos nada y mostramos los errores
        if (!validateForm()) {
            return;
        }
        const updatedUserData = {
            ...activeUser,
            password: formData.newPassword,
        };
        if (formData.oldPassword === activeUser.password) {
            updateUserData(Number(id), updatedUserData);
            setSuccessModalOpen(true);
            formData.oldPassword = '';
            formData.newPassword = '';
        }
        else {
            setErrorModalOpen(true);
        }
    }

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
                                    className={`border rounded-r-lg p-3 w-full hover:border-blue-300 focus:outline-none ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors[field.id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-end items-center bg-gray-100 py-3 px-4 shadow-lg rounded-b-lg'>
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                    onClick={updatePassword}
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    GUARDAR CAMBIOS
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
        </div >

    );
}

export { UserPassword };