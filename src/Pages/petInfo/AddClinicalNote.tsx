import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { useGlobal } from '@context/GlobalContext';
import { NoteRecord } from '@t/client.types';
import { NoteForm } from '@components/forms/NoteForm';
import { generateUniqueId } from '@utils/idGenerator';

function AddClinicalNote() {
    const { addRecord } = useClients();
    const { activeUser } = useGlobal();
    const { id: petId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [notes, setNotes] = useState<string>("");

    const now = new Date();
    const dateTime = now.toLocaleString();

    function addNote() {
        if (notes.trim() === '') {
        return;
        }

        const newNote: NoteRecord  = {
            id: generateUniqueId(),
            type: 'note',
            dateTime: now.toLocaleString(),
            content: notes,
            createdBy: `${activeUser?.name} ${activeUser?.lastName}`,
        };
        if (petId) {
            addRecord(petId, newNote);
            navigate(-1);
        }
        }

    return (
        <NoteForm
            notes={notes}
            dateTime={dateTime}
            handleChange={(e) => setNotes(e.target.value)}
            onSubmit={addNote}
        />
    )
}

export { AddClinicalNote };