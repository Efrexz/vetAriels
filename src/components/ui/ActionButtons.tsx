import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import DiskIcon from '@assets/diskIcon.svg?react';

type Mode = 'modal' | 'form' | 'single';

interface ActionButtonsProps {
  onCancel?: () => void;
  onSubmit: () => void;
  cancelText?: string;
  submitText?: string;
  mode?: Mode;
  customIcon?: React.ReactNode;
  disabled?: boolean;
}

function ActionButtons({
  onCancel,
  onSubmit,
  cancelText = 'Cancelar',
  submitText = 'Guardar',
  mode,
  customIcon,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        mode === 'modal'
          ? 'justify-end gap-4 pt-4'
          : mode === 'single'
          ? 'justify-end gap-4'
          : 'justify-between items-center bg-slate-50 py-3 px-4 shadow-sm rounded-b-2xl border-t border-slate-200 gap-4'
      }`}
    >
      {mode !== 'single' && onCancel && (
        <button
          type="button"
          className="border border-slate-200 text-sm text-slate py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 font-medium w-full md:w-auto"
          onClick={onCancel}
        >
          <ReturnIcon className="w-4 h-4 text-slate" />
          {cancelText}
        </button>
      )}
      <button
        type="button"
        disabled={disabled}
        className="bg-primary text-sm text-white py-2 px-5 rounded-xl hover:opacity-90 transition-colors flex items-center gap-2 font-semibold font-display shadow-sm shadow-primary/25 w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={onSubmit}
      >
        {customIcon ||
          (mode === 'single' ? (
            <DiskIcon className="w-4 h-4 text-white" />
          ) : (
            <PlusIcon className="w-4 h-4 text-white" />
          ))}
        {submitText}
      </button>
    </div>
  );
}

export { ActionButtons };
