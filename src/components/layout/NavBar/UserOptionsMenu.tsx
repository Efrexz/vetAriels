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
        <div className="absolute top-20 md:top-14 right-0 bg-white shadow-lg rounded-lg w-80 z-20">
            <ul>
                <li
                    className="p-3 border-b flex flex-col hover:bg-gray-100 cursor-pointer"
                    onClick={handleProfileClick}
                >
                    <div className='flex items-center just gap-2'>
                        <RoleUserIcon className="w-5 h-5 text-gray-600" />
                        <span className="ml-2 text-gray-600">{activeUser?.name}</span>
                    </div>
                    <span className="block text-gray-500 text-xs pl-9">{activeUser?.email}</span>
                </li>
                <li
                    className="p-3 border-b flex flex-col hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                >
                    <div className='flex items-center gap-2'>
                        <DocumentOutIcon className="w-5 h-5 text-gray-600" />
                        <span className="ml-2 text-gray-600 text-sm ">Cerrar Sesión en este dispositivo</span>
                    </div>
                </li>
                <li
                    className="p-3 border-b flex flex-col hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                >
                    <div className='flex items-center gap-2'>
                        <DocumentOutIcon className="w-5 h-5 text-gray-600" />
                        <span className="ml-2 text-gray-600 text-sm">Cerrar Sesión en todos los dispositivos</span>
                    </div>
                </li>
                <li className="p-3 border-b flex flex-col hover:bg-gray-100">
                    <div className='flex items-center gap-2'>
                        <StoreIcon className="w-5 h-5 text-gray-600" />
                        <span className="ml-2 text-gray-600 text-sm">Cambiar de Sede:</span>
                    </div>
                </li>
                <li className="p-3 border-b  hover:bg-gray-100 cursor-pointer">
                    <span className="ml-2 text-gray-600 text-sm">[1570] OLGA BUSTINZA</span>
                </li>
                <li className="p-3 border-b  hover:bg-gray-100 cursor-pointer">
                    <span className="ml-2 text-gray-600 text-sm">[1571] VETERINARIA ARIEL´S EIRL</span>
                </li>
            </ul>
        </div>
    );
}