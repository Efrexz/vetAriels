import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { Pet } from '@t/client.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import { ClientSearchInput } from '@components/search/ClientSearchInput';
import PawIcon from '@assets/pawIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import CakeIcon from '@assets/cakeIcon.svg?react';
import BookIcon from '@assets/bookIcon.svg?react';
import MicrochipIcon from '@assets/microChip.svg?react';

type FormDataState = Omit<Pet, 'id' | 'hc' | 'ownerId' | 'ownerName' | 'registrationDate' | 'registrationTime' | 'active' | 'records'> & {
    owner: string;
    esterilized: 'SI' | 'NO'
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

function CreatePetForm() {
    const { clients, addPet, historyCounter } = useClients();
    const { id: ownerId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [errors, setErrors] = useState<FormErrors>({});

    const individualClientData = ownerId !== 'no_client'
        ? clients.find(client => client.id === ownerId)
        : undefined;

    const [formData, setFormData] = useState<FormDataState>({
        owner: individualClientData ? `${individualClientData.firstName} ${individualClientData.lastName}` : "",
        petName: '',
        birthDate: '',
        microchip: '',
        species: 'CANINO',
        breed: 'CRUCE',
        sex: 'MACHO',
        esterilized: 'NO',
    });

    useEffect(() => {
        const client = clients.find(client => client.id === ownerId);
        setFormData(prev => ({
            ...prev,
            owner: client ? `${client.firstName} ${client.lastName}` : ""
        }));
    }, [ownerId, clients]);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id as keyof FormDataState]: value }));
    }

    // Validación de los campos
    function validateForm() {
        const newErrors: FormErrors = {};
        //Validamos si todos los campos son válidos
        if (ownerId === 'no_client' || !formData.owner) {
            newErrors.owner = 'Debe seleccionar un propietario';
        }
        if (!formData.petName || formData.petName.trim().length < 3) {
            newErrors.petName = 'El nombre del mascota debe tener al menos 3 caracteres';
        }
        if (!formData.birthDate) {
            newErrors.birthDate = 'Introduzca una fecha de nacimiento válida';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function createNewPet() {
        if (!validateForm()) {
            return;
        }

        const now = new Date();
        const newPetDataForAdd:  Omit<Pet, 'id' | 'hc' | 'ownerId' | 'ownerName' | 'owner'> = {
            registrationDate: now.toLocaleDateString(),
            registrationTime: now.toLocaleTimeString(),
            petName: formData.petName,
            birthDate: formData.birthDate,
            microchip: formData.microchip,
            species: formData.species,
            breed: formData.breed,
            sex: formData.sex,
            active: true,
            esterilized: formData.esterilized,
            records: [],
        };
        if (ownerId){
            addPet(newPetDataForAdd, ownerId, formData.owner);
            navigate(`/pets`);
        }
    }

    const formFields = [
        {
            label: 'Nombre de la mascota *',
            id: 'petName',
            type: 'text',
            icon: PawIcon,
            required: true,
            disabled: ownerId !== "no_client" ? false : true,
        },
        {
            label: 'Fecha de nacimiento',
            id: 'birthDate',
            icon: CakeIcon,
            type: 'date',
            disabled: ownerId !== "no_client" ? false : true,
        },
        {
            label: 'N° de historia',
            id: 'hc',
            icon: BookIcon,
            type: 'text',
            disabled: true
        },
        {
            label: 'Número de microchip',
            id: 'microchip',
            icon: MicrochipIcon,
            type: 'text',
            disabled: ownerId !== "no_client" ? false : true
        },
        {
            label: 'Especie',
            id: 'species',
            type: 'select',
            options: ['CANINO', 'FELINO', 'CONEJO', 'HAMSTER', 'ERIZO', 'EXOTICO'],
            disabled: ownerId !== "no_client" ? false : true
        },
        {
            label: 'Raza',
            id: 'breed',
            type: 'select',
            options: ['CRUCE', 'BULLDOG INGLES', 'CHIHUAHUA', 'COCKER SPANIEL', 'COLLIE', 'BOXER'],
            disabled: ownerId !== "no_client" ? false : true
        },
        {
            label: 'Sexo',
            id: 'sex',
            type: 'select',
            options: ['MACHO', 'HEMBRA'],
            disabled: ownerId !== "no_client" ? false : true
        },
        {
            label: '¿Ha sido esterilizado?',
            id: 'esterilized',
            type: 'select',
            options: ['SI', 'NO'],
            disabled: ownerId !== "no_client" ? false : true
        },

    ];

    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Nuevo registro
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Crear mascota
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Propietario*</label>
                        <div
                            className={`flex w-full rounded-lg ${errors["owner"] ? "border border-danger" : "border border-slate-200 hover:border-primary focus-within:border-primary"}`}
                        >
                            <div className="flex items-center justify-center bg-white px-3 border-r border-slate-200">
                                <RoleUserIcon className="w-5 h-5 text-slate" />
                            </div>
                            <ClientSearchInput mode={"pets"} />
                        </div>
                        {errors["owner"] && (
                            <p className="text-danger text-xs mt-1">{errors["owner"]}</p>
                        )}
                    </div>

                    {formFields.map((field) => (
                        <div key={field.label}>
                            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full rounded-lg overflow-hidden ${errors[field.id as keyof FormDataState] ? 'border border-danger' : 'border border-slate-200 hover:border-primary focus-within:border-primary'}`}>
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-white px-3 py-1.5 rounded-l-lg border-r border-slate-200">
                                        <field.icon className="w-5 h-5 text-slate" />
                                    </div>
                                }

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        onChange={handleChange}
                                        className={`w-full bg-white px-4 py-2 border-none focus:outline-none focus:ring-0 ${field.disabled ? 'bg-slate-50 cursor-not-allowed text-slate' : 'text-ink'}`}
                                        disabled={field.disabled}
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
                                        value={field.id === 'hc' ? historyCounter.current.toString() : (formData[field.id as keyof FormDataState] as string)}
                                        onChange={handleChange}
                                        disabled={field.disabled}
                                        className={`w-full bg-white px-4 py-2 focus:outline-none focus:ring-0 ${field.disabled ? 'bg-slate-50 cursor-not-allowed text-slate' : 'text-ink'}`}
                                    />
                                )}
                            </div>
                            {errors[field.id as keyof FormDataState] && (
                                <p className="text-danger text-xs mt-1">{errors[field.id as keyof FormDataState]}</p>
                            )}
                        </div>
                    ))}
                </form>
                <ActionButtons
                    onCancel={() => navigate(-1)}
                    onSubmit={createNewPet}
                    submitText="Crear mascota"
                />
            </div>
        </section>
    )
}

export { CreatePetForm }