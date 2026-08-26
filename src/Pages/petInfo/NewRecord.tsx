import { useState, ChangeEvent, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { useToast } from '@context/ToastContext';
import { ConsultationRecord } from '@t/client.types';
import { RecordForm } from '@components/forms/RecordForm';

function NewRecord() {
    const { addRecord } = useClients();
    const { toast } = useToast();
    const { id: petId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Omit<ConsultationRecord, "id" | "type" | "createdBy">>({
        dateTime: '',
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

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    async function saveRecord() {
        if (!petId) return;
        const newRecord: ConsultationRecord = {
            id: '',
            type : 'consultation',
            createdBy: '',
            ...formData,
        };
        setIsSubmitting(true);
        try {
            await addRecord(petId, newRecord);
            toast.success('Registro clinico guardado correctamente.');
            navigate(`/pets/pet/${petId}/clinical-records`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo guardar el registro.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

        if (!petId) {
        console.error("No se encontró el ID de la mascota para crear el registro.");
        return;
    }

    return (
        <div className="w-full max-w-[1300px] mx-auto border border-slate-200 rounded-2xl bg-paper shadow-sm">
            <div className="flex items-center justify-start p-5 border-b border-slate-100">
                <h2 className="text-lg font-semibold font-display text-ink">Nueva Ficha de Consulta</h2>
            </div>
            <RecordForm
                formData={formData}
                handleChange={handleChange}
                onSubmit={saveRecord}
                submitText={isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                disabled={isSubmitting}
            />
        </div>
    );
}

export { NewRecord };