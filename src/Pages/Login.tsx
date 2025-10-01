import { ChangeEvent , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { generateUniqueId } from '@utils/idGenerator';
import EnvelopeIcon from '@assets/envelope.svg?react';
import PadLockIcon from '@assets/padLockIcon.svg?react';
import ArrowRightIcon from '@assets/arrowRight.svg?react';
import InclinedPaw from '@assets/inclinedPaw.svg?react';
import UserIcon from '@assets/userIcon.svg?react'


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();

    const { setActiveUser, users, addUser } = useGlobal();

    function handleLogin (email: string, password: string) {
        const foundUser = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
        if (foundUser) {
            setActiveUser(foundUser);
            setError('');
            navigate("/")
        } else {
            setError('Email o contraseña incorrectos');
        }
    };

    function handleRegister() {
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            setError('Ya existe una cuenta con este correo electrónico');
            return;
        }

        const now = new Date();
        const newUser = {
            id: generateUniqueId(), 
            name: username,
            email: email,
            password: password,
            rol: 'Administrador',
            registrationDate: now.toLocaleDateString(),
            registrationTime: now.toLocaleTimeString(),
            status: "ACTIVO"
        };

        addUser(newUser);
        setActiveUser(newUser);
        setError('');
        navigate("/");
    }

    function handleEmailChange (e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    };

    function handlePasswordChange (e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    };

    function handleConfirmPasswordChange(e: ChangeEvent<HTMLInputElement>) {
        setConfirmPassword(e.target.value);
    }

    function handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }

    function handleSubmit (e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (isRegistering) {
            handleRegister();
        } else {
            handleLogin(email, password);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                    <header className="relative h-48 bg-gradient-to-r from-cyan-600 to-emerald-600 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1974')] bg-cover bg-center opacity-20"></div>
                        <div className="relative flex flex-col items-center">
                            <div className="bg-gray-800 p-3 rounded-full">
                                <InclinedPaw className="w-10 h-10 text-cyan-500" />
                            </div>
                            <h1 className="mt-4 text-2xl font-bold text-white">PetCare Plus</h1>
                            <p className="text-gray-200">Portal Veterinario</p>
                        </div>
                    </header>

                    <div className="p-8">
                        <h2 className="text-2xl font-semibold text-cyan-400 text-center mb-6">
                            {isRegistering ? "Crea tu cuenta" : "Bienvenido de nuevo"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                {isRegistering && (
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                                            Nombre de Usuario
                                        </label>
                                        <div className="relative">
                                            {/* Asegúrate de tener un UserIcon.svg o similar */}
                                            {/* Si no tienes, puedes usar un icono genérico o simplemente omitirlo */}
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                id="username"
                                                type="text"
                                                value={username}
                                                onChange={handleUsernameChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg hover:border-cyan-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none bg-gray-800 text-gray-300"
                                                placeholder="Tu nombre completo"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg hover:border-cyan-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none bg-gray-800 text-gray-300"
                                            placeholder="nombre@clinica.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <PadLockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg hover:border-cyan-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none bg-gray-800 text-gray-300"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                {isRegistering && (
                                    <div>
                                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
                                            Confirmar Contraseña
                                        </label>
                                        <div className="relative">
                                            <PadLockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg hover:border-cyan-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none bg-gray-800 text-gray-300"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    {!isRegistering && (
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 border-gray-700 rounded bg-gray-800"
                                            />
                                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                                                Recordarme
                                            </label>
                                        </div>
                                    )}

                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsRegistering(!isRegistering); // Cambia la vista
                                            setError(''); // Limpia el error al cambiar de vista
                                            setEmail(''); // Opcional: limpiar campos
                                            setPassword('');
                                            setConfirmPassword('');
                                            setUsername('');
                                        }}
                                        className="text-sm font-medium text-cyan-400 hover:text-cyan-500 transition-colors"
                                    >
                                        {isRegistering ? "¿Ya tienes cuenta? Inicia Sesión" : "Primera vez? Crea una cuenta"}
                                    </a>
                                </div>
                                {error && <p className="text-rose-500 mb-4 text-center">{error}</p>}
                                <button
                                    type='submit' // Cambia a type="submit" para que funcione con el onSubmit del form
                                    className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-emerald-500 focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    {isRegistering ? "Registrarse" : "Iniciar Sesión"}
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-400">
                    © 2025 PetCare Plus. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}

export { Login };