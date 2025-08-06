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
        <div className="w-full max-w-[1200px] mx-auto bg-white shadow-md rounded-lg  flex flex-col min-h-[400px]">
            <div className='px-6 pt-6'>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="date-time"
                    >
                        Fecha y hora
                    </label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2 bg-gray-50 w-full md:w-[280px]">
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                        <input
                            type="text"
                            id="date-time"
                            value={dateTime}
                            readOnly
                            className="bg-gray-50 text-gray-700 text-sm focus:outline-none w-full"
                        />
                    </div>
                </div>

                <div className="space-y-2 p-4 border border-gray-200 rounded-lg flex-grow">
                    <label
                        htmlFor="observations"
                        className="text-sm font-medium"
                    >
                        Observaciones
                    </label>
                    <textarea
                        id="observations"
                        value={notes}
                        onChange={handleChange}
                        className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
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
