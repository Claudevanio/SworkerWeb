'use client';
import { ICompany } from '@/types';
import { IUser } from '@/types/models/IUser';
import { jwtDecode } from 'jwt-decode';
import React, { createContext } from 'react';
import Cookies from 'js-cookie';



interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void; 
}

export const UserContext = createContext<UserContextType>({ user: null, setUser: () => { } });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    const token = Cookies.get('token');
    debugger;
    if (token && typeof token === 'string') {
      const decodedToken = jwtDecode(token) as IUser;
      setUser(decodedToken);
    }
  }, []);
  
  return (
    <UserContext.Provider value= {{ user, 
      setUser
    }}>
      { children }
    </UserContext.Provider>
  );
};
