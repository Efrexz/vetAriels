import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButtons } from '@components/ui/ActionButtons';
import CalendarIcon from '@assets/calendarIcon.svg?react';

interface NoteFormProps {
    notes: string;
    handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    dateTime: string;
}

function NoteForm({ notes, handleChange, onSubmit, dateTime }: NoteFormProps) {
    const navigate = useNavigate();
    return (
        <div className="w-full max-w-[1200px] mx-auto bg-gray-800 shadow-lg rounded-lg flex flex-col min-h-[400px]">
            <div className='px-6 pt-6 bg-gray-900 h-full'>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-300 mb-2 "
                        htmlFor="date-time"
                    >
                        Fecha y hora
                    </label>
                    <div className="flex items-center gap-2 border border-gray-700 rounded-lg p-2 bg-gray-900 w-full md:w-[280px]">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            id="date-time"
                            value={dateTime}
                            readOnly
                            className="bg-gray-900 text-gray-400 text-sm focus:outline-none w-full"
                        />
                    </div>
                </div>

                <div className="space-y-2 p-4 border border-gray-700 rounded-lg bg-gray-900 flex-grow">
                    <label
                        htmlFor="observations"
                        className="text-sm font-medium text-gray-300"
                    >
                        Observaciones
                    </label>
                    <textarea
                        id="observations"
                        value={notes}
                        onChange={handleChange}
                        className="w-full min-h-[200px] px-3 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none text-gray-200 hover:border-cyan-500 focus-within:border-cyan-500"
                    />
                </div>

            </div>
            <div className="mt-auto">
                <ActionButtons
                    onCancel={() => navigate(-1)}
                    onSubmit={onSubmit}
                    submitText="GUARDAR CAMBIOS"
                />
            </div>
        </div>
    );
}

export { NoteForm };
