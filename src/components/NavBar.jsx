import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '@context/GlobalContext';
import { ClientsContext } from '@context/ClientsContext';
import { ClientSearchInput } from './ClientSearchInput';
import { SearchModal } from './SearchModal';
import UserIcon from '@assets/userIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import BathIcon from '@assets/bathIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import NewUserIcon from '@assets/newUserIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import DocumentOutIcon from '@assets/documentOutIcon.svg?react';
import StoreIcon from '@assets/storeIcon.svg?react';

function NavBar() {
    const { petsInQueueMedical, petsInQueueGrooming } = useContext(ClientsContext);
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
    } = useContext(GlobalContext);
    const navigate = useNavigate();


    const pageSections = [
        { icon: NewUserIcon, tooltip: 'Crear nuevo Propietario', path: '/clients/create', count: false },
        { icon: Stethoscope, tooltip: 'Sala de espera', path: '/sala-de-espera', count: true, countData: petsInQueueMedical.length },
        { icon: BathIcon, tooltip: 'Peluquería', path: '/peluqueria', count: true, countData: petsInQueueGrooming.length },
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
            >
                <h1
                    className="text-md lg:text-xl font-medium cursor-pointer"
                    onClick={() => {
                        setActiveIcon(null);
                        setShowBathList(false);
                        setShowPatientList(false);
                        setShowUserOptions(false);
                        setIsSidebarOpen(false);
                    }}
                >
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
                <div className="absolute top-20 md:top-14 right-6 md:right-20 bg-white shadow-lg rounded-lg w-64 z-20 max-h-80">
                    {/* Contenedor con scroll solo para los pacientes */}
                    <div className="max-h-64 overflow-y-auto">
                        <ul>
                            {petsInQueueGrooming.map((pet, index) => (
                                <li
                                    key={index}
                                    className="p-3 border-b flex items-center hover:bg-gray-50"
                                    onClick={() => {
                                        window.location.href = `/pets/pet/${pet?.petData?.id}/update`;
                                    }}
                                >
                                    <img src="https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp"
                                        alt="PetImage"
                                        className="w-10 h-10 rounded-lg"
                                    />
                                    <div className='ml-2 gap-2'>
                                        <span className="text-blue-500 cursor-pointer hover:underline">{pet?.petData?.petName}</span>
                                        <span className="block text-gray-500 text-xs">{pet?.timeOfAttention}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Opción fija al final, sin afectar el scroll */}
                    <li className='p-3 hover:bg-gray-50 border-t'>
                        <Link
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => {
                                setShowBathList(false);
                                setActiveIcon(null); // Cerramos el menú y desactivamos el icono
                            }}
                            to="/grooming">
                            Ir a la Peluquería
                        </Link>
                    </li>
                </div>
            )}
            {/*  el menú desplegable de pacientes en cola medica */}
            {showPatientList && (
                <div className="absolute top-20 md:top-14 right-6 md:right-20 bg-white shadow-lg rounded-lg w-64 z-20 max-h-80">
                    <div className="max-h-64 overflow-y-auto">
                        <ul>
                            {petsInQueueMedical.map((pet, index) => (
                                <li
                                    key={index}
                                    className="p-3 border-b flex items-center hover:bg-gray-50"
                                    onClick={() => {
                                        window.location.href = `/pets/pet/${pet?.petData?.id}/update`;
                                    }}
                                >
                                    <img src={pet.img || "https://t1.ea.ltmcdn.com/es/posts/8/9/2/nombres_graciosos_para_perros_pequenos_23298_3_600.webp"} alt="PetImage" className="w-10 h-10 rounded-lg" />
                                    <div className='ml-3 gap-2'>
                                        <span className=" text-blue-500 cursor-pointer hover:underline">{pet?.petData?.petName}</span>
                                        <span className="block text-gray-500 text-xs">{pet?.timeOfAttention}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <li className='p-3 hover:bg-gray-50 border-t'>
                        <Link
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => {
                                setShowPatientList(false);
                                setActiveIcon(null); // Cerramos el menú y desactivamos el icono
                            }}
                            to="/clinic-queue">
                            Ir a la sala de espera
                        </Link>
                    </li>
                </div>
            )}

            {/*  el menú desplegable de opciones de usuario */}
            {showUserOptions && (
                <div className="absolute top-20 md:top-14 right-0 bg-white shadow-lg rounded-lg w-80 z-20">
                    <ul>
                        <li
                            className="p-3 border-b flex flex-col hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setShowUserOptions(false);
                                navigate(`/config/profile/${activeUser?.id}/update`)
                            }}
                        >
                            <div className='flex items-center just gap-2'>
                                <RoleUserIcon className="w-5 h-5 text-gray-600" />
                                <span className="ml-2 text-gray-600">{activeUser?.name}</span>
                            </div>
                            <span className="block text-gray-500 text-xs pl-9">{activeUser?.email}</span>
                        </li>
                        <li
                            className="p-3 border-b flex flex-col hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                navigate("/login")
                                setShowUserOptions(false);
                                logout();
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <DocumentOutIcon className="w-5 h-5 text-gray-600" />
                                <span className="ml-2 text-gray-600 text-sm ">Cerrar Sesión en este dispositivo</span>
                            </div>
                        </li>
                        <li
                            className="p-3 border-b flex flex-col hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                navigate("/login")
                                setShowUserOptions(false);
                                logout();
                            }}
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
            )}
            {
                showSearchModal && (
                    <SearchModal onClose={() => setShowSearchModal(false)} />
                )
            }
        </nav>
    );
}

export { NavBar };