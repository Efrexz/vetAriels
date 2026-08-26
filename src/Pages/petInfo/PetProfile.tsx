import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { useToast } from '@context/ToastContext';
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
    const { updatePetData } = useClients();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormDataType>({
        petName: '',
        owner: '',
        hc: '',
        birthDate: '',
        microchip:  '',
        species: petData.species || 'CANINO',
        breed: petData.breed || 'CRUCE',
        sex: petData.sex || 'MACHO',
        esterilized: petData.esterilized ? 'SI' : 'NO',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    //Para solucionar el problema de que no se actualiza el formulario al cambiar de mascota
    useEffect(() => {
        if (petData) {
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
        }
    }, [petData]);

    function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

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

    async function updateData() {
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

        setIsSubmitting(true);
        try {
            await updatePetData(petData.id, updatedPetInfo);
            toast.success('Mascota actualizada correctamente.');
            navigate(`/pets`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo actualizar la mascota.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
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
        <div className="flex flex-col w-full justify-between">
            <div className="flex-grow px-6 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-ink mb-1">{field.label}</label>
                            <div className={`flex w-full items-center rounded-lg overflow-hidden bg-white ${errors[field.id] ? 'border border-danger' : 'border border-slate-200 hover:border-primary focus-within:border-primary'}`}>
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-white px-3 py-2 rounded-l-lg border-r border-slate-200">
                                        <field.icon className="w-4 h-4 text-slate" />
                                    </div>
                                }

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        onChange={handleChange}
                                        value={formData[field.id as keyof FormDataType]}
                                        className="w-full px-4 py-2 text-sm border-none focus:outline-none focus:ring-0 bg-white text-ink"
                                    >
                                        {field.options?.map((option, i) => (
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
                                        className="w-full py-2 px-4 text-sm focus:outline-none focus:ring-0 bg-white text-ink"
                                    />
                                )}
                            </div>
                            {errors[field.id] && (
                                <p className="text-danger text-xs mt-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                onSubmit={updateData}
                submitText={isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                disabled={isSubmitting}
            />
        </div>
    );
}

export { PetProfile };
