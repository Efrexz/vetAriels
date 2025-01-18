import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ClientsContext } from '@context/ClientsContext';
import { ActionButtons } from '@components/ActionButtons';
import CakeIcon from '@assets/cakeIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';
import BookIcon from '@assets/bookIcon.svg?react';
import MicroChip from '@assets/microChip.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import PropTypes from 'prop-types';


function PetProfile({ petData }) {

    const { updatePetData } = useContext(ClientsContext);
    const navigate = useNavigate();
    const individualPetData = petData;
    console.log(individualPetData);


    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        petName: individualPetData?.petName || '',
        owner: individualPetData?.ownerName || '',
        birthDate: individualPetData?.birthDate || '',
        hc: individualPetData?.hc || '',
        microchip: individualPetData?.microchip || '',
        species: individualPetData?.species || '',
        breed: individualPetData?.breed || '',
        sex: individualPetData?.sex || '',
        esterilized: individualPetData?.esterilized || '',
    });

    // Validación de los campos
    function validateForm() {
        const newErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.petName || formData.petName.length < 3) {
            newErrors.petName = 'El nombre del mascote debe tener al menos 3 caracteres';
        }
        if (!formData.birthDate) {
            newErrors.birthDate = 'Introduzca una fecha de nacimiento válida';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };

    function updateData() {
        if (!validateForm()) {
            return;
        }

        const updatedPetInfo = {
            ...individualPetData,
            petName: formData.petName,
            birthDate: formData.birthDate,
            microchip: formData.microchip,
            species: formData.species,
            breed: formData.breed,
            sex: formData.sex,
            esterilized: formData.esterilized,
        };

        updatePetData(individualPetData.id, updatedPetInfo);
        navigate(`/pets`);
    }

    const formFields = [
        {
            label: 'Propietario',
            id: 'owner',
            type: 'text',
            value: formData.owner,
            icon: RoleUserIcon,
            required: true,
            disabled: true
        },
        {
            label: 'Nombre',
            id: 'petName',
            type: 'text',
            value: formData.petName,
            icon: PawIcon,
            required: true,
            disabled: false
        },
        {
            label: 'Fecha de nacimiento:',
            id: 'birthDate',
            type: 'date',
            value: formData.birthDate,
            icon: CakeIcon,
            disabled: false
        },
        {
            label: 'Numero de historia',
            id: 'hc',
            type: 'text',
            value: formData.hc,
            icon: BookIcon,
            disabled: true,
        },
        {
            label: 'Numero de microchip',
            id: 'microchip',
            type: 'text',
            value: formData.microChip,
            icon: MicroChip,
            disabled: false
        },
        {
            label: 'Especie',
            id: 'species',
            type: 'select',
            value: formData.species,
            options: ['CANINO', 'FELINO', 'CONEJO', 'HAMSTER', 'ERIZO', 'EXOTICO']
        },
        {
            label: 'Raza',
            id: 'breed',
            type: 'select',
            options: ['CRUCE', 'BULLDOG INGLES', 'CHIHUAHUA', 'COCKER SPANIEL', 'COLLIE', 'BOXER']
        },
        {
            label: 'Sexo',
            id: 'sex',
            type: 'select',
            options: ['MACHO', 'HEMBRA']
        },
        {
            label: '¿Ha sido esterilizado?',
            id: 'esterilized',
            type: 'select',
            options: ['SI', 'NO']
        },
    ];



    return (
        <div className="flex flex-col w-full justify-between ">
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4 mt-4 mb-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-600 mb-1">{field.label}</label>
                            <div className="flex items-center ">
                                {field.icon &&
                                    <div className={`flex items-center justify-center bg-gray-100 px-3 py-3.5 rounded-l-lg `}>
                                        <field.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                }

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors[field.id] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus-within:border-blue-300'} `}
                                        onChange={handleChange}
                                        value={formData[field.id]}// aseguramos que el valor predeterminado sea el que tiene la mascota
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
                                        className={`border rounded-r-lg p-3  w-full focus:outline-none ${errors[field.id] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus-within:border-blue-300'}`}
                                    />
                                )}
                            </div>
                            {errors[field.id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                onSubmit={updateData}
                submitText="GUARDAR CAMBIOS"
            />
        </div >

    );
}

export { PetProfile };

PetProfile.propTypes = {
    petData: PropTypes.object
}