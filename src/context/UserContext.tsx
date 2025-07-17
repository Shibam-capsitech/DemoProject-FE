import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
}

interface UserContextType {
  id: string | null;
  email: string | null;
  username: string | null;
  role: string | null;
  setUser: React.Dispatch<React.SetStateAction<UserContextType>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContextType>({
    id: null,
    email: null,
    username: null,
    role: null,
    setUser: () => {}, 
  });
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        setUser(prev => ({
          ...prev,
          id: decoded.sub,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
        }));
        console.log("UserContext initialized from token:", decoded);
      } catch (err) {
        console.error('Invalid token', err);
        setUser(prev => ({
          ...prev,
          id: null,
          email: null,
          username: null,
          role: null,
        }));
      }
    } else {
      setUser(prev => ({
        ...prev,
        id: null,
        email: null,
        username: null,
        role: null,
      }));
    }
  }, []);

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
