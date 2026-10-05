import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { Role, CompanyData, User } from '@t/user.types';
import { getSession, signOut, onAuthStateChange } from '../services/authService';
import {
  createUser as adminCreateUser,
  deactivateUser as adminDeactivateUser,
  type CreateUserInput,
  type UserRole,
} from '../services/adminUsersService';
import {
  getOwnProfile,
  getOwnCompany,
  updateProfileData,
  adminUserToUser,
  ownProfileToUser,
} from '../services/profilesService';
import { useUsersQuery } from '../hooks/useUsersQuery';

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
  activeUser: User | null;
  setActiveUser: (user: User | null) => void;
  users: User[];
  addUser: (newUser: User) => Promise<void>;
  updateUserData: (id: string, newData: Partial<User>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;

  // Roles (siguen en localStorage: son configuracion de UI, no datos de negocio)
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
  // activeUser: la fuente real es la tabla profiles (RLS: cada usuario ve
  // su propia fila). El rol viene de profiles.role — la fuente segura —
  // NUNCA de user_metadata (esa el usuario podria editarla).
  // ---------------------------------------------------------------------------
  const [ownProfile, setOwnProfile] = useState<Awaited<ReturnType<typeof getOwnProfile>>>(null);

  const sessionUserId = session?.user?.id ?? null;

  useEffect(() => {
    let mounted = true;
    if (sessionUserId) {
      getOwnProfile()
        .then((profile) => {
          if (mounted) setOwnProfile(profile);
        })
        .catch((err) => {
          console.error('Error al leer el perfil del usuario:', err);
          if (mounted) setOwnProfile(null);
        });
    } else {
      setOwnProfile(null);
    }
    return () => {
      mounted = false;
    };
  }, [sessionUserId]);

  const activeUser: User | null = ownProfile ? ownProfileToUser(ownProfile) : null;

  // setActiveUser ya no tiene sentido en la nueva arquitectura (la sesion
  // la controla Supabase), pero se expone como no-op para no romper componentes.
  function setActiveUser(_user: User | null) {
    // No-op: la sesion la controla onAuthStateChange.
  }

  // users: lista real via Edge Function admin-users (service_role).
  // Antes era `const users = []` — eso dejaba EditUser muerto y los
  // selects de "Responsable" vacios en movimientos/pagos.
  const { data: usersData = [] } = useUsersQuery();
  const users: User[] = usersData.map(adminUserToUser);

  /**
   * Crea un usuario nuevo en la empresa actual. Delega a la Edge Function
   * admin-users que usa service_role. El trigger handle_new_user crea el
   * profile automaticamente.
   *
   * El rol DEBE ser un UserRole real de la DB (la DB no acepta los nombres
   * en espanol de la lista vieja de roles); CreateUser ahora manda el enum.
   */
  async function addUser(newUser: User & { rol: UserRole | string }): Promise<void> {
    const input: CreateUserInput = {
      email: newUser.email,
      password: newUser.password ?? '123123',
      first_name: newUser.name,
      last_name: newUser.lastName,
      phone: newUser.phone,
      role: (newUser.rol as UserRole) ?? 'RECEPCIONISTA',
    };
    await adminCreateUser(input);
  }

  /**
   * Actualiza datos de un usuario.
   * - name/lastName/phone -> UPDATE profiles (RLS: propio o admin).
   * - rol/status -> via Edge Function (service_role + triggers de seguridad).
   */
  async function updateUserData(id: string, newData: Partial<User>): Promise<void> {
    const profileChanges: { firstName?: string; lastName?: string; phone?: string } = {};
    let hasProfileChanges = false;
    if (newData.name !== undefined) {
      profileChanges.firstName = newData.name;
      hasProfileChanges = true;
    }
    if (newData.lastName !== undefined) {
      profileChanges.lastName = newData.lastName;
      hasProfileChanges = true;
    }
    if (newData.phone !== undefined) {
      profileChanges.phone = newData.phone;
      hasProfileChanges = true;
    }
    if (hasProfileChanges) {
      await updateProfileData(id, profileChanges);
      // Si me edi to a mi mismo, refreso el perfil en cache
      if (ownProfile && ownProfile.id === id) {
        const refreshed = await getOwnProfile();
        setOwnProfile(refreshed);
      }
    }
    if (newData.rol) {
      const { changeUserRole } = await import('../services/adminUsersService');
      await changeUserRole(id, newData.rol as UserRole);
    }
    if (newData.status === 'INACTIVO') {
      await adminDeactivateUser(id);
    }
  }

  async function removeUser(id: string): Promise<void> {
    await adminDeactivateUser(id);
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

  // Roles (siguen en localStorage: extension de UI, no datos de negocio).
  // NOTA: el ALTA de usuarios usa el enum UserRole de la DB, no esta lista.
  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem('roles');
    const defaultRoles: Role[] = [
      { id: '1', name: 'Administrador', access: 'SI' },
      { id: '2', name: 'Groomer', access: 'NO' },
      { id: '3', name: 'Médico', access: 'NO' },
      { id: '4', name: 'Recepcionista', access: 'SI' },
    ];
    try {
      return saved ? (JSON.parse(saved) as Role[]) : defaultRoles;
    } catch {
      return defaultRoles;
    }
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
    setRoles(prev => prev.filter(role => (role.id !== id)));
  }

  const [themeColor, setThemeColor] = useState<string>(localStorage.getItem('themeColor') || 'blue');

  // Company Data: la fuente real es la tabla companies (multi-tenant).
  // Los campos que la DB no tiene (department/province/district/facebook)
  // viven en un OVERLAY de localStorage namesaceado por empresa
  // (companyData:<companyId>, antes compartian el mismo key todos
  // los tenants del mismo navegador).
  function mapCompany(db: Awaited<ReturnType<typeof getOwnCompany>>): CompanyData {
    const companyId = db?.id ?? 'default';
    let extras: Partial<CompanyData> = {};
    try {
      const saved = localStorage.getItem(`companyData:${companyId}`);
      if (saved) extras = JSON.parse(saved) as Partial<CompanyData>;
    } catch {
      extras = {};
    }
    return {
      clinicName: db?.name ?? 'Mi Clinica',
      email: db?.email ?? '',
      department: extras.department ?? 'LIMA',
      province: extras.province ?? 'LIMA',
      district: extras.district ?? 'LIMA',
      address: db?.address ?? '',
      phone: db?.phone ?? '',
      facebook: extras.facebook ?? '',
    };
  }

  const [companyData, setCompanyDataState] = useState<CompanyData>({
    clinicName: '', email: '', department: '', province: '',
    district: '', address: '', phone: '', facebook: '',
  });

  useEffect(() => {
    let mounted = true;
    if (sessionUserId) {
      getOwnCompany()
        .then((db) => {
          if (mounted) setCompanyDataState(mapCompany(db));
        })
        .catch((err) => {
          console.error('Error al leer los datos de la clinica:', err);
        });
    }
    return () => {
      mounted = false;
    };
  }, [sessionUserId]);

  function setCompanyData(data: CompanyData) {
    setCompanyDataState(data);
    // Solo guardamos el overlay (los campos que la DB no cubre). El resto
    // viene de companies y se relee del servidor al recargar.
    const companyId = ownProfile?.companyId ?? 'default';
    const extras: Partial<CompanyData> = {
      department: data.department,
      province: data.province,
      district: data.district,
      facebook: data.facebook,
    };
    localStorage.setItem(`companyData:${companyId}`, JSON.stringify(extras));
  }

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

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal debe ser usado dentro de un GlobalProvider');
  }
  return context;
}

export { GlobalContext, GlobalProvider };