import { ChangeEvent } from 'react';
import { ActionButtons } from '@components/ui/ActionButtons';
import { useNavigate } from 'react-router-dom';
import CalendarIcon from '@assets/calendarIcon.svg?react';
import { ConsultationRecord } from '@t/client.types';


interface RecordFormProps {
    formData: Omit<ConsultationRecord, "id" | "type" | "createdBy">;
    handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    submitText?: string;
}

function RecordForm({
    formData,
    handleChange,
    onSubmit,
    submitText
}: RecordFormProps) {
    const navigate = useNavigate();

const physiologicalConstantsPlaceholders = {
    temperature: "Temperatura (°C)",
    heartRate: "Frec. Cardíaca (lpm)",
    weight: "Peso (kg)",
    oxygenSaturation: "Saturación O₂ (%)"
};

return (
    <form>
        <div className="space-y-3 p-4 text-gray-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300" htmlFor="dateTime">
                        Fecha y hora de registro
                    </label>
                    <div className="flex w-full border rounded-lg overflow-hidden border-gray-600 focus-within:border-cyan-500">
                        <div className="flex items-center justify-center bg-gray-700 px-3">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="dateTime"
                            disabled
                            className="w-full pl-3 pr-10 py-1 bg-gray-700 focus:outline-none text-gray-200"
                            value={formData.dateTime}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-2 text-gray-300">
                        Motivo de atención
                    </label>
                    <input
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full px-3 py-1 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none text-gray-200 hover:border-cyan-500 focus:border-cyan-500"
                    />
                </div>
            </div>

            <div className="space-y-2 px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <label htmlFor="anamnesis" className="text-sm font-medium text-gray-300">
                    Anamnesis y descripción del caso
                </label>
                <textarea
                    id="anamnesis"
                    name="anamnesis"
                    value={formData.anamnesis}
                    onChange={handleChange}
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none text-gray-200 hover:border-cyan-500 focus:border-cyan-500"
                />
            </div>

            <div className="space-y-2 px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <label className="text-sm font-medium text-gray-300">Constantes fisiológicas</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(formData.physiologicalConstants).map((key) => (
                        <div key={key}>
                            <input
                                id={key}
                                name={`physiologicalConstants.${key}`}
                                type='text' // Usar text con pattern es más flexible que number para decimales y símbolos
                                pattern="[0-9.,]*"
                                placeholder={physiologicalConstantsPlaceholders[key as keyof typeof physiologicalConstantsPlaceholders]}
                                value={formData.physiologicalConstants[key as keyof typeof formData.physiologicalConstants]}
                                onChange={handleChange}
                                className="w-full px-3 py-1 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none text-gray-200 hover:border-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2 px-4 py-2 border border-gray-700 rounded-lg bg-gray-900">
                <label htmlFor="clinicalExam" className="text-sm font-medium text-gray-300">
                    Examen clínico
                </label>
                <textarea
                    id="clinicalExam"
                    name="clinicalExam"
                    value={formData.clinicalExam}
                    onChange={handleChange}
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none text-gray-200 hover:border-cyan-500 focus:border-cyan-500"
                />
            </div>
        </div>
        <ActionButtons
            submitText={submitText}
            onCancel={() => navigate(-1)}
            onSubmit={onSubmit}
        />
    </form>
  )
}

export { RecordForm };
