import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import EnvelopeIcon from '../assets/envelope.svg?react';
import PadLockIcon from '../assets/padLockIcon.svg?react';
import ArrowRightIcon from '../assets/arrowRight.svg?react';
import InclinedPaw from '../assets/inclinedPaw.svg?react';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { setActiveUser, users } = useContext(GlobalContext);

    const handleLogin = (email, password) => {
        const foundUser = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
        if (foundUser) {
            setActiveUser(foundUser);
            navigate("/")
            localStorage.setItem('activeUser', JSON.stringify(foundUser));

            return true;
        } else {
            setError('Email o contraseña incorrectos');
            console.log(foundUser);

            return false; // Login fallido
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <header className="relative h-48 bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1974')] bg-cover bg-center opacity-20"></div>
                        <div className="relative flex flex-col items-center">
                            <div className="bg-white p-3 rounded-full">
                                <InclinedPaw className="w-10 h-10 text-teal-600" />
                            </div>
                            <h1 className="mt-4 text-2xl font-bold text-white">PetCare Plus</h1>
                            <p className="text-teal-100">Portal Veterinario</p>
                        </div>
                    </header>

                    {/* Login Form */}
                    <div className="p-8">
                        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Bienvenido de nuevo</h2>
                        <form>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                                            placeholder="nombre@clinica.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div >
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <PadLockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                                            Recordarme
                                        </label>
                                    </div>
                                    <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                                <button
                                    type='button'
                                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transition-colors flex items-center justify-center gap-2 font-medium"
                                    onClick={() => handleLogin(email, password)}
                                >
                                    Iniciar Sesión
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            ¿No tienes una cuenta?{' '}
                            <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                                Regístrate aquí
                            </a>
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    © 2024 PetCare Plus. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}

export { Login };