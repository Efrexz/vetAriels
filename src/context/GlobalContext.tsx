import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, Role, CompanyData } from '@t/user.types';

type ActiveIconType = 'patients' | 'baths' | 'user' | null;

interface GlobalContextType {
  // Estado de la UI
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  showPatientList: boolean;
  setShowPatientList: (show: boolean) => void;
  showBathList: boolean;
  setShowBathList: (show: boolean) => void;
  showUserOptions: boolean;
  setShowUserOptions: (show: boolean) => void;
  showSearchInput: boolean;
  setShowSearchInput: (show: boolean) => void;
  showSearchModal: boolean;
  setShowSearchModal: (show: boolean) => void;
  isMobileScreen: boolean;
  setIsMobileScreen: (isMobile: boolean) => void;
  activeIcon: ActiveIconType;
  setActiveIcon: (icon: ActiveIconType) => void;
  
  // Funciones de control de UI
  toggleSearchModal: () => void;
  togglePatientList: () => void;
  toggleBathList: () => void;
  toggleUserOptions: () => void;
  toggleSideMenu: () => void;

  // Autenticacion
  activeUser: User | null;
  setActiveUser: (user: User | null) => void;
  logout: () => void;

  // Datos
  users: User[];
  addUser: (newUser: User) => void;
  updateUserData: (id: number, newData: Partial<User>) => void;
  removeUser: (id: number) => void;

  roles: Role[];
  addRole: (newRole: Role) => void;
  updateRoleData: (id: string, newData: Partial<Role>) => void;
  removeRole: (id: string) => void;

  companyData: CompanyData;
  setCompanyData: (data: CompanyData) => void;
  
  // Tema
  themeColor: string;
  setThemeColor: (color: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

function GlobalProvider({ children }: GlobalProviderProps) {
    //buscamos si existe un usuario activo en localStorage para el recargar la pagina no perder la sesion
    const [activeUser, setActiveUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('activeUser');
        return saved ? (JSON.parse(saved) as User | null) : null;
    });


    function logout() {
        setActiveUser(null);
        localStorage.removeItem('activeUser');
    };

    //sideBarMenu
    //estado para saber cuando esta abierto el menu y poder aplicar el responsive
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    //NavBar
    const [showPatientList, setShowPatientList] = useState(false);
    const [showBathList, setShowBathList] = useState(false);
    const [activeIcon, setActiveIcon] = useState<ActiveIconType>(null); // Verificar cual icono está activo
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showUserOptions, setShowUserOptions] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [isMobileScreen, setIsMobileScreen] = useState(false);//verificar si estamos en una pantalla pequeña y cambiar el comportamiento de la barra de búsqueda

    //cuando abrimos el menu de pacientes se desactivan las otras opciones y las otras funciones es igual
    function togglePatientList() {
        setShowPatientList(!showPatientList);
        setShowBathList(false);
        setShowUserOptions(false);
        setActiveIcon(showPatientList ? null : 'patients');
    };

    function toggleBathList() {
        setShowBathList(!showBathList);
        setShowPatientList(false);
        setShowUserOptions(false);
        setActiveIcon(showBathList ? null : 'baths');
    };

    function toggleUserOptions() {
        setShowUserOptions(!showUserOptions);
        setIsSidebarOpen(false);
        setShowBathList(false);
        setShowPatientList(false);
        setActiveIcon(showUserOptions ? null : 'user');
    };

    function toggleSideMenu() {
        setIsSidebarOpen(!isSidebarOpen);
        setShowPatientList(false);
        setShowUserOptions(false);
        setShowBathList(false);
    }

    function toggleSearchInput() {
        if (isMobileScreen) {
            // En pantallas pequeñas, mostramos el modal de búsqueda
            setShowSearchModal(true);
            setShowSearchInput(false);
        } else {
            // En pantallas grandes, mostramos el input en el navbar
            setShowSearchInput(!showSearchInput);
            setShowSearchModal(false);
        }
    }

    //cuando abrimos el buscador se desactivan las otras opciones
    function toggleSearchModal() {
        toggleSearchInput();
        setIsSidebarOpen(false);
        setShowPatientList(false);
        setShowUserOptions(false);
        setShowBathList(false);
        setActiveIcon(null)
    }

    //Users Data
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('users');
        const defaultUser: User[] = [{
            email: "Zyzz_448@hotmail.com",
            id: 1729374687071,
            lastName: "quintero",
            name: "efrainn",
            password: "123123",
            phone: "917104426",
            registrationDate: "10/19/2024",
            registrationTime: "4:51:27 PM",
            rol: "Asistente Administrativo",
            status: "ACTIVO"
        }];
        return saved ? (JSON.parse(saved) as User[]) : defaultUser;
    });

    //Roles Data
    const [roles, setRoles] = useState<Role[]>(() => {
        const saved = localStorage.getItem('roles');
        const defaultRoles: Role[] = [
            { id: "1", name: "Administrador", access: "SI" },
            { id: "2", name: "Groomer", access: "NO" },
            { id: "3", name: "Médico", access: "NO" },
            { id: "4", name: "Recepcionista", access: "SI" },
        ];
        return saved ? (JSON.parse(saved) as Role[]) : defaultRoles;
    });

    // Guardar en localStorage cada vez que cambien los estados
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('roles', JSON.stringify(roles));
    }, [roles]);

    //users
    function addUser (newUser: User) {
        setUsers(prev => [...prev, newUser]);
    };

    function updateUserData(id: number, newData: Partial<User>) {
        setUsers(prev => prev.map(user => user.id === id ? { ...user, ...newData } : user));
        //si el usuario actual es el que se está actualizando, actualizamos la informacion del active user para que se refleje en la interfaz
        if (activeUser && activeUser.id === id) {
            setActiveUser(prev => (prev ? { ...prev, ...newData } : null));
        }
    }

    // Eliminar usuario y si el usuario actual es el que se está eliminando, se cierra sesion
    function removeUser(id: number) {
        setUsers(prev => prev.filter(user => user.id !== id));
        if (activeUser && activeUser.id === id) {
            setActiveUser(null);
        }
    }

    //roles
    function addRole(newRole: Role) {
        setRoles(prev => [...prev, newRole]);
    }

    function updateRoleData(id: string, newData: Partial<Role>) {
        setRoles(prev => prev.map(role => role.id === id ? { ...role, ...newData } : role));
    }

    function removeRole(id: string) {
        setRoles(prev => prev.filter(role => role.id !== id));
    }

    const [themeColor, setThemeColor] = useState<string>(
        localStorage.getItem('themeColor') || 'blue'
    );

    // Company Data
    const [companyData, setCompanyData] = useState<CompanyData>(() => {
    const saved = localStorage.getItem('companyData');
    const defaultCompanyData: CompanyData = {
        clinicName: "VETERINARIA ARIEL´S EIRL",
        email: "vetariel@gmail.com",
        department: "LIMA",
        province: "LIMA",
        district: "LIMA",
        address: "Av. de la Constitución, No. 100, Lima",
        phone: "917104426",
        facebook: "https://www.facebook.com/vetariel/"
    };
    return saved ? (JSON.parse(saved) as CompanyData) : defaultCompanyData;
  });

    useEffect(() => {
        localStorage.setItem('activeUser', JSON.stringify(activeUser));
    }, [activeUser]);

    useEffect(() => {
        localStorage.setItem('companyData', JSON.stringify(companyData));
    }, [companyData]);

    useEffect(() => {
        localStorage.setItem('themeColor', themeColor);
    }, [themeColor]);

    const contextValue: GlobalContextType = {
    themeColor, setThemeColor, activeUser, setActiveUser, users, addUser, removeUser, updateUserData, roles, addRole, updateRoleData, removeRole, companyData, setCompanyData, logout, isSidebarOpen, setIsSidebarOpen, toggleSearchModal, togglePatientList, toggleBathList, toggleUserOptions, toggleSideMenu, activeIcon, setActiveIcon, isMobileScreen, setIsMobileScreen, showSearchModal, showSearchInput, showUserOptions, showPatientList, showBathList, setShowSearchModal, setShowSearchInput, setShowUserOptions, setShowPatientList, setShowBathList
  };

    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };
