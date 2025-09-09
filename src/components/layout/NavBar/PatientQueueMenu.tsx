import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';

interface PatientQueueMenuProps {
    onClose: () => void;
}

export function PatientQueueMenu({ onClose }: PatientQueueMenuProps) {
    const { petsInQueueMedical } = useClients();
    const navigate = useNavigate();

    function handleItemClick (petId: string) {
        navigate(`/pets/pet/${petId}/update`);
        onClose();
    }

    function handleGoToClinicQueueClick() {
        navigate('/clinic-queue');
        onClose();
    };

    return (
        <div className="absolute top-16 right-4 md:right-20 bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-lg w-72 z-20 border border-gray-700/50 overflow-hidden flex flex-col max-h-[340px]">
            <div className="px-3 pt-3 pb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">En Espera Médica</h4>
            </div>

            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <ul>
                    {petsInQueueMedical.map((pet) => (
                        <li
                            key={pet.id}
                            className="px-3 py-2.5 border-t border-gray-700/50 flex items-start gap-3 hover:bg-cyan-500/10 cursor-pointer transition-colors group"
                            onClick={() => handleItemClick(pet.petData.id)}
                        >
                            <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp"
                                alt="PetImage"
                                className="w-10 h-10 rounded-lg object-cover mt-0.5"
                            />
                            <div>
                                <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{pet?.petData?.petName}</span>
                                <span className="block text-gray-400 text-xs">{pet?.timeOfAttention}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-3 bg-gray-900/50 border-t border-gray-700">
                <Link
                    className="text-cyan-400 hover:underline text-sm font-medium text-center block"
                    onClick={handleGoToClinicQueueClick}
                    to="/clinic-queue">
                    Gestionar Sala de Espera
                </Link>
            </div>
        </div>
    )
}