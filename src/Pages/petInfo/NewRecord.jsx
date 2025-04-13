import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RecordForm } from '@components/RecordForm';
import { ClientsContext } from '@context/ClientsContext';
import { GlobalContext } from '@context/GlobalContext';
import XIcon from '@assets/xIcon.svg?react';


function NewRecord() {
    const { addRecord } = useContext(ClientsContext);
    const { activeUser } = useContext(GlobalContext);

    const { id } = useParams();


    const navigate = useNavigate();
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();

    const [formData, setFormData] = useState({
        dateTime: `${currentDate} ${currentTime}`,
        reason: 'Consulta',
        anamnesis: '',
        physiologicalConstants: {
            temperature: '-',
            heartRate: '-',
            weight: '-',
            oxygenSaturation: '-',
        },
        clinicalExam: '',
        createdBy: `${activeUser.name} ${activeUser.lastName}`,
    });

    function handleChange(e) {
        const { id, value } = e.target;
        // Si el input pertenece a las constantes fisiológicas
        if (Object.keys(formData.physiologicalConstants).includes(id)) {
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
        const recordId = Date.now();
        const newRecord = {
            ...formData,
            id: recordId,
        }
        addRecord(newRecord, id);
        navigate('/pets/pet/' + id + '/clinical-records');
    }

    return (
        <div className="w-full max-w-[1300px] mx-auto border border-gray-200 rounded-lg">
            <div className="flex tems-center justify-start p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-600">Nueva Ficha de Consulta</h2>
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