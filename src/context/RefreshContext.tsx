import React, { createContext, useState, useContext } from "react";

const RefreshContext = createContext({
  refresh: false,
  toggleRefresh: () => {},
});

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = () => setRefresh((prev) => !prev);

  return (
    <RefreshContext.Provider value={{ refresh, toggleRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
