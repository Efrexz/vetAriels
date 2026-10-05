import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import PadLockIcon from '@assets/padLockIcon.svg?react';
import InclinedPaw from '@assets/inclinedPaw.svg?react';

/**
 * Pantalla de cambio de contrasena tras hacer click en el link del correo
 * de recuperacion. Supabase-js consume el token de la URL (type=recovery)
 * y crea una sesion temporal; con esa sesion es posible asignar la nueva
 * contrasena via auth.updateUser.
 */
function ResetPasswordPage() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setInfo('');

        if (password.length < 6) {
            setError('La contrasena debe tener al menos 6 caracteres');
            return;
        }
        if (password !== confirm) {
            setError('Las contrasenas no coinciden');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) {
                if (updateError.message.toLowerCase().includes('session')) {
                    setError(
                        'Tu link de recuperacion expiro o esta incompleto. Abre el link mas reciente de tu correo.'
                    );
                } else {
                    setError(updateError.message);
                }
                return;
            }

            setInfo('Contrasena actualizada. Redirigiendo al login...');
            await supabase.auth.signOut();
            setTimeout(() => navigate('/login'), 1500);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <header className="relative h-36 bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
                        <div className="bg-paper/20 p-3 rounded-full backdrop-blur-sm">
                            <InclinedPaw className="w-8 h-8 text-paper" />
                        </div>
                    </header>

                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-primary text-center mb-6 font-display">
                            Nueva contrasena
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="newPassword"
                                        className="block text-sm font-medium text-slate mb-1"
                                    >
                                        Nueva contrasena
                                    </label>
                                    <div className="relative">
                                        <PadLockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate h-5 w-5" />
                                        <input
                                            id="newPassword"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white text-ink"
                                            placeholder="••••••••"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-slate mb-1"
                                    >
                                        Confirmar contrasena
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-xl hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white text-ink"
                                        placeholder="••••••••"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {error && (
                                    <p className="text-danger text-center text-sm" role="alert">
                                        {error}
                                    </p>
                                )}
                                {info && (
                                    <p className="text-primary text-center text-sm" role="status">
                                        {info}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-white py-2 px-4 rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-2 font-semibold font-display shadow-sm shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar contrasena'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-slate">
                    © 2025 Gestor Veterinario. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}

export { ResetPasswordPage };