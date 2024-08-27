import { useState } from 'react';
import UserIcon from '../assets/userIcon.svg?react';
import SearchIcon from '../assets/searchIcon.svg?react';
import BathIcon from '../assets/bathIcon.svg?react';
import Stethoscope from '../assets/stethoscope.svg?react';
import NewUserIcon from '../assets/newUserIcon.svg?react';
import { Link } from 'react-router-dom';

function NavBar() {
    const [showPatientList, setShowPatientList] = useState(false);

    const [showBathList, setShowBathList] = useState(false);

    const [activeIcon, setActiveIcon] = useState(null); // Verificar cual icono está activo

    const pageSections = [
        { icon: NewUserIcon, tooltip: 'Crear nuevo Propietario', path: '/clients/create', count: false },
        { icon: Stethoscope, tooltip: 'Sala de espera', path: '/sala-de-espera', count: true },
        { icon: BathIcon, tooltip: 'Peluquería', path: '/peluqueria', count: true },
    ];

    const togglePatientList = () => {
        setShowPatientList(!showPatientList);
        setShowBathList(false);
        setActiveIcon(showPatientList ? null : 'patients');
    };

    const toggleBathList = () => {
        setShowBathList(!showBathList);
        setShowPatientList(false);
        setActiveIcon(showBathList ? null : 'baths');
    };

    return (
        <nav className="flex justify-between items-center py-4 px-6 w-full bg-[#47C5A6] text-white">
            <Link to="/">
                <h1 className="text-2xl font-medium cursor-pointer">VETERINARIA ARIEL´S EIRL</h1>
            </Link>
            <div className="flex items-center gap-5">
                <SearchIcon className="w-5 h-5 hover:text-[#206D5A] cursor-pointer" />
                <ul className="flex gap-5 items-center">
                    {pageSections.map((section, index) => (
                        <li key={index} className="cursor-pointer relative group">
                            {section.icon === NewUserIcon ? (
                                <Link to={section.path} className="flex items-center">
                                    <section.icon className="w-5 h-5 hover:text-[#206D5A]" />
                                </Link>
                            ) : (
                                <section.icon
                                    className={`w-5 h-5 cursor-pointer
                                        ${activeIcon === 'patients' && section.icon === Stethoscope
                                            ? 'text-[#206D5A]'
                                            : activeIcon === 'baths' && section.icon === BathIcon
                                                ? 'text-[#206D5A]'
                                                : ''
                                        }`}
                                    onClick={section.icon === Stethoscope ? togglePatientList : null || section.icon === BathIcon ? toggleBathList : null} // Añadir el evento de clic para el ícono correspondiente
                                />
                            )}

                            {section.count && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white  rounded-full py-0.2 px-1 text-xs transform translate-x-1/2 -translate-y-1/2">
                                    0
                                </span>
                            )}
                            <div className="absolute bottom-[-100%] left-[-150%] transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap z-10">
                                {section.tooltip}
                            </div>
                        </li>
                    ))}
                    <span className="font-bold mx-3">|</span>
                    <li className="flex items-center gap-2">
                        <a href="">Efrexz</a>
                        <UserIcon className="w-6 h-6 hover:text-[#206D5A] cursor-pointer" />
                    </li>
                </ul>
            </div>

            {/*  el menú desplegable de pacientes */}
            {showBathList && (
                <div className="absolute top-16 right-20 bg-white shadow-lg rounded-lg w-64 z-20">
                    <ul>
                        <li className="p-3 border-b flex items-center">
                            <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp" alt="PetImage" className="w-10 h-10" />
                            <div className='ml-2 gap-2'>
                                <span className=" text-blue-500 cursor-pointer hover:underline">ROCKO</span>
                                <span className="block text-gray-500 text-xs">12:59 PM</span>
                            </div>
                        </li>
                        <li className="p-3 border-b flex items-center">
                            <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp" alt="PetImage" className="w-10 h-10" />
                            <div className='ml-2 gap-2'>
                                <span className=" text-blue-500 cursor-pointer hover:underline">ROCKO</span>
                                <span className="block text-gray-500 text-xs">12:59 PM</span>
                            </div>
                        </li>
                        <li className="p-3 border-b flex items-center">
                            <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp" alt="PetImage" className="w-10 h-10" />
                            <div className='ml-2 gap-2'>
                                <span className=" text-blue-500 cursor-pointer hover:underline">ROCKO</span>
                                <span className="block text-gray-500 text-xs">12:59 PM</span>
                            </div>
                        </li>
                        <li className="p-3 text-blue-500 cursor-pointer hover:underline">Ir a Peluquería</li>
                    </ul>
                </div>
            )}

            {/*  el menú desplegable de baños */}
            {showPatientList && (
                <div className="absolute top-16 right-24 bg-white shadow-lg rounded-lg w-64 z-20">
                    <ul>
                        <li className="p-3 border-b flex items-center">
                            <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp" alt="PetImage" className="w-10 h-10" />
                            <div className='ml-2 gap-2'>
                                <span className=" text-blue-500 cursor-pointer hover:underline">ROCKO</span>
                                <span className="block text-gray-500 text-xs">12:59 PM</span>
                            </div>
                        </li>
                        <li className="p-3 border-b flex items-center">
                            <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp" alt="PetImage" className="w-10 h-10" />
                            <div className='ml-2 gap-2'>
                                <span className=" text-blue-500 cursor-pointer hover:underline">ROCKO</span>
                                <span className="block text-gray-500 text-xs">12:59 PM</span>
                            </div>
                        </li>
                        <li className="p-3 border-b flex items-center">
                            <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp" alt="PetImage" className="w-10 h-10" />
                            <div className='ml-2 gap-2'>
                                <span className=" text-blue-500 cursor-pointer hover:underline">ROCKO</span>
                                <span className="block text-gray-500 text-xs">12:59 PM</span>
                            </div>
                        </li>
                        <li className="p-3 text-blue-500 cursor-pointer hover:underline">Ir a la sala de espera</li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export { NavBar };