import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="h-screen place-content-center bg-mist px-4">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-display text-ink">404</h1>
                <p className="mt-3 text-slate">La pagina que buscas no existe o fue movida.</p>
                <button
                    className="inline-flex items-center gap-2 mx-auto mt-4 bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 transition-colors font-semibold font-display shadow-sm shadow-primary/25"
                    onClick={() => navigate('/')}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}

export { NotFound };