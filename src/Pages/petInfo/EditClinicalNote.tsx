import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { NoteRecord, Pet } from '@t/client.types';
import { NoteForm } from '@components/forms/NoteForm';
import { NotFound } from '@components/ui/NotFound';

function EditClinicalNote() {

    const { updateRecord, petsData } = useClients();
    const { id, recordId } = useParams<{ id: string; recordId: string }>();
    const navigate = useNavigate();

    const petData: Pet | undefined = petsData.find(pet => pet.id === id);
    //filtramos los registros de tipo note y buscamos el registro por id
    const noteData: NoteRecord | undefined = petData?.records
        ?.find(record => record.id === recordId && record.type === 'note') as NoteRecord | undefined;

    const [notes, setNotes] = useState<string>("");

    useEffect(() => {
        if (noteData) {
            setNotes(noteData.content || "");
        }
    }, [noteData]);


    function editNote() {
        //para asegurarnos que la nota existe y evitar el error que no podia agregar NoteRecord al updateNote
        if (!noteData) {
            console.error("No se encontró la nota para editar.");
            return;
        }

        const updatedNote: NoteRecord  = {
            ...noteData,
            content: notes.trim(),
        };
        if (id && recordId){
            updateRecord(id, recordId, updatedNote);
            navigate(-1);
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
        />
    )
}

export { EditClinicalNote };