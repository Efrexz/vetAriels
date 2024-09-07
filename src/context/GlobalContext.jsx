import { createContext, useState } from 'react';

const GlobalContext = createContext();

function GlobalProvider({ children }) {

    const [themeColor, setThemeColor] = useState("blue");

    return (
        <GlobalContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };