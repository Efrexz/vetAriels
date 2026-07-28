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
            className="fixed inset-0 flex justify-center items-start bg-ink/40 z-50 pt-20"
            onClick={onClose}
        >
            <div
                className="bg-paper p-6 rounded-2xl w-full h-auto max-w-xl shadow-sm modal-appear mx-4 border border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-danger/10 mb-4 p-4 rounded-lg border border-danger/20">
                    <p className="text-danger text-left text-sm">
                        <span className="flex items-center gap-2">
                            <AlertIcon className="w-5 h-5 flex-shrink-0" />
                            {message}
                        </span>
                    </p>
                </div>

                <div className="flex justify-end mt-4 gap-4">
                    <button
                        className="bg-primary text-white py-2 px-5 text-sm rounded-xl hover:opacity-90 flex items-center font-semibold font-display shadow-sm shadow-primary/25 transition-colors"
                        onClick={onClose}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}

export { ErrorModal };
