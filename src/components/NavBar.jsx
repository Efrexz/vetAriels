import UserIcon from '../assets/userIcon.svg?react';
import SearchIcon from '../assets/searchIcon.svg?react';

function NavBar() {
    return (
        <nav className="flex justify-between items-center py-4 px-6 w-full bg-[#47C5A6] text-white ">
            <h1 className="text-2xl font-medium">VETERINARIA ARIEL´S EIRL</h1>
            <ul className="flex gap-5">
                <li><SearchIcon /></li>
                <li><a href="">New User</a></li>
                <li><a href="">Medica</a></li>
                <li><a href="">Peluqueria</a></li>
                <span className='font-bold mx-3'>|</span>
                <li className='flex items-center gap-2'>
                    <a href="">Efrexz</a>
                    <UserIcon />
                </li>

            </ul>
        </nav>
    )
}

export { NavBar }