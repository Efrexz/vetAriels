import { useState, ChangeEvent, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext'; // PASO 1: Usar hooks personalizados
import { useGlobal } from '@context/GlobalContext';
import { ConsultationRecord } from '@t/client.types';
import { RecordForm } from '@components/forms/RecordForm';
import { generateUniqueId } from '@utils/idGenerator';

function NewRecord() {
    const { addRecord } = useClients();
    const { activeUser } = useGlobal();
    const { id: petId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const now = new Date();

    const [formData, setFormData] = useState<Omit<ConsultationRecord, "id" | "type" | "createdBy">>({
        dateTime: now.toLocaleString(),
        reason: 'Consulta',
        anamnesis: '',
        physiologicalConstants: {
            temperature: '',
            heartRate: '',
            weight: '',
            oxygenSaturation: '',
        },
        clinicalExam: '',
    });

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { id, value } = e.target;
        // Si el input pertenece a las constantes fisiológicas
        if (id in formData.physiologicalConstants) {
            setFormData((prev) => ({
                ...prev,
                physiologicalConstants: {
                    ...prev.physiologicalConstants,
                    [id]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    }

    function saveRecord() {
        const newRecord: ConsultationRecord = {
            id: generateUniqueId(),
            //deberia estar siempre activeUser porque si no lo redirige al login
            createdBy: `${activeUser?.name} ${activeUser?.lastName}`,
            type : 'consultation',
            ...formData,
        }
        if (petId) {
            addRecord(petId, newRecord);
            navigate(`/pets/pet/${petId}/clinical-records`);
        }
    }

        if (!petId) {
        console.error("No se encontró el ID de la mascota para crear el registro.");
        return;
    }

    return (
        <div className="w-full max-w-[1300px] mx-auto border border-gray-700 rounded-lg bg-gray-800">
            <div className="flex items-center justify-start p-4 border-b border-gray-700 bg-gray-900">
                <h2 className="text-lg font-bold text-cyan-500">Nueva Ficha de Consulta</h2>
            </div>
            <RecordForm
                formData={formData}
                handleChange={handleChange}
                onSubmit={saveRecord}
                submitText="GUARDAR CAMBIOS"
            />
        </div>
    );
}

export { NewRecord };