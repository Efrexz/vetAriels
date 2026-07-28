import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButtons } from '@components/ui/ActionButtons';
import CalendarIcon from '@assets/calendarIcon.svg?react';

interface NoteFormProps {
    notes: string;
    handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    dateTime: string;
    error?: string;
}

function NoteForm({ notes, handleChange, onSubmit, dateTime, error }: NoteFormProps) {
    const navigate = useNavigate();
    return (
        <div className="w-full max-w-[1200px] mx-auto bg-paper shadow-sm rounded-2xl border border-slate-200 flex flex-col min-h-[400px]">
            <div className='px-6 pt-6 bg-paper h-full'>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-ink mb-2 "
                        htmlFor="date-time"
                    >
                        Fecha y hora
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-2 bg-paper w-full md:w-[280px]">
                        <CalendarIcon className="w-5 h-5 text-slate" />
                        <input
                            type="text"
                            id="date-time"
                            value={dateTime}
                            readOnly
                            className="bg-paper text-slate text-sm focus:outline-none w-full"
                        />
                    </div>
                </div>

                <div className="space-y-2 p-4 border border-slate-200 rounded-lg bg-paper flex-grow">
                    <label
                        htmlFor="observations"
                        className="text-sm font-medium text-ink"
                    >
                        Observaciones
                    </label>
                    <textarea
                        id="observations"
                        value={notes}
                        onChange={handleChange}
                        className="w-full min-h-[200px] px-3 py-2 border bg-white rounded-lg focus:outline-none text-ink hover:border-primary focus-within:border-primary"
                    />
                    {error && (
                        <p className="text-danger text-xs mt-1">{error}</p>
                    )}
                </div>

            </div>
            <div className="mt-auto">
                <ActionButtons
                    onCancel={() => navigate(-1)}
                    onSubmit={onSubmit}
                    submitText="Guardar cambios"
                />
            </div>
        </div>
    );
}

export { NoteForm };
