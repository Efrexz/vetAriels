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
    }]


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

    const updateUserData = (id, newData) => {
        setUsers(users.map(user => user.id === id ? { ...user, ...newData } : user));
    };

    const removeUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    //roles
    const addRole = (newRole) => {
        setRoles([...roles, newRole]);
    };

    const updateRoleData = (id, newData) => {
        setRoles(roles.map(role => role.id === id ? { ...role, ...newData } : role));
    };

    const removeRole = (id) => {
        setRoles(roles.filter(role => role.id !== id));
    };

    const [themeColor, setThemeColor] = useState(localStorage.getItem('themeColor') ? localStorage.getItem('themeColor') : 'blue');

    useEffect(() => {
        localStorage.setItem('themeColor', themeColor);
    }, [themeColor]);



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
            logout,

        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };

GlobalProvider.propTypes = {
    children: PropTypes.node
}