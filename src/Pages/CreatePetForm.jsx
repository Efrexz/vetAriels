import { useContext, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { ClientsContext } from '../context/ClientsContext';
import PawIcon from '../assets/pawIcon.svg?react';
import RoleUserIcon from '../assets/roleUserIcon.svg?react';
import PlusIcon from '../assets/plusIcon.svg?react';
import ReturnIcon from '../assets/returnIcon.svg?react';
import CakeIcon from '../assets/cakeIcon.svg?react';
import BookIcon from '../assets/bookIcon.svg?react';
import MicrochipIcon from '../assets/microChip.svg?react';


function CreatePetForm() {
    const navigate = useNavigate();
    const { clients, addPet, historyCounter } = useContext(ClientsContext);
    const { id } = useParams();

    const individualClientData = clients.find(client => client.id === Number(id));



    const [formData, setFormData] = useState({
        owner: id !== "no_client" ? individualClientData?.firstName + " " + individualClientData?.lastName : "", //si nuestra url dice que no es un cliente, entonces no se debe mostrar por defecto el propietario
        petName: '',
        birthDate: '',
        hc: historyCounter, //TODO - Generar por los momentos un hc segun el largo de la lista de mascotas
        microchip: '',
        species: '',
        breed: '',
        sex: '',
    });

    function handleChange(e) {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    }

    const createNewPet = () => {
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
        };

        addPet(newPet, Number(id), formData.owner);
        navigate(`/pets`);
    };


    const formFields = [
        {
            label: 'Propietario *',
            id: 'owner',
            type: 'text',
            icon: RoleUserIcon,
            required: true,
            disabled: id !== "no_client" ? true : false
        },
        {
            label: 'Nombre de la mascota *',
            id: 'petName',
            type: 'text',
            icon: PawIcon,
            required: true,
            disabled: false,
        },
        {
            label: 'Fecha de nacimiento',
            id: 'birthDate',
            icon: CakeIcon,
            type: 'text',
            disabled: false,
        },
        {
            label: 'N° de historia',
            id: 'hc',
            icon: BookIcon,
            type: 'text',
            disabled: id !== "no_client" ? true : false
        },
        {
            label: 'Número de microchip',
            id: 'microchip',
            icon: MicrochipIcon,
            type: 'text',
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
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <PawIcon className="w-9 h-9  mr-2" />
                Mascotas
            </h1>
            <div className="bg-white p-4 pb-10 rounded-t-lg shadow-lg">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
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
            </div>
            <div className='flex justify-between items-center bg-gray-100 py-3 px-4 shadow-lg rounded-b-lg'>
                <button
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                    onClick={() => navigate(-1)}
                >
                    <ReturnIcon className="w-5 h-5 text-gray-700" />
                    CANCELAR
                </button>
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                    onClick={createNewPet}
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    CREAR NUEVA MASCOTA
                </button>
            </div>
        </section>
    )
}

export { CreatePetForm }