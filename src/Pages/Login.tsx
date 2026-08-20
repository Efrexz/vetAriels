import { ChangeEvent, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/authService';
import EnvelopeIcon from '@assets/envelope.svg?react';
import PadLockIcon from '@assets/padLockIcon.svg?react';
import ArrowRightIcon from '@assets/arrowRight.svg?react';
import InclinedPaw from '@assets/inclinedPaw.svg?react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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
              Bienvenido de nuevo
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate mb-1"
                  >
                    Correo Electrónico
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

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate mb-1"
                  >
                    Contraseña
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

                {error && (
                  <p className="text-danger text-center text-sm" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-2 px-4 rounded-xl hover:opacity-90 focus:ring-4 focus:ring-primary/30 transition-colors flex items-center justify-center gap-2 font-semibold font-display shadow-sm shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
                  <ArrowRightIcon className="w-4 h-4" />
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

export { Login };
