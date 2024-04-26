"use client";
import { ICompany } from "@/types";
import { IUser } from "@/types/models/IUser";
import { jwtDecode } from "jwt-decode";
import React, { createContext } from "react";
import Cookies from "js-cookie";
import { api, Authservice } from "@/services";
import { useDialog } from "@/hooks/use-dialog";
import { usePathname, useRouter } from "next/navigation";

interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const { confirmDialog } = useDialog();
  const router = useRouter();

  React.useEffect(() => {
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          Cookies.remove("token");
          confirmDialog({
            title: "Sessão expirada",
            message: "Sua sessão expirou, por favor faça login novamente",
            onConfirmText: "Fazer login",
            onCloseText: " ",
            onConfirm: () => {
              process.env.NODE_ENV === "development" ?
              Authservice.login({
                userName: "ivoxps@gmail.com",
                password: "#3dP3R@5wk0R",
              }).then((response) => {
                if (typeof response.data === "string") {
                  Cookies.set("token", response.data);
                  router.refresh();
                  return;
                }
              }) :
              router.push('/login');
            },
          });
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const token = Cookies.get("token"); 

  React.useEffect(() => {
    if (!!user) return;

    // const token = Cookies.get('token');
    if (token) {
      const user = jwtDecode(token) as IUser;
      setUser(user);
    }
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

