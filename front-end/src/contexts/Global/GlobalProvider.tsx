import React, { ReactNode, useEffect, useState } from 'react';
import { GlobalContext } from './GlobalContext';

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [userID, setUserID] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [darkModeActive, setDarkModeActive] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [initializing, setInitializing] = useState<boolean>(true);

    useEffect(() => {
        const storedID = localStorage.getItem('userID');
        const storedEmail = localStorage.getItem('userEmail');
        if (storedID) {
            setUserID(storedID);
            setLoggedIn(true);
        }
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
        setInitializing(false);
    }, []);

    useEffect(() => {
        if (userID !== "") {
            setLoggedIn(true);
        }
        setInitializing(false);
    }, [userID]);

    console.log("user email is "+userEmail)
    console.log("user id is "+userID)
    console.log("login status "+loggedIn)
  if (initializing) return null;

  return (
    <GlobalContext.Provider
      value={{
        userID,
        userEmail,
        darkModeActive,
        loggedIn,
        setUserID,
        setUserEmail,
        setDarkModeActive,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
