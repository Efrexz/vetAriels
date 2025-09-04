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
      <div className="space-y-8 p-4 text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="dateTime">
              Fecha y hora de registro
            </label>
            <div className="flex w-full border rounded-lg overflow-hidden border-gray-200">
              <div className="flex items-center justify-center bg-gray-100 px-3">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </div>
              <input
                type="text"
                id="dateTime"
                disabled
                className="w-full pl-3 pr-10 py-2 bg-gray-50 focus:outline-none"
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
              name="reason"
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
            name="anamnesis"
            value={formData.anamnesis}
            onChange={handleChange}
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
          />
        </div>

        <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
          <label className="text-sm font-medium">Constantes fisiológicas</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(formData.physiologicalConstants).map((key) => (
              <div key={key}>
                <input
                  id={key}
                  name={`physiologicalConstants.${key}`}
                  type='text' // Usar 'text' con pattern es más flexible que 'number' para decimales y símbolos
                  pattern="[0-9.,]*"
                  placeholder={physiologicalConstantsPlaceholders[key as keyof typeof physiologicalConstantsPlaceholders]}
                  value={formData.physiologicalConstants[key as keyof typeof formData.physiologicalConstants]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
          <label htmlFor="clinicalExam" className="text-sm font-medium">
            Examen clínico
          </label>
          <textarea
            id="clinicalExam"
            name="clinicalExam"
            value={formData.clinicalExam}
            onChange={handleChange}
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
          />
        </div>
      </div>
      <ActionButtons
        submitText={submitText}
        onCancel={() => navigate(-1)}
        onSubmit={onSubmit}
      />
    </form>
  );
}

export { RecordForm };
