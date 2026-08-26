import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { useToast } from '@context/ToastContext';
import { RecordForm } from '@components/forms/RecordForm';
import { ConsultationRecord } from '@t/client.types';
import { NotFound } from '@components/ui/NotFound';

interface FormDataState  {
    reason: string;
    dateTime: string;
    anamnesis: string;
    physiologicalConstants: {
        temperature: string;
        heartRate: string;
        weight: string;
        oxygenSaturation: string;
    };
    clinicalExam: string;
}

function EditRecord() {
    const { updateRecord, petsData } = useClients();
    const { toast } = useToast();
    const { id: petId, recordId } = useParams<{ id: string, recordId: string }>();
    const navigate = useNavigate();

    const pet = petsData.find(pet => pet.id === petId);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //buscamos el registro por id
    const recordData: ConsultationRecord | undefined = pet?.records
        ?.find(record => record.id === recordId && "reason" in record) as ConsultationRecord | undefined;

    const [formData, setFormData] = useState<FormDataState | null>(null);

    useEffect(() => {
        if (recordData) {
        setFormData({
            reason: recordData.reason || '',
            dateTime: recordData.dateTime || '',
            anamnesis: recordData.anamnesis || '',
            physiologicalConstants: recordData.physiologicalConstants || { temperature: '', heartRate: '', weight: '', oxygenSaturation: '' },
            clinicalExam: recordData.clinicalExam || '',
        });
        }
    }, [recordData]);



    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { id, value } = e.target;

        if (formData && id in formData.physiologicalConstants) {
            setFormData(prev => ({
                ...prev!, // Usamos '!' porque sabemos que no es null si la condición de arriba es cierta
                physiologicalConstants: {
                    ...prev!.physiologicalConstants,
                    [id]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev!,
                [id as keyof Omit<FormDataState, 'physiologicalConstants'>]: value,
            }));
        }
    }

    async function saveRecord() {
        if (!formData || !recordData || !petId || !recordId) {
            console.error("No se pueden guardar los cambios");
            return;
        }

        const updatedRecord: ConsultationRecord = {
            ...recordData,
            ...formData,
        };
        setIsSubmitting(true);
        try {
            await updateRecord(petId, recordId, updatedRecord);
            toast.success('Registro clinico actualizado correctamente.');
            navigate(`/pets/pet/${petId}/clinical-records`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo actualizar el registro.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!recordData) {
        return (
        <NotFound
            entityName="Registro Clínico"
            searchId={recordId!}
            returnPath={`/pets/pet/${petId}/clinical-records`}
        />
        );
    }

    if (!formData) {
        // si initialRecord ya se encontro pero el useEffect auun no ha corrido.
        return <div className="p-6 text-center">Cargando datos del registro...</div>;
    }

    return (
        <div className="w-full max-w-[1300px] mx-auto border border-slate-200 rounded-2xl bg-paper shadow-sm">
            <div className="flex items-center justify-start p-5 border-b border-slate-100">
                <h2 className="text-lg font-semibold font-display text-ink">
                    Editar ficha de consulta
                </h2>
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

export { EditRecord };