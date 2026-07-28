import AlertIcon from '@assets/alertIcon.svg?react';

interface SuccessModalProps {
    onClose: () => void;
}

function SuccessModal({ onClose }: SuccessModalProps) {

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-ink/40 z-50 pt-20">
            <div className="bg-paper p-6 rounded-2xl w-full h-auto max-w-xl shadow-sm modal-appear mx-4 border border-slate-200">
                <div className="bg-success/10 mb-4 p-4 rounded-lg border border-success/20">
                    <span className="flex items-center gap-2 text-success text-sm">
                        <AlertIcon className="w-5 h-5 flex-shrink-0" />
                        Datos actualizados con &eacute;xito!
                    </span>
                </div>

                <div className="flex justify-end mt-4 gap-4">
                    <button
                        className="bg-primary text-white py-2 px-5 text-sm rounded-xl hover:opacity-90 flex items-center font-semibold font-display shadow-sm shadow-primary/25 transition-colors"
                        onClick={() => onClose()}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}

export { SuccessModal };
