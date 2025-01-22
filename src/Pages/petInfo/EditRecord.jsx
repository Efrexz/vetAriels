import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RecordForm } from '@components/RecordForm';
import { ClientsContext } from '@context/ClientsContext';
import XIcon from '@assets/xIcon.svg?react';


function EditRecord() {
    const { updateRecord, petsData } = useContext(ClientsContext);
    const { id, recordId } = useParams();

    //buscamos la mascota por id y destructuramos los registros
    const { records } = petsData.find(pet => pet.id === id);
    //buscamos el registro por id
    const record = records.find(record => record.id === Number(recordId));

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        dateTime: record.dateTime || "",
        reason: record.reason || "",
        anamnesis: record.anamnesis || "",
        physiologicalConstants: record.physiologicalConstants || "",
        clinicalExam: record.clinicalExam || "",
        id: record.id,
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
        updateRecord(formData, id, Number(recordId));
        navigate('/pets/pet/' + id + '/clinical-records');
    }

    return (
        <div className="w-full max-w-[1300px] mx-auto border border-gray-200 rounded-lg">
            <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-600">Editar ficha de consulta</h2>
                <button className="p-2 text-black hover:text-gray-700 bg-white rounded-lg" aria-label="Cerrar">
                    <XIcon className="w-4 h-4" />
                </button>
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

export { EditRecord };