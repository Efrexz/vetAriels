import { useEffect, ComponentType  } from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { useClients } from '@context/ClientsContext';
import { ClientSearchInput } from '@components/search/ClientSearchInput';
import { SearchModal } from '@components/modals/SearchModal';
import { GroomingQueueMenu } from './GroomingQueueMenu';
import { PatientQueueMenu } from './PatientQueueMenu';
import { UserOptionsMenu } from './UserOptionsMenu';
import UserIcon from '@assets/userIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import BathIcon from '@assets/bathIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import NewUserIcon from '@assets/newUserIcon.svg?react';


interface PageSection {
    icon: ComponentType<any>; // Tipo para componentes de íconos SVG
    tooltip: string;
    path?: string;
    count: boolean;
    countData?: number;
    action?: () => void; // Un action opcional para los iconos que no navegan
}

function NavBar() {
    const { petsInQueueMedical, petsInQueueGrooming } = useClients();
    const { logout,
        companyData,
        themeColor,
        activeUser,
        toggleSearchModal,
        togglePatientList,
        toggleBathList,
        toggleUserOptions,
        activeIcon,
        setIsMobileScreen,
        showSearchModal,
        showSearchInput,
        showUserOptions,
        showPatientList,
        showBathList,
        setShowSearchModal,
        setShowUserOptions,
        setShowPatientList,
        setShowBathList,
        setActiveIcon,
        setIsSidebarOpen
    } = useGlobal();

    const pageSections: PageSection[] = [
        { icon: NewUserIcon, tooltip: 'Crear nuevo Propietario', path: '/clients/create', count: false },
        { icon: Stethoscope, tooltip: 'Sala de espera', count: true, countData: petsInQueueMedical.length, action: togglePatientList },
        { icon: BathIcon, tooltip: 'Peluquería', count: true, countData: petsInQueueGrooming.length , action: toggleBathList},
    ];

    //Para detectar el tamaño de la pantalla y cambiar el comportamiento de la barra de búsqueda
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileScreen(window.innerWidth < 769); // 768px es el breakpoint típico para dispositivos móviles
        };

        // Se ejecuta inmediatamente cuando el componente se monta.
        checkScreenSize();

        //  Agrega un listener para detectar cambios en el tamaño de la ventana.
        window.addEventListener('resize', checkScreenSize);

        // Elimina el listener cuando el componente se desmonta.
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);


    return (
        <nav className='flex justify-between items-center py-3 px-4 md:px-8 w-full bg-gray-800 text-gray-300 shadow-lg fixed z-50'>
            <Link
                to="/"
                className='w-[50%] items-center cursor-pointer'
                onClick={() => {
                        setActiveIcon(null);
                        setShowBathList(false);
                        setShowPatientList(false);
                        setShowUserOptions(false);
                        setIsSidebarOpen(false);
                    }}
            >
                <h1 className="text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                    {companyData?.clinicName || 'VETERINARIA ARIEL´S EIRL'}
                </h1>
            </Link>

            <div className="flex justify-end items-center gap-3 md:gap-5 w-full">
                <SearchIcon
                    className='w-5 h-5 hover:text-cyan-400 cursor-pointer transition-colors'
                    onClick={toggleSearchModal}
                />
                {showSearchInput && (
                    <ClientSearchInput mode={"sales"} />
                )}

                <ul className="flex gap-4 md:gap-5 items-center bg-gray-700/50 px-4 py-2 rounded-full">
                    {pageSections.map((section, index) => (
                        <li
                            key={index}
                            className="cursor-pointer relative group"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {section.path ? ( // Si tiene path, es un Link
                                <Link to={section.path} className="flex items-center">
                                    <section.icon className='w-5 h-5 group-hover:text-cyan-400 transition-all' />
                                </Link>
                            ) : ( // Si no, es un icono con una accion
                                <section.icon
                                    className={`w-5 h-5 cursor-pointer transition-all ${
                                        (activeIcon === 'patients' && section.action === togglePatientList) ||
                                        (activeIcon === 'baths' && section.action === toggleBathList)
                                        ? 'text-cyan-400 scale-125'
                                        : 'group-hover:text-cyan-400'
                                    }`}
                                    onClick={section.action} // Llama a la accion directamente
                                />
                            )}

                            {section.count && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-semibold border-2 border-gray-800">
                                    {section.countData}
                                </span>
                            )}
                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs rounded py-1 px-3 whitespace-nowrap z-10 pointer-events-none">
                                {section.tooltip}
                            </div>
                        </li>
                    ))}
                </ul>

                <div
                    className={`flex items-center gap-3 cursor-pointer pl-4 pr-3 py-2 rounded-full transition-colors ${
                        activeIcon === "user"
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : "hover:bg-gray-700"
                    }`}
                    onClick={toggleUserOptions}
                >
                    <span className='hidden md:block font-medium'>{activeUser?.name}</span>
                    <UserIcon className="w-6 h-6" />
                </div>
            </div>

            {/* Menú desplegable de pacientes en cola para baño/peluquería */}
            {showBathList && (
                <GroomingQueueMenu onClose={() => {
                    setShowBathList(false);
                    setActiveIcon(null);
                }} />
            )}
            {/*  el menu desplegable de pacientes en cola medica */}
            {showPatientList && (
                <PatientQueueMenu onClose={() => {
                    setShowPatientList(false);
                    setActiveIcon(null);
                }} />
            )}

            {/*  el menu desplegable de opciones de usuario */}
            {showUserOptions && (
                <UserOptionsMenu  onClose={() => {
                    setShowUserOptions(false);
                    setActiveIcon(null);
                }}/>
            )}

            {/* Modal de búsqueda */}
            {showSearchModal && (
                    <SearchModal onClose={() => setShowSearchModal(false)} />
            )}
        </nav>
    );
}

export { NavBar };