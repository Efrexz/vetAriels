import UserIcon from '../assets/userIcon.svg?react';
import SearchIcon from '../assets/searchIcon.svg?react';
import BathIcon from '../assets/bathIcon.svg?react';
import Stethoscope from '../assets/stethoscope.svg?react';
import NewUserIcon from '../assets/newUserIcon.svg?react';

function NavBar() {
    const pageSections = [
        { icon: NewUserIcon, tooltip: 'Crear nuevo Propietario', path: '/crear-nuevo-propietario' },
        { icon: Stethoscope, tooltip: 'Sala de espera', path: '/sala-de-espera' },
        { icon: BathIcon, tooltip: 'Peluqueria', path: '/peluqueria' },
    ];

    return (
        <nav className="flex justify-between items-center py-4 px-6 w-full bg-[#47C5A6] text-white">
            <h1 className="text-2xl font-medium">VETERINARIA ARIEL´S EIRL</h1>
            <div className="flex items-center gap-5">
                <SearchIcon className="w-5 h-5 hover:text-[#206D5A] cursor-pointer" />
                <ul className="flex gap-5 items-center">
                    {pageSections.map((section, index) => (
                        <li key={index} className='cursor-pointer relative group '>
                            <section.icon className="w-5 h-5 hover:text-[#206D5A]" />
                            <div className="absolute bottom-[-100%] left-[-150%] transform translate-y-full opacity-0 group-hover:opacity-100  transition-opacity duration-300 bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
                                {section.tooltip}
                            </div>
                        </li>
                    ))}
                    <span className='font-bold mx-3'>|</span>
                    <li className='flex items-center gap-2'>
                        <a href="">Efrexz</a>
                        <UserIcon className='w-6 h-6 hover:text-[#206D5A] cursor-pointer' />
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export { NavBar }