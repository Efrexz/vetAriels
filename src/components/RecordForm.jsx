import { ActionButtons } from '@components/ActionButtons';
import { useNavigate } from 'react-router-dom';
import CalendarIcon from '@assets/calendarIcon.svg?react';
import PropTypes from "prop-types";

function RecordForm({ formData, handleChange, onSubmit, submitText }) {
    const navigate = useNavigate();
    return (
        <>
            <div className="space-y-8 p-4 text-gray-700">
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
                                    type='number'
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
                submitText={submitText}
                onCancel={() => navigate(-1)}
                onSubmit={onSubmit}
            />
        </>
    );
}

export { RecordForm };

RecordForm.propTypes = {
    formData: PropTypes.object,
    handleChange: PropTypes.func,
    onSubmit: PropTypes.func,
    submitText: PropTypes.string
}