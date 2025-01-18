import { useContext, useState } from 'react';
import { ActionButtons } from '@components/ActionButtons';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import XIcon from '@assets/xIcon.svg?react';
import CalendarIcon from '@assets/calendarIcon.svg?react';

function NewRecord() {
    const { addRecord } = useContext(ClientsContext); // Contexto para guardar los datos
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
        addRecord(formData, id);
        navigate('/pets/pet/' + id + '/clinical-records');
    }

    return (
        <div className="w-full max-w-[1300px] mx-auto border border-gray-200 rounded-lg">
            <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-600">Nueva Ficha de Consulta</h2>
                <button className="p-2 text-black hover:text-gray-700 bg-white rounded-lg" aria-label="Cerrar">
                    <XIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-8 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="dateTime">
                            Fecha y hora de registro
                        </label>
                        <div className="flex w-full border rounded-lg overflow-hidden border-gray-200 hover:border-blue-300 focus-within:border-blue-300">
                            <div className="flex items-center justify-center bg-gray-100 px-3">
                                <CalendarIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <input
                                type="text"
                                id="dateTime"
                                disabled
                                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-r-lg focus:outline-none"
                                value={formData.dateTime}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium mb-2">
                            Motivo de atención
                        </label>
                        <input
                            id="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
                        />
                    </div>
                </div>

                <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
                    <label htmlFor="anamnesis" className="text-sm font-medium">
                        Anamnesis y descripción del caso
                    </label>
                    <textarea
                        id="anamnesis"
                        value={formData.anamnesis}
                        onChange={handleChange}
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
                    />
                </div>

                <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
                    <label className="text-sm font-medium">Constantes fisiológicas</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["temperature", "heartRate", "weight", "oxygenSaturation"].map((constant) => (
                            <div key={constant}>
                                <input
                                    id={constant}
                                    placeholder={constant}
                                    value={formData.physiologicalConstants[constant]}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <label htmlFor="clinicalExam" className="text-sm font-medium">
                            Examen clínico
                        </label>
                    </div>
                    <textarea
                        id="clinicalExam"
                        value={formData.clinicalExam}
                        onChange={handleChange}
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
                    />
                </div>
            </div>

            <ActionButtons
                submitText="GUARDAR CAMBIOS"
                onCancel={() => navigate(-1)}
                onSubmit={saveRecord}
            />
        </div>
    );
}

export { NewRecord };