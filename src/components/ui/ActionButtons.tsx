import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';

type Mode = 'modal' | 'form';

interface ActionButtonsProps {
    onCancel: () => void;
    onSubmit: () => void;
    cancelText?: string;
    submitText?: string;
    mode?: Mode;
    customIcon?: React.ReactNode;
}

function ActionButtons({
    onCancel,
    onSubmit,
    cancelText = "CANCELAR",
    submitText,
    mode,
    customIcon,
} : ActionButtonsProps)  {
    return (
        <div className={`flex flex-col md:flex-row ${mode === "modal" ? "justify-end gap-4  pt-4" : "justify-between items-center bg-gray-900 py-3 px-4 shadow-xl rounded-b-lg border-t-2 border-gray-700 gap-4"}`}>
            <button
                type='button'
                className={`bg-gray-700 border border-gray-600 text-xs md:text-sm text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 w-full md:w-auto`}
                onClick={onCancel}
            >
                <ReturnIcon className="w-4 h-4 text-gray-400" />
                {cancelText}
            </button>
            <button
                type='button'
                className={`bg-emerald-600 text-xs md:text-sm text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 w-full md:w-auto `}
                onClick={onSubmit}
            >
                {customIcon || <PlusIcon className="w-4 h-4 text-white" />}
                {submitText}
            </button>
        </div>
    );
}

export { ActionButtons };