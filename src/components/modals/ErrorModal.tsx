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
            className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-md w-full h-auto max-w-xl mt-8 modal-appear mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-gray-300 p-2 mb-4">
                    <p className="text-white text-left bg-red-500 mb-4 p-4 rounded-md">
                        <span className="flex items-center gap-2">
                            <AlertIcon className="w-5 h-5" />
                            {message}
                        </span>
                    </p>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        className="bg-green-500 text-white border border-gray-300  py-2 px-4 text-sm rounded hover:bg-green-600 flex items-center font-semibold"
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
