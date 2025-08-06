import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';

interface GroomingQueueMenuProps {
    onClose: () => void;
}

export function GroomingQueueMenu({ onClose }: GroomingQueueMenuProps) {
    const { petsInQueueGrooming } = useClients();
    const navigate = useNavigate();

    function handleItemClick (petId: string) {
        navigate(`/pets/pet/${petId}/update`);
        onClose();
    }

    function handleGoToGroomingClick() {
        navigate('/grooming');
        onClose();
    };

    return (
        <div className="absolute top-20 md:top-14 right-6 md:right-20 bg-white shadow-lg rounded-lg w-64 z-20 max-h-80">
            {/* Contenedor con scroll solo para los pacientes */}
            <div className="max-h-64 overflow-y-auto">
                <ul>
                    {petsInQueueGrooming.map((pet) => (
                        <li
                            key={pet.id}
                            className="p-3 border-b flex items-center hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleItemClick(pet.petData.id)}
                        >
                            <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp"
                                alt="PetImage"
                                className="w-10 h-10 rounded-lg"
                            />
                            <div className='ml-2 gap-2'>
                                <span className="text-blue-500">{pet?.petData?.petName}</span>
                                <span className="block text-gray-500 text-xs">{pet?.timeOfAttention}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Opción fija al final, sin afectar el scroll */}
            <li className='p-3 hover:bg-gray-50 border-t'>
                <Link
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={handleGoToGroomingClick}
                    to="/grooming">
                    Ir a la Peluquería
                </Link>
            </li>
        </div>
    )
}