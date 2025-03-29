import { createContext, useEffect, useState } from 'react';
import PropTypes from "prop-types";

const GlobalContext = createContext();

function GlobalProvider({ children }) {
    //buscamos si existe un usuario activo en localStorage para el recargar la pagina no perder la sesion
    const [activeUser, setActiveUser] = useState(localStorage.getItem('activeUser') ? JSON.parse(localStorage.getItem('activeUser')) : null);

    const logout = () => {
        setActiveUser(null);
        localStorage.removeItem('activeUser');
    };

    const defaultUser = [{
        active: true,
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

    const defaultCompanyData = {
        clinicName: "VETERINARIA ARIEL´S EIRL",
        email: "vetariel@gmail.com",
        department: "LIMA",
        province: "LIMA",
        district: "LIMA",
        address: "Av. de la Constitución, No. 100, Lima",
        phone: "917104426",
        facebook: "https://www.facebook.com/vetariel/"
    };

    //sideBarMenu
    //estado para saber cuando esta abierto el menu y poder aplicar el responsive
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    //NavBar 
    const [showPatientList, setShowPatientList] = useState(false);
    const [showBathList, setShowBathList] = useState(false);
    const [activeIcon, setActiveIcon] = useState(null); // Verificar cual icono está activo
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showUserOptions, setShowUserOptions] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [isMobileScreen, setIsMobileScreen] = useState(false);//verificar si estamos en una pantalla pequeña y cambiar el comportamiento de la barra de búsqueda

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
    //cuando abrimos el menu de pacientes se desactivan las otras opciones
    const togglePatientList = () => {
        setShowPatientList(!showPatientList);
        setShowBathList(false);
        setShowUserOptions(false);
        setActiveIcon(showPatientList ? null : 'patients');
    };

    //cuando abrimos el menu de baños se desactivan las otras opciones
    const toggleBathList = () => {
        setShowBathList(!showBathList);
        setShowPatientList(false);
        setShowUserOptions(false);
        setActiveIcon(showBathList ? null : 'baths');
    };
    //cuando abrimos el menu de usuario se desactivan las otras opciones
    const toggleUserOptions = () => {
        setShowUserOptions(!showUserOptions);
        setIsSidebarOpen(false);
        setShowBathList(false);
        setShowPatientList(false);
        setActiveIcon(showUserOptions ? null : 'user');
    };
    //cuando abrimos el buscador se desactivan las otras opciones
    const toggleSearchModal = () => {
        toggleSearchInput();
        setIsSidebarOpen(false);
        setShowPatientList(false);
        setShowUserOptions(false);
        setShowBathList(false);
        setActiveIcon(null)
    }

    const toggleSideMenu = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setShowPatientList(false);
        setShowUserOptions(false);
        setShowBathList(false);

    }



    //Users Data
    const [users, setUsers] = useState(
        localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : defaultUser);

    //Roles Data
    const [roles, setRoles] = useState(
        localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : [
        ]);

    // Guardar en localStorage cada vez que cambien los estados
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('roles', JSON.stringify(roles));
    }, [roles]);

    //users
    const addUser = (newUser) => {
        setUsers([...users, newUser]);
    };

    function updateUserData(id, newData) {
        setUsers(users.map(user => user.id === id ? { ...user, ...newData } : user));
        //si el usuario actual es el que se está actualizando, actualizamos la informacion del active user para que se refleje en la interfaz
        if (activeUser && activeUser.id === id) {
            setActiveUser({ ...activeUser, ...newData });
        }
    }

    function removeUser(id) {
        setUsers(users.filter(user => user.id !== id));
    }

    //roles
    function addRole(newRole) {
        setRoles([...roles, newRole]);
    }

    function updateRoleData(id, newData) {
        setRoles(roles.map(role => role.id === id ? { ...role, ...newData } : role));
    }

    function removeRole(id) {
        setRoles(roles.filter(role => role.id !== id));
    }

    const [themeColor, setThemeColor] = useState(localStorage.getItem('themeColor') ? localStorage.getItem('themeColor') : 'blue');
    const [companyData, setCompanyData] = useState(localStorage.getItem('companyData') ? JSON.parse(localStorage.getItem('companyData')) : defaultCompanyData);

    useEffect(() => {
        localStorage.setItem('activeUser', JSON.stringify(activeUser));
    }, [activeUser]);

    useEffect(() => {
        localStorage.setItem('themeColor', themeColor);
    }, [themeColor]);

    useEffect(() => {
        localStorage.setItem('companyData', JSON.stringify(companyData));
    }, [companyData]);



    return (
        <GlobalContext.Provider value={{
            themeColor,
            setThemeColor,
            activeUser,
            setActiveUser,
            users,
            addUser,
            removeUser,
            updateUserData,
            roles,
            addRole,
            updateRoleData,
            removeRole,
            companyData,
            setCompanyData,
            logout,
            isSidebarOpen,
            setIsSidebarOpen,
            toggleSearchModal,
            togglePatientList,
            toggleBathList,
            toggleUserOptions,
            toggleSideMenu,
            activeIcon,
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
            setActiveIcon,
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };

GlobalProvider.propTypes = {
    children: PropTypes.node
}