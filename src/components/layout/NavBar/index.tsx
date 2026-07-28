import { useEffect, ComponentType } from 'react';
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
import BurguerMenuIcon from '@assets/burguerMenuIcon.svg?react';
import XIcon from '@assets/xIcon.svg?react';

interface PageSection {
    icon: ComponentType<any>;
    tooltip: string;
    path?: string;
    count: boolean;
    countData?: number;
    action?: () => void;
}

function NavBar() {
    const { petsInQueueMedical, petsInQueueGrooming } = useClients();
    const {
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
        setIsSidebarOpen,
        isSidebarOpen,
        toggleSideMenu,
    } = useGlobal();

    const pageSections: PageSection[] = [
        { icon: NewUserIcon, tooltip: 'Crear nuevo Propietario', path: '/clients/create', count: false },
        { icon: Stethoscope, tooltip: 'Sala de espera', count: true, countData: petsInQueueMedical.length, action: togglePatientList },
        { icon: BathIcon, tooltip: 'Peluquería', count: true, countData: petsInQueueGrooming.length, action: toggleBathList },
    ];

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileScreen(window.innerWidth < 769);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toggleSearchModal();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSearchModal]);

    const userInitial = (activeUser?.name || "U").charAt(0).toUpperCase();
    const userRole = activeUser?.rol || "";

    return (
        <nav className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-paper/80 backdrop-blur border-b border-slate-200 flex-shrink-0">
            {/* Left */}
            <div className="flex items-center gap-3">
                <button
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate hover:text-ink transition-colors"
                    onClick={toggleSideMenu}
                >
                    {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <BurguerMenuIcon className="w-5 h-5" />}
                </button>

                <button
                    onClick={toggleSearchModal}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate rounded-full px-4 py-2 text-sm transition-colors min-w-[180px] md:min-w-[240px]"
                >
                    <SearchIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline truncate">Buscar...</span>
                    <kbd className="hidden md:inline-flex items-center gap-0.5 ml-auto bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-[10px] text-slate font-mono leading-none">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>

                {showSearchInput && (
                    <ClientSearchInput mode={"sales"} />
                )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1 md:gap-2">
                {pageSections.map((section, index) => (
                    <div key={index} className="relative group">
                        {section.path ? (
                            <Link
                                to={section.path}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate hover:text-ink"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <section.icon className="w-5 h-5" />
                            </Link>
                        ) : (
                            <button
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                                    (activeIcon === 'patients' && section.action === togglePatientList) ||
                                    (activeIcon === 'baths' && section.action === toggleBathList)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate hover:bg-slate-100 hover:text-ink'
                                }`}
                                onClick={section.action}
                            >
                                <section.icon className="w-5 h-5" />
                            </button>
                        )}

                        {section.count && section.countData !== undefined && section.countData > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-danger text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold border-2 border-paper px-1 leading-none">
                                {section.countData}
                            </span>
                        )}
                    </div>
                ))}

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <button
                    className={`flex items-center gap-2 rounded-full pl-2 pr-2.5 py-1.5 transition-colors ${
                        activeIcon === "user"
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-slate-100'
                    }`}
                    onClick={toggleUserOptions}
                >
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold font-display flex-shrink-0">
                        {userInitial}
                    </span>
                    <div className="hidden md:block text-left leading-tight">
                        <span className="block text-sm font-medium text-ink truncate max-w-[100px]">
                            {activeUser?.name}
                        </span>
                        <span className="block text-[10px] text-slate uppercase tracking-wider font-medium">
                            {userRole}
                        </span>
                    </div>
                </button>
            </div>

            {showBathList && (
                <GroomingQueueMenu onClose={() => {
                    setShowBathList(false);
                    setActiveIcon(null);
                }} />
            )}
            {showPatientList && (
                <PatientQueueMenu onClose={() => {
                    setShowPatientList(false);
                    setActiveIcon(null);
                }} />
            )}
            {showUserOptions && (
                <UserOptionsMenu onClose={() => {
                    setShowUserOptions(false);
                    setActiveIcon(null);
                }} />
            )}
            {showSearchModal && (
                <SearchModal onClose={() => setShowSearchModal(false)} />
            )}
        </nav>
    );
}

export { NavBar };
