import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { useToast } from '@context/ToastContext';
import { NoteRecord, Pet } from '@t/client.types';
import { NoteForm } from '@components/forms/NoteForm';
import { NotFound } from '@components/ui/NotFound';

function EditClinicalNote() {

    const { updateRecord, petsData } = useClients();
    const { toast } = useToast();
    const { id, recordId } = useParams<{ id: string; recordId: string }>();
    const navigate = useNavigate();

    const petData: Pet | undefined = petsData.find(pet => pet.id === id);
    //filtramos los registros de tipo note y buscamos el registro por id
    const noteData: NoteRecord | undefined = petData?.records
        ?.find(record => record.id === recordId && record.type === 'note') as NoteRecord | undefined;

    const [notes, setNotes] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (noteData) {
            setNotes(noteData.content || "");
        }
    }, [noteData]);


    async function editNote() {
        if (!noteData || !id || !recordId) {
            console.error("No se encontró la nota para editar.");
            return;
        }

        const updatedNote: NoteRecord  = {
            ...noteData,
            content: notes.trim(),
        };
        setIsSubmitting(true);
        try {
            await updateRecord(id, recordId, updatedNote);
            toast.success('Nota clinica actualizada correctamente.');
            navigate(-1);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo actualizar la nota.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!noteData) {
        return (
            <NotFound
                entityName="Nota Clínica"
                searchId={recordId!}
                returnPath={`/pets/pet/${id}/clinical-records`}
            />
        );
    }

    return (
        <NoteForm
            notes={notes}
            dateTime={noteData.dateTime}
            handleChange={(e) => setNotes(e.target.value)}
            onSubmit={editNote}
            submitText={isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            disabled={isSubmitting}
        />
    )
}

export { EditClinicalNote };