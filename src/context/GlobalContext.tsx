import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { Role, CompanyData, User } from '@t/user.types';
import { getSession, signOut, onAuthStateChange } from '../services/authService';

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

  // Autenticacion (ahora desde Supabase)
  session: Session | null;
  currentUser: SupabaseUser | null;
  isLoadingAuth: boolean;
  logout: () => Promise<void>;

  // Adaptadores de la API anterior (User / users[]) para no romper componentes
  // ----------------------------------------------------------------
  // ATTENTION: estos campos son temporales durante la migracion.
  // Se eliminaran en la fase 1G cuando todos los componentes usen Supabase directo.
  activeUser: User | null;
  setActiveUser: (user: User | null) => void;
  users: User[];
  addUser: (newUser: User) => void;
  updateUserData: (id: string, newData: Partial<User>) => void;
  removeUser: (id: string) => void;

  // Roles (siguen en localStorage hasta fase 1G)
  roles: Role[];
  addRole: (newRole: Role) => void;
  updateRoleData: (id: string, newData: Partial<Role>) => void;
  removeRole: (id: string) => void;

  companyData: CompanyData;
  setCompanyData: (data: CompanyData) => void;

  themeColor: string;
  setThemeColor: (color: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

function GlobalProvider({ children }: GlobalProviderProps) {
  // Sesión de Supabase (reemplaza activeUser)
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Al montar, leemos la sesión existente y nos suscribimos a cambios
  useEffect(() => {
    let mounted = true;

    getSession()
      .then((existingSession) => {
        if (!mounted) return;
        setSession(existingSession);
        setCurrentUser(existingSession?.user ?? null);
      })
      .catch((err) => {
        console.error('Error al obtener la sesión:', err);
      })
      .finally(() => {
        if (mounted) setIsLoadingAuth(false);
      });

    const unsubscribe = onAuthStateChange((newSession) => {
      setSession(newSession);
      setCurrentUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  async function logout() {
    await signOut();
    setSession(null);
    setCurrentUser(null);
  }

  // ---------------------------------------------------------------------------
  // ADAPTADORES TEMPORALES (fase 1D)
  // ---------------------------------------------------------------------------
  // Mientras migramos componentes a Supabase, estos adaptadores mantienen
  // la API anterior (`activeUser`, `users`, `addUser`, etc.) para no romper
  // el build. Seran reemplazados en la fase 1G cuando cada componente use
  // el servicio de Supabase correspondiente.
  // ---------------------------------------------------------------------------

  // activeUser: toma el currentUser de Supabase y lo mapea al tipo User.
  // El `name` viene de user_metadata (configurado al crear el usuario).
  const activeUser: User | null = currentUser
    ? {
        id: currentUser.id,
        name:
          (currentUser.user_metadata?.['name'] as string | undefined) ??
          currentUser.email?.split('@')[0] ??
          '',
        email: currentUser.email ?? '',
        lastName: (currentUser.user_metadata?.['lastName'] as string | undefined) ?? '',
        phone: (currentUser.user_metadata?.['phone'] as string | undefined) ?? '',
        registrationDate: currentUser.created_at.split('T')[0] ?? '',
        registrationTime: currentUser.created_at.split('T')[1]?.slice(0, 8) ?? '',
        rol: (currentUser.user_metadata?.['rol'] as string | undefined) ?? 'Administrador',
        status: 'ACTIVO',
      }
    : null;

  // setActiveUser ya no tiene sentido en la nueva arquitectura (la sesion
  // la controla Supabase), pero lo exponemos para no romper componentes.
  // Solo actua en modo local para evitar logout real.
  function setActiveUser(_user: User | null) {
    // No-op: la sesion la controla onAuthStateChange.
  }

  // users: ahora viene de Supabase Auth. Como la lista de usuarios completa
  // requiere service_role key, exponemos un array vacio con un placeholder.
  // Esto se reimplementa en la fase 1G usando admin API.
  const users: User[] = [];

  function addUser(_newUser: User) {
    console.warn(
      'addUser: pendiente de migrar a Supabase. Se implementa en la fase 1G.',
    );
  }

  function updateUserData(id: string, newData: Partial<User>) {
    console.warn(
      'updateUserData: pendiente de migrar a Supabase. Se implementa en la fase 1G.',
      { id, newData },
    );
  }

  function removeUser(id: string) {
    console.warn(
      'removeUser: pendiente de migrar a Supabase. Se implementa en la fase 1G.',
      { id },
    );
  }

  //sideBarMenu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //NavBar
  const [showPatientList, setShowPatientList] = useState(false);
  const [showBathList, setShowBathList] = useState(false);
  const [activeIcon, setActiveIcon] = useState<ActiveIconType>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  function togglePatientList() {
    setShowPatientList(!showPatientList);
    setShowBathList(false);
    setShowUserOptions(false);
    setActiveIcon(showPatientList ? null : 'patients');
  }

  function toggleBathList() {
    setShowBathList(!showBathList);
    setShowPatientList(false);
    setShowUserOptions(false);
    setActiveIcon(showBathList ? null : 'baths');
  }

  function toggleUserOptions() {
    setShowUserOptions(!showUserOptions);
    setIsSidebarOpen(false);
    setShowBathList(false);
    setShowPatientList(false);
    setActiveIcon(showUserOptions ? null : 'user');
  }

  function toggleSideMenu() {
    setIsSidebarOpen(!isSidebarOpen);
    setShowPatientList(false);
    setShowUserOptions(false);
    setShowBathList(false);
    setShowSearchModal(false);
  }

  function toggleSearchInput() {
    if (isMobileScreen) {
      setShowSearchModal(true);
      setShowSearchInput(false);
    } else {
      setShowSearchInput(!showSearchInput);
      setShowSearchModal(false);
    }
  }

  function toggleSearchModal() {
    toggleSearchInput();
    setIsSidebarOpen(false);
    setShowPatientList(false);
    setShowUserOptions(false);
    setShowBathList(false);
    setActiveIcon(null);
  }

  // Roles (siguen en localStorage hasta fase 1G)
  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem('roles');
    const defaultRoles: Role[] = [
      { id: '1', name: 'Administrador', access: 'SI' },
      { id: '2', name: 'Groomer', access: 'NO' },
      { id: '3', name: 'Médico', access: 'NO' },
      { id: '4', name: 'Recepcionista', access: 'SI' },
    ];
    return saved ? (JSON.parse(saved) as Role[]) : defaultRoles;
  });

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  function addRole(newRole: Role) {
    setRoles(prev => [...prev, newRole]);
  }

  function updateRoleData(id: string, newData: Partial<Role>) {
    setRoles(prev => prev.map(role => (role.id === id ? { ...role, ...newData } : role)));
  }

  function removeRole(id: string) {
    setRoles(prev => prev.filter(role => role.id !== id));
  }

  const [themeColor, setThemeColor] = useState<string>(localStorage.getItem('themeColor') || 'blue');

  // Company Data
  const [companyData, setCompanyData] = useState<CompanyData>(() => {
    const saved = localStorage.getItem('companyData');
    const defaultCompanyData: CompanyData = {
      clinicName: "VETERINARIA ARIEL´S EIRL",
      email: 'vetariel@gmail.com',
      department: 'LIMA',
      province: 'LIMA',
      district: 'LIMA',
      address: 'Av. de la Constitución, No. 100, Lima',
      phone: '917104426',
      facebook: 'https://www.facebook.com/vetariel/',
    };
    return saved ? (JSON.parse(saved) as CompanyData) : defaultCompanyData;
  });

  useEffect(() => {
    localStorage.setItem('companyData', JSON.stringify(companyData));
  }, [companyData]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  const contextValue: GlobalContextType = {
    themeColor,
    setThemeColor,
    session,
    currentUser,
    isLoadingAuth,
    logout,
    activeUser,
    setActiveUser,
    users,
    addUser,
    updateUserData,
    removeUser,
    roles,
    addRole,
    updateRoleData,
    removeRole,
    companyData,
    setCompanyData,
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSearchModal,
    togglePatientList,
    toggleBathList,
    toggleUserOptions,
    toggleSideMenu,
    activeIcon,
    setActiveIcon,
    isMobileScreen,
    setIsMobileScreen,
    showSearchModal,
    showSearchInput,
    showUserOptions,
    showPatientList,
    showBathList,
    setShowSearchModal,
    setShowSearchInput,
    setShowUserOptions,
    setShowPatientList,
    setShowBathList,
  };

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}

export function useGlobal(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal debe ser usado dentro de un GlobalProvider');
  }
  return context;
}

export { GlobalContext, GlobalProvider };
