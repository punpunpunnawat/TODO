import React, { ReactNode, useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";

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
    const storedID = localStorage.getItem("userID");
    const storedEmail = localStorage.getItem("userEmail");
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

  if (initializing) return null;

    const clearGlobalData = () =>
    {
      localStorage.clear();
      setUserID("");
      setUserEmail("");
      // setTasks([]);
      setLoggedIn(false);
      // fetchTasks();
    }

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
        clearGlobalData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
