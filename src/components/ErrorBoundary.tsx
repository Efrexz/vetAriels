import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary global: evita la pantalla en blanco cuando un componente
 * explota en runtime (el bug del TDZ en HorizontalMenu dejaba la app
 * muerta y sin info). Muestra una pantalla de estado con el error y una
 * forma de recuperar (recargar o volver al inicio).
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log estructurado (sin PII). En el futuro se puede mandar a un
        // colector de errores (Sentry etc).
        console.error('[ErrorBoundary]', error, errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-lg text-center">
                        <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold font-display text-ink mb-2">
                            Algo salió mal
                        </h1>
                        <p className="text-sm text-slate mb-4">
                            Ocurrió un error inesperado en la aplicaci&oacute;n. Tus datos est&aacute;n seguros.
                        </p>
                        <pre className="text-xs text-left bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-auto max-h-32 text-danger mb-4">
                            {this.state.error?.message ?? 'Error desconocido'}
                        </pre>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-primary text-white text-sm font-semibold py-2 px-4 rounded-xl hover:opacity-90"
                            >
                                Recargar
                            </button>
                            <button
                                onClick={() => {
                                    this.setState({ hasError: false, error: null });
                                    window.location.href = '/';
                                }}
                                className="border border-slate-200 text-slate text-sm py-2 px-4 rounded-xl hover:bg-slate-100"
                            >
                                Ir al inicio
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;