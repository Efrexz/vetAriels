import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';

interface ActionButtonsProps {
    onCancel: () => void;
    onSubmit: () => void;
    cancelText?: string;
    submitText?: string;
    mode?: string;
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
        <div className={`flex flex-col md:flex-row ${mode === "modal" ? "justify-end gap-4" : "justify-between items-center bg-gray-100 py-3 px-4 shadow-lg rounded-b-lg gap-4"}`}>
            <button
                type='button'
                className={`bg-white border border-gray-300 text-xs md:text-sm lg:text-base text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-2 w-full md:w-auto`}
                onClick={onCancel}
            >
                <ReturnIcon className="w-4 h-4 text-gray-700" />
                {cancelText}
            </button>
            <button
                type='button'
                className={`bg-green-500 text-xs md:text-sm text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2 w-full md:w-auto `}
                onClick={onSubmit}
            >
                {customIcon || <PlusIcon className="w-4 h-4 text-white" />}
                {submitText}
            </button>
        </div>
    );
}

export { ActionButtons };