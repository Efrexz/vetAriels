import { useContext, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { ClientsContext } from '@context/ClientsContext';
import { ActionButtons } from '@components/ui/ActionButtons';
import { ClientSearchInput } from '@components/search/ClientSearchInput';
import PawIcon from '@assets/pawIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import CakeIcon from '@assets/cakeIcon.svg?react';
import BookIcon from '@assets/bookIcon.svg?react';
import MicrochipIcon from '@assets/microChip.svg?react';


function CreatePetForm() {
    const navigate = useNavigate();
    const { clients, addPet, historyCounter } = useContext(ClientsContext);
    const { id } = useParams();


    const individualClientData = clients.find(client => client.id === Number(id));
    const [errors, setErrors] = useState({});


    const [formData, setFormData] = useState({
        owner: id !== "no_client" ? individualClientData?.firstName + " " + individualClientData?.lastName : "", //si nuestra url dice que no es un cliente, entonces no se debe mostrar por defecto el propietario
        petName: '',
        birthDate: '',
        hc: historyCounter, //TODO - Generar por los momentos un hc segun el largo de la lista de mascotas
        microchip: '',
        species: '',
        breed: '',
        sex: '',
        esterilized: '',
    });

    // Validación de los campos
    function validateForm() {
        const newErrors = {};
        //Validamos si todos los campos son válidos
        if (id === 'no_client') {
            newErrors.owner = 'Debe seleccionar un propietario';
        }
        if (!formData.petName || formData.petName.length < 3) {
            newErrors.petName = 'El nombre del mascote debe tener al menos 3 caracteres';
        }
        if (!formData.birthDate) {
            newErrors.birthDate = 'Introduzca una fecha de nacimiento válida';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function handleChange(e) {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    }

    function createNewPet() {
        if (!validateForm()) {
            return;
        }
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newPet = {
            owner: formData.owner,
            registrationDate: currentDate,
            registrationTime: currentTime,
            petName: formData.petName,
            birthDate: formData.birthDate,
            hc: formData.hc,
            microchip: formData.microchip,
            species: formData.species || "CANINO",
            breed: formData.breed || "CRUCE",
            sex: formData.sex || "MACHO",
            active: true,
            esterilized: formData.esterilized || "NO",
        };

        addPet(newPet, Number(id), formData.owner);
        navigate(`/pets`);
    }


    const formFields = [
        {
            label: 'Nombre de la mascota *',
            id: 'petName',
            type: 'text',
            icon: PawIcon,
            required: true,
            disabled: id !== "no_client" ? false : true,
        },
        {
            label: 'Fecha de nacimiento',
            id: 'birthDate',
            icon: CakeIcon,
            type: 'date',
            disabled: id !== "no_client" ? false : true,
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
            disabled: id !== "no_client" ? false : true
        },
        {
            label: 'Especie',
            id: 'species',
            type: 'select',
            options: ['CANINO', 'FELINO', 'CONEJO', 'HAMSTER', 'ERIZO', 'EXOTICO'],
            disabled: id !== "no_client" ? false : true
        },
        {
            label: 'Raza',
            id: 'breed',
            type: 'select',
            options: ['CRUCE', 'BULLDOG INGLES', 'CHIHUAHUA', 'COCKER SPANIEL', 'COLLIE', 'BOXER'],
            disabled: id !== "no_client" ? false : true
        },
        {
            label: 'Sexo',
            id: 'sex',
            type: 'select',
            options: ['MACHO', 'HEMBRA'],
            disabled: id !== "no_client" ? false : true
        },
        {
            label: '¿Ha sido esterilizado?',
            id: 'esterilized',
            type: 'select',
            options: ['SI', 'NO'],
            disabled: id !== "no_client" ? false : true
        },

    ];

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-xl md:text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <PawIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                Mascotas
            </h1>
            <div className="bg-white p-4 pb-10 rounded-t-lg shadow-lg">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Propietario*</label>
                        <div
                            className={`flex w-full border-gray-200 border rounded-md ${errors["owner"] ? "border-red-500" : "hover:border-blue-300 focus-within:border-blue-300"}`}
                        >
                            <div className="flex items-center justify-center bg-gray-100 px-3">
                                <RoleUserIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <ClientSearchInput mode={"pets"} />
                        </div>
                        {errors["owner"] && (
                            <p className="text-red-500 text-sm mt-1">{errors["owner"]}</p>
                        )}
                    </div>

                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full border-gray-200 border rounded-md overflow-hidden ${errors[field.id] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus-within:border-blue-300'}`}>
                                {field.icon &&
                                    <div className="flex items-center justify-center bg-gray-100 px-3">
                                        <field.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                }

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border-none focus:outline-none focus:ring-0"
                                        disabled={field.disabled}
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
                            {errors[field.id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}
                </form>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                onSubmit={createNewPet}
                submitText="CREAR NUEVA MASCOTA"
            />
        </section>
    )
}

export { CreatePetForm }