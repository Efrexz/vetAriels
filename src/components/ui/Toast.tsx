import { useToast } from '@context/ToastContext';
import CheckIcon from '@assets/checkIcon.svg?react';
import AlertIcon from '@assets/alertIcon.svg?react';
import InfoIcon from '@assets/infoIcon.svg?react';
import XIcon from '@assets/xIcon.svg?react';

const iconMap = {
    success: { Icon: CheckIcon, color: 'text-success' },
    error: { Icon: AlertIcon, color: 'text-danger' },
    warning: { Icon: AlertIcon, color: 'text-amber' },
    info: { Icon: InfoIcon, color: 'text-primary' },
};

const bgMap = {
    success: 'border-success/30 bg-success/5',
    error: 'border-danger/30 bg-danger/5',
    warning: 'border-amber/30 bg-amber/5',
    info: 'border-primary/30 bg-primary/5',
};

function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => {
                const { Icon, color } = iconMap[toast.type];
                const bg = bgMap[toast.type];

                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm bg-paper/95 ${bg} transition-all duration-300 ${
                            toast.exiting
                                ? 'opacity-0 translate-x-4 scale-95'
                                : 'opacity-100 translate-x-0 scale-100'
                        }`}
                    >
                        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${color}`} />
                        <p className="text-sm text-ink flex-1 leading-relaxed">
                            {toast.message}
                        </p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 text-slate hover:text-ink transition-colors -mr-1 -mt-1 p-1"
                        >
                            <XIcon className="w-3.5 h-3.5" />
                        </button>

                        {toast.duration > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-xl">
                                <div
                                    className={`h-full ${toast.type === 'success' ? 'bg-success/40' : toast.type === 'error' ? 'bg-danger/40' : toast.type === 'warning' ? 'bg-amber/40' : 'bg-primary/40'}`}
                                    style={{ animation: `toast-progress ${toast.duration}ms linear forwards` }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export { ToastContainer };
