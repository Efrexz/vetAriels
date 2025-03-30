import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '@context/GlobalContext';
import EnvelopeIcon from '@assets/envelope.svg?react';
import PadLockIcon from '@assets/padLockIcon.svg?react';
import ArrowRightIcon from '@assets/arrowRight.svg?react';
import InclinedPaw from '@assets/inclinedPaw.svg?react';


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
            return false; // Login fallido
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <header className="relative h-48 bg-gradient-to-r from-blue-600 to-gray-500 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1974')] bg-cover bg-center opacity-20"></div>
                        <div className="relative flex flex-col items-center">
                            <div className="bg-white p-3 rounded-full">
                                <InclinedPaw className="w-10 h-10 text-blue-400" />
                            </div>
                            <h1 className="mt-4 text-2xl font-bold text-white">PetCare Plus</h1>
                            <p className="text-gray-200">Portal Veterinario</p>
                        </div>
                    </header>

                    <div className="p-8">
                        <h2 className="text-2xl font-semibold text-gray-600 text-center mb-6">Bienvenido de nuevo</h2>
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
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg hover:border-blue-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 outline-none text-gray-500"
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
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg hover:border-blue-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 outline-none text-gray-500"
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
                                            className="h-4 w-4  border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                                            Recordarme
                                        </label>
                                    </div>
                                    <a href="#" className="text-sm font-medium text-[#60A5FA] hover:text-[#508cd6]">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                                <button
                                    type='button'
                                    className="w-full bg-[#60A5FA] text-white py-2 px-4 rounded-lg hover:bg-[#508cd6] focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transition-colors flex items-center justify-center gap-2 font-medium"
                                    onClick={() => handleLogin(email, password)}
                                >
                                    Iniciar Sesión
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
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