import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { GlobalContext } from '@context/GlobalContext';
import { NoteForm } from '@components/forms/NoteForm';
import { generateUniqueId } from '@utils/idGenerator';

function AddClinicalNote() {
    const now = new Date();
    const currentDate = now.toLocaleDateString(); //  "22/05/2023"
    const currentTime = now.toLocaleTimeString(); //  "07:43 PM"
    const dateTime = `${currentDate} ${currentTime}`;

    const { addRecord } = useContext(ClientsContext);
    const { activeUser } = useContext(GlobalContext);
    const { id } = useParams();

    const navigate = useNavigate();

    const [notes, setNotes] = useState("");

    function addNote() {
        const recordId = generateUniqueId();
        const newNote = {
            dateTime: `${currentDate} ${currentTime}`,
            type: 'note',
            content: notes,
            id: recordId,
            createdBy: `${activeUser.name} ${activeUser.lastName}`,
        };
        addRecord(id, newNote);
        navigate(-1);
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