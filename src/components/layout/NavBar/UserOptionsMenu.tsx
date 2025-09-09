import {  useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import DocumentOutIcon from '@assets/documentOutIcon.svg?react';
import StoreIcon from '@assets/storeIcon.svg?react';

interface UserOptionsMenuProps {
    onClose: () => void;
}

export function UserOptionsMenu({onClose} : UserOptionsMenuProps) {
    const {activeUser, logout} = useGlobal();
    const navigate = useNavigate();

    function handleProfileClick() {
        navigate(`/config/profile/${activeUser?.id}/update`);
        onClose();
    }

    function handleLogout() {
        navigate("/login")
        logout();
        onClose();
    }

    return (
        <div className="absolute top-16 right-0 bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-lg w-80 z-20 border border-gray-700/50 overflow-hidden flex flex-col max-h-[420px]">
            <div className="px-3 pt-3 pb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Opciones de Usuario</h4>
            </div>

            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <ul>
                    {/* Perfil de Usuario */}
                    <li
                        className="px-3 py-2.5 border-t border-gray-700/50 flex items-start gap-3 hover:bg-cyan-500/10 cursor-pointer group"
                        onClick={handleProfileClick}
                    >
                        <RoleUserIcon className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{activeUser?.name}</span>
                            <span className="block text-gray-400 text-xs">{activeUser?.email}</span>
                        </div>
                    </li>

                    {/* Acciones de Sesión */}
                    <li
                        className="px-3 py-2.5 border-t border-gray-700/50 flex items-center gap-3 hover:bg-cyan-500/10 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <DocumentOutIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Cerrar Sesión</span>
                    </li>
                    <li
                        className="px-3 py-2.5 border-t border-gray-700/50 flex items-center gap-3 hover:bg-cyan-500/10 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <DocumentOutIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Cerrar todas las Sesiones</span>
                    </li>

                    {/* Sección de Sedes */}
                    <li className="px-3 py-2.5 border-t border-gray-700/50 flex items-center gap-3">
                        <StoreIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-400 text-sm font-medium">Cambiar de Sede:</span>
                    </li>
                    <li className="px-3 py-2.5 border-t border-gray-700/50 hover:bg-cyan-500/10 cursor-pointer">
                        <span className="pl-8 text-gray-300 text-sm">[1570] OLGA BUSTINZA</span>
                    </li>
                    <li className="px-3 py-2.5 border-t border-gray-700/50 hover:bg-cyan-500/10 cursor-pointer">
                        <span className="pl-8 text-gray-300 text-sm">[1571] VETERINARIA ARIEL´S EIRL</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}