import AlertIcon from '@assets/alertIcon.svg?react';

type TypeofError = 'stock' | 'emptyList' | 'form' | 'permission' | 'password' | 'default';

interface ErrorModalProps {
    onClose: () => void;
    typeOfError: TypeofError
}

function ErrorModal({ onClose, typeOfError }: ErrorModalProps) {

    const errorMessages: Record<TypeofError | 'default', string> = {
        stock: "El producto seleccionado no tiene stock disponible.",
        emptyList: "Debe seleccionar al menos un producto o servicio.",
        form: "El formulario contiene errores.",
        permission: "No tienes permisos para realizar esta acción.",
        password: "La contraseña ingresada no es correcta.",
        default: "Ha ocurrido un error inesperado.",
    };

    const message = errorMessages[typeOfError] || errorMessages.default;
    return (
        <div
            className="fixed inset-0 flex justify-center items-start bg-gray-900 bg-opacity-70 z-50 pt-20"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 p-6 rounded-xl w-full h-auto max-w-xl modal-appear mx-4 border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-gray-700 p-2 mb-4">
                    <p className="text-red-500 text-left bg-red-500/10 mb-4 p-4 rounded-lg border border-red-500/20">
                        <span className="flex items-center gap-2">
                            <AlertIcon className="w-5 h-5" />
                            {message}
                        </span>
                    </p>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        className="bg-cyan-600 text-white py-2 px-4 text-sm rounded-lg hover:bg-cyan-700 flex items-center font-semibold transition-colors"
                        onClick={onClose}
                    >
                        ACEPTAR
                    </button>
                </div>
            </div>
        </div>
    );
}

export { ErrorModal };
