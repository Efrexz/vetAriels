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
    disabled?: boolean;
}

function RecordForm({
    formData,
    handleChange,
    onSubmit,
    submitText,
    disabled
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
        <div className="space-y-3 p-4 text-slate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2 border border-slate-200 rounded-lg bg-paper">
                <div>
                    <label className="block text-sm font-medium mb-2 text-ink" htmlFor="dateTime">
                        Fecha y hora de registro
                    </label>
                    <div className="flex w-full border rounded-lg overflow-hidden border-slate-200 focus-within:border-primary">
                        <div className="flex items-center justify-center bg-white px-3">
                            <CalendarIcon className="w-4 h-4 text-slate" />
                        </div>
                        <input
                            type="text"
                            id="dateTime"
                            disabled
                            className="w-full pl-3 pr-10 py-1 bg-white focus:outline-none text-ink"
                            value={formData.dateTime}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-2 text-ink">
                        Motivo de atención
                    </label>
                    <input
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full px-3 py-1 border border-slate-200 bg-white rounded-lg focus:outline-none text-ink hover:border-primary focus:border-primary"
                    />
                </div>
            </div>

            <div className="space-y-2 px-4 py-2 border border-slate-200 rounded-lg bg-paper">
                <label htmlFor="anamnesis" className="text-sm font-medium text-ink">
                    Anamnesis y descripción del caso
                </label>
                <textarea
                    id="anamnesis"
                    name="anamnesis"
                    value={formData.anamnesis}
                    onChange={handleChange}
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none text-ink hover:border-primary focus:border-primary"
                />
            </div>

            <div className="space-y-2 px-4 py-2 border border-slate-200 rounded-lg bg-paper">
                <label className="text-sm font-medium text-ink">Constantes fisiológicas</label>
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
                                className="w-full px-3 py-1 border border-slate-200 bg-white rounded-lg focus:outline-none text-ink hover:border-primary focus:border-primary"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2 px-4 py-2 border border-slate-200 rounded-lg bg-paper">
                <label htmlFor="clinicalExam" className="text-sm font-medium text-ink">
                    Examen clínico
                </label>
                <textarea
                    id="clinicalExam"
                    name="clinicalExam"
                    value={formData.clinicalExam}
                    onChange={handleChange}
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none text-ink hover:border-primary focus:border-primary"
                />
            </div>
        </div>
        <ActionButtons
            submitText={submitText}
            onCancel={() => navigate(-1)}
            onSubmit={onSubmit}
            disabled={disabled}
        />
    </form>
  )
}

export { RecordForm };
