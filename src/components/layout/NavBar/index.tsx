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
        <nav className={`flex justify-between items-center py-4 px-2 md:px-6 w-full bg-${themeColor}-400 text-white`}>
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
                <h1 className="text-md lg:text-xl font-medium cursor-pointer">
                    {companyData?.clinicName || 'VETERINARIA ARIEL´S EIRL'}
                </h1>
            </Link>
            <div className="flex justify-end items-center gap-3 md:gap-5 w-full">
                <SearchIcon
                    className={`${showSearchInput ? "w-10 h-10" : "w-5 h-5"} hover:text-[#206D5A] cursor-pointer`}
                    onClick={toggleSearchModal}
                />
                {showSearchInput && (
                    <ClientSearchInput mode={"sales"} />
                )}
                <ul className="flex gap-3 md:gap-5 items-center">
                    {pageSections.map((section, index) => (
                        <li
                            key={index}
                            className="cursor-pointer relative group"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {section.path ? ( // Si tiene path, es un Link
                                <Link to={section.path} className="flex items-center">
                                    <section.icon className="w-5 h-5 hover:text-[#206D5A]" />
                                </Link>
                            ) : ( // Si no, es un icono con una accion
                                <section.icon
                                    className={`w-5 h-5 cursor-pointer ${
                                        (activeIcon === 'patients' && section.action === togglePatientList) ||
                                        (activeIcon === 'baths' && section.action === toggleBathList)
                                        ? 'text-[#206D5A]'
                                        : ''
                                    }`}
                                    onClick={section.action} // Llama a la accion directamente
                                />
                            )}

                            {section.count && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white  rounded-full py-0.2 px-1 text-xs transform translate-x-1/2 -translate-y-1/2">
                                    {section.countData}
                                </span>
                            )}
                            <div className="absolute bottom-[-135%] md:bottom-[-100%] left-[-150%] transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap z-10">
                                {section.tooltip}
                            </div>
                        </li>
                    ))}
                    <span className="font-bold mx-1 md:mx-3">|</span>
                    <li className={`flex items-center gap-2 cursor-pointer hover:text-[#206D5A] ${activeIcon === "user" ? "text-[#206D5A]" : ""}`} onClick={toggleUserOptions}>
                        <span className='hidden md:block'>{activeUser?.name}</span>
                        <UserIcon className="w-6 h-6" />
                    </li>
                </ul>
            </div>

            {/* Menú desplegable de pacientes en cola para baño/peluquería */}
            {showBathList && (
                <GroomingQueueMenu onClose={() => {
                    setShowBathList(false);
                    setActiveIcon(null);
                }} />
            )}
            {/*  el menú desplegable de pacientes en cola medica */}
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