// src/context/UserContext.tsx
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContextType>({
    id: null,
    email: null,
    username: null,
    role: null,
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        setUser({
          id: decoded.sub,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
        });

        console.log("UserContext loaded:", decoded); 

      } catch (err) {
        console.error('Invalid token', err);
        setUser({ id: null, email: null, username: null, role: null });
      }
    }
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
