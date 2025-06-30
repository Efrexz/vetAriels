import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { NoteForm } from '@components/forms/NoteForm';

function EditClinicalNote() {

    const { updateRecord, petsData } = useContext(ClientsContext);
    const { id, recordId } = useParams();
    //buscamos la mascota por id y destructuramos los registros
    const { records } = petsData.find(pet => pet.id === id);
    //filtramos los registros de tipo note y buscamos el registro por id
    const noteData = records.filter(record => record.type === "note").find(record => record.id === Number(recordId));
    const [notes, setNotes] = useState(noteData?.content || "");

    const navigate = useNavigate();

    function editNote() {
        const newNote = {
            ...noteData,
            content: notes,
        };
        updateRecord(newNote, id, Number(recordId));
        navigate(-1);
    }

    return (
        <NoteForm
            notes={notes}
            dateTime={noteData?.dateTime}
            handleChange={(e) => setNotes(e.target.value)}
            onSubmit={editNote}
        />
    )
}

export { EditClinicalNote };