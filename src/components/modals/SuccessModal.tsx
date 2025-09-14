import AlertIcon from '@assets/alertIcon.svg?react';

interface SuccessModalProps {
    onClose: () => void;
}

function SuccessModal({ onClose }: SuccessModalProps) {

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-900 bg-opacity-70 z-50 pt-20">
            <div className="bg-gray-800 p-6 rounded-xl w-full h-auto max-w-xl modal-appear mx-4 border border-gray-700">
                <div className="border-b border-gray-700 p-2 mb-4">
                    <p className="text-white text-left bg-green-500/10 mb-4 p-4 rounded-lg border border-green-500/20">
                        {
                            <span className="flex items-center gap-2 text-green-500">
                                <AlertIcon className="w-5 h-5" />
                                Datos actualizados con éxito!
                            </span>
                        }
                    </p>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        className="bg-cyan-600 text-white py-2 px-4 text-sm rounded-lg hover:bg-cyan-700 flex items-center font-semibold transition-colors"
                        onClick={() => onClose()}
                    >
                        ACEPTAR
                    </button>
                </div>
            </div>
        </div>
    );
}

export { SuccessModal };
