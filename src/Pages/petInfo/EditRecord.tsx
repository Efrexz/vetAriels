import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
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
};

function EditRecord() {
    const { updateRecord, petsData } = useClients();
    const { id: petId, recordId } = useParams<{ id: string, recordId: string }>();
    const navigate = useNavigate();

    const pet = petsData.find(pet => pet.id === petId)

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
    };

    function saveRecord() {
        if (!formData || !recordData) {
            console.error("No se pueden guardar los cambios");
            return;
        }
        
        const updatedRecord: ConsultationRecord = {
            ...recordData,
            ...formData,
        };
        if (formData && petId && recordId) {
            updateRecord(petId, recordId, updatedRecord);
            navigate(`/pets/pet/${petId}/clinical-records`);
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
        <div className="w-full max-w-[1300px] mx-auto border border-gray-200 rounded-lg">
            <h2 className="text-lg font-bold text-gray-600 p-4 border-b border-gray-200 bg-gray-50">
                Editar ficha de consulta
            </h2>
            <RecordForm
                formData={formData}
                handleChange={handleChange}
                onSubmit={saveRecord}
                submitText="GUARDAR CAMBIOS"
            />
        </div>
    );
}

export { EditRecord };