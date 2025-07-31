import { useState, useEffect, ChangeEvent, FormEvent  } from 'react';
import { useNavigate } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { ActionButtons } from '@components/ui/ActionButtons';
import CakeIcon from '@assets/cakeIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';
import BookIcon from '@assets/bookIcon.svg?react';
import MicroChip from '@assets/microChip.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import { Pet } from '@t/client.types';

interface PetProfileProps {
    petData: Pet;
}

//omitimos que no aparecen en el formulario o no editamos. Aunque dejo igual el hc y el owner para que se vea en el formulario aunque no se pueda editar
type FormDataType = Omit<Pet, 'id' | 'ownerId' | 'ownerName' | 'records' | 'active' | 'registrationDate' | 'registrationTime'>


function PetProfile({ petData }: PetProfileProps) {
    const { updatePetData } = useClients()
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormDataType>({
        petName: petData.petName || '',
        owner: petData.ownerName || '',
        hc: petData.hc || '',
        birthDate: petData.birthDate || '',
        microchip: petData.microchip || '',
        species: petData.species || 'CANINO',
        breed: petData.breed || 'CRUCE',
        sex: petData.sex || 'MACHO',
        esterilized: petData.esterilized ? 'SI' : 'NO',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    //Para solucionar el problema de que no se actualiza el formulario al cambiar de mascota
    useEffect(() => {
        setFormData({
            petName: petData.petName || '',
            owner: petData.ownerName || '',
            hc: petData.hc || '',
            birthDate: petData.birthDate || '',
            microchip: petData.microchip || '',
            species: petData.species || 'CANINO',
            breed: petData.breed || 'CRUCE',
            sex: petData.sex || 'MACHO',
            esterilized: petData.esterilized ? 'SI' : 'NO',
        });
        setErrors({});
    }, [petData]);

    function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Validación de los campos
    function validateForm(){
        const newErrors: Record<string, string> = {};
        if (!formData.petName || formData.petName.length < 3) {
            newErrors.petName = 'El nombre de la mascota debe tener al menos 3 caracteres';
        }
        if (!formData.birthDate) {
            newErrors.birthDate = 'Introduzca una fecha de nacimiento válida';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function updateData() {
        // Validar el formulario antes de enviar
        if (!validateForm()) {
            return;
        }

        const updatedPetInfo: Partial<Pet> = {
            petName: formData.petName,
            birthDate: formData.birthDate,
            microchip: formData.microchip,
            species: formData.species,
            breed: formData.breed,
            sex: formData.sex,
            esterilized: formData.esterilized ? 'SI' : 'NO',
        };

        updatePetData(petData.id, updatedPetInfo);
        navigate(`/pets`);
    }

    const formFields = [
        {
            label: 'Propietario',
            id: 'owner',
            type: 'text',
            icon: RoleUserIcon,
            required: true,
            disabled: true
        },
        {
            label: 'Nombre',
            id: 'petName',
            type: 'text',
            icon: PawIcon,
            required: true,
            disabled: false
        },
        {
            label: 'Fecha de nacimiento:',
            id: 'birthDate',
            type: 'date',
            icon: CakeIcon,
            disabled: false
        },
        {
            label: 'Numero de historia',
            id: 'hc',
            type: 'text',
            icon: BookIcon,
            disabled: true,
        },
        {
            label: 'Numero de microchip',
            id: 'microchip',
            type: 'text',
            icon: MicroChip,
            disabled: false
        },
        {
            label: 'Especie',
            id: 'species',
            type: 'select',
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
            <div className="flex-grow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label htmlFor={field.id} className="block text-gray-600 mb-1 font-medium">{field.label}</label>
                            <div className="flex items-center ">
                                {field.icon &&
                                    <div className={`flex items-center justify-center bg-gray-100 px-3 py-3.5 rounded-l-lg `}>
                                        <field.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                }

                                {field.type === 'select' && field.options? (
                                    <select
                                        id={field.id}
                                        onChange={handleChange}
                                        value={formData[field.id as keyof FormDataType]}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors[field.id] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus-within:border-blue-300'} `}
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
                                        value={formData[field.id as keyof FormDataType]}
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
