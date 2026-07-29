import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
    exiting: boolean;
}

interface ToastContextType {
    toast: {
        success: (message: string, duration?: number) => void;
        error: (message: string, duration?: number) => void;
        warning: (message: string, duration?: number) => void;
        info: (message: string, duration?: number) => void;
    };
    removeToast: (id: string) => void;
    toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
    children: ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counterRef = useRef(0);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
    }, []);

    const addToast = useCallback(
        (type: ToastType, message: string, duration = 3500) => {
            counterRef.current += 1;
            const id = `toast-${counterRef.current}-${Date.now()}`;
            const newToast: Toast = { id, type, message, duration, exiting: false };
            setToasts((prev) => [...prev, newToast]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    const toast = {
        success: (message: string, duration?: number) =>
            addToast('success', message, duration),
        error: (message: string, duration?: number) =>
            addToast('error', message, duration),
        warning: (message: string, duration?: number) =>
            addToast('warning', message, duration),
        info: (message: string, duration?: number) =>
            addToast('info', message, duration),
    };

    return (
        <ToastContext.Provider value={{ toast, removeToast, toasts }}>
            {children}
        </ToastContext.Provider>
    );
}

function useToast(): ToastContextType {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export { ToastProvider, useToast };
