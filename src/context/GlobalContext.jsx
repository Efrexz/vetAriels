import { createContext, useEffect, useState } from 'react';

const GlobalContext = createContext();

function GlobalProvider({ children }) {

    const [themeColor, setThemeColor] = useState("blue");

    const [activeUser, setActiveUser] = useState(null);

    //Users Data
    const [users, setUsers] = useState(
        localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [
        ]);

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



    return (
        <GlobalContext.Provider value={{
            themeColor,
            setThemeColor,
            users,
            addUser,
            removeUser,
            updateUserData,
            roles,
            addRole,
            updateRoleData,
            removeRole,
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };