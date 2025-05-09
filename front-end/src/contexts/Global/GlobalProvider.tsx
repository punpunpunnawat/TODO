import React, { ReactNode, useEffect, useState } from 'react';
import { GlobalContext } from './GlobalContext';

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [userID, setUserID] = useState<string>("");
    const [darkModeActive, setDarkModeActive] = useState<boolean>(false);

    useEffect(() => {

         const storedID = localStorage.getItem('userID');
        if (storedID) {
                    console.log("i found! "+storedID)
            setUserID(storedID); // Restore to context on startup
        }
    }, []);

    console.log(userID)
    return (
        <GlobalContext.Provider
            value={{
                userID,
                darkModeActive,
                setUserID,
                setDarkModeActive
            }}
            >
            {children}
        </GlobalContext.Provider>
    );
};
