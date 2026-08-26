import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { useToast } from '@context/ToastContext';
import { NoteRecord } from '@t/client.types';
import { NoteForm } from '@components/forms/NoteForm';

function AddClinicalNote() {
    const { addRecord } = useClients();
    const { toast } = useToast();
    const { id: petId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [notes, setNotes] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function addNote() {
        if (notes.trim() === '') {
            setError('La nota no puede estar vacía');
            return;
        }
        if (!petId) return;

        const newNote: NoteRecord = {
            id: '',
            type: 'note',
            dateTime: '',
            content: notes,
            createdBy: '',
        };
        setIsSubmitting(true);
        try {
            await addRecord(petId, newNote);
            toast.success('Nota clinica guardada correctamente.');
            navigate(-1);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo guardar la nota.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <NoteForm
            notes={notes}
            dateTime={new Date().toLocaleString()}
            handleChange={(e) => { setNotes(e.target.value); setError(''); }}
            onSubmit={addNote}
            error={error}
            submitText={isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            disabled={isSubmitting}
        />
    )
}

export { AddClinicalNote };