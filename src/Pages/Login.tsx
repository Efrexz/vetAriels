import { ChangeEvent, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, resetPassword } from '../services/authService';
import EnvelopeIcon from '@assets/envelope.svg?react';
import PadLockIcon from '@assets/padLockIcon.svg?react';
import ArrowRightIcon from '@assets/arrowRight.svg?react';
import InclinedPaw from '@assets/inclinedPaw.svg?react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot'>('login');

  const navigate = useNavigate();

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email) {
      setError('Ingresa tu correo electronico');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'forgot') {
        await resetPassword(email);
        setInfo(
          'Si el correo existe, enviamos un link de recuperacion. Revisa tu bandeja.',
        );
        setMode('login');
      } else {
        if (!password) {
          setError('Completa todos los campos');
          setIsSubmitting(false);
          return;
        }
        await signIn(email, password);
        navigate('/');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al procesar';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleMode() {
    setMode(mode === 'login' ? 'forgot' : 'login');
    setError('');
    setInfo('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <header className="relative h-48 bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1974')] bg-cover bg-center opacity-15"></div>
            <div className="relative flex flex-col items-center">
              <div className="bg-paper/20 p-3 rounded-full backdrop-blur-sm">
                <InclinedPaw className="w-10 h-10 text-paper" />
              </div>
              <h1 className="mt-4 text-2xl font-bold font-display text-paper">
                Gestor Veterinario
              </h1>
              <p className="text-paper/80 text-sm">Portal Veterinario</p>
            </div>
          </header>

          <div className="p-8">
            <h2 className="text-2xl font-semibold text-primary text-center mb-6 font-display">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Recuperar contrasena'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate mb-1"
                  >
                    Correo Electronico
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate h-5 w-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white text-ink placeholder:text-slate/50"
                      placeholder="nombre@clinica.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {mode === 'login' && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate mb-1"
                    >
                      Contrasena
                    </label>
                    <div className="relative">
                      <PadLockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate h-5 w-5" />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white text-ink placeholder:text-slate/50"
                        placeholder="••••••••"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

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
                  className="w-full bg-primary text-white py-2 px-4 rounded-xl hover:opacity-90 focus:ring-4 focus:ring-primary/30 transition-colors flex items-center justify-center gap-2 font-semibold font-display shadow-sm shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Procesando...'
                    : mode === 'login'
                    ? 'Iniciar Sesion'
                    : 'Enviar link de recuperacion'}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm font-medium text-primary hover:opacity-90 transition-colors"
                  >
                    {mode === 'login'
                      ? 'Olvide mi contrasena'
                      : 'Volver a iniciar sesion'}
                  </button>
                </div>
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

export { Login };
