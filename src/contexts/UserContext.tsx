'use client';
import { basePagination, ICompany } from '@/types';
import { IUser } from '@/types/models/IUser';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api, Authservice, companyService } from '@/services';
import { useDialog } from '@/hooks/use-dialog';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Dropdown, Form, Modal } from '@/components';
import { useModal } from '@/hooks';
import { set, useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  updateUser: (user: IUser) => void;
  currentCompany: ICompany | null;
  companiesList: ICompany[];
  selectCompany: () => void;
  refetchCompany: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  updateUser: () => {},
  currentCompany: null,
  selectCompany: () => {},
  companiesList: [],
  refetchCompany: () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const [currentCompany, setCurrentCompany] = React.useState<ICompany | null>(null);
  const { confirmDialog } = useDialog();
  const router = useRouter();
  const pathname = usePathname();

  const params = useParams();

  const [isModalOpen, openModal, closeModal] = useModal();

  React.useEffect(() => {
    if (pathname === '/login' || pathname === '/esqueci-senha') return;

    api.interceptors.request.use(config => {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          setUser(null);
          Cookies.remove('token');
          if (pathname === '/login' || pathname === '/esqueci-senha') return;

          confirmDialog({
            title: 'Sessão expirada',
            message: 'Sua sessão expirou, por favor faça login novamente',
            onConfirmText: 'Fazer login',
            onCloseText: ' ',
            onConfirm: () => {
              process.env.NODE_ENV === 'development'
                ? Authservice.login({
                    userName: 'ivoxps@gmail.com',
                    password: '#3dP3R@5wk0R'
                  }).then(response => {
                    if (typeof response.data === 'string') {
                      Cookies.set('token', response.data);
                      router.refresh();
                      return;
                    }
                  })
                : router.push('/login');
            }
          });
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const token = Cookies.get('token');

  const updateUser = (user: IUser) => {
    setUser(user);
    Cookies.set('user', JSON.stringify(user));
  };

  const cachedCompany = Cookies.get('currentCompany');

  const {
    isLoading: isLoadingCompanies,
    data: companies,
    refetch: refetchCompanies
  } = useQuery<ICompany[]>({
    queryKey: ['searchCompanies-UserProvider'],
    queryFn: () => companyService.getAll() as any,
    refetchOnWindowFocus: false,
    enabled: token && token?.length > 0
  });

  const methods = useForm<{ company: string }>({
    defaultValues: {
      company: currentCompany?.id ?? ''
    }
  });

  React.useEffect(() => {
    const cachedCompany = Cookies.get('currentCompany');
    const { companyId } = params;

    if ((cachedCompany && !companyId) || (cachedCompany && companyId == JSON.parse(cachedCompany)?.id)) {
      const company = JSON.parse(cachedCompany) as ICompany;
      setCurrentCompany(company);
      return;
    }

    if (companyId && companies) {
      const company = companies?.find(c => c.id == companyId);
      if (company) {
        setCurrentCompany(company);
        Cookies.set('currentCompany', JSON.stringify(company));
        return;
      }
    }
    if (companies) openModal();
  }, [params, companies]);

  const changeEmpresaId = newEmpresaId => {
    const currentPath = pathname;
    const newPath = currentPath.replace(/\/empresa\/\d+/, `/empresa/${newEmpresaId}`);
    router.replace(newPath);
  };

  const selectCompany = (company: ICompany | null) => {
    Cookies.set('currentCompany', JSON.stringify(company));
    if (pathname.includes('/empresa/')) {
      changeEmpresaId(company.id);
    }
    setCurrentCompany(company);
  };

  React.useEffect(() => {
    if (!!user) return;
    const localUser = Cookies.get('user');

    if (localUser) {
      const user = JSON.parse(localUser) as IUser;
      setUser(user);
      return;
    }
    // const token = Cookies.get('token');
    if (token) {
      const user = jwtDecode(token) as IUser;
      setUser(user);
      refetchCompanies();
    }
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, currentCompany, selectCompany: openModal, companiesList: companies,
      refetchCompany: refetchCompanies
     }}>
      {children}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Selecione uma empresa">
        <Form
          {...methods}
          onSubmit={methods.handleSubmit(data => {
            const company = companies?.find(c => c.id === data.company);
            if (!company) return;
            selectCompany(company);
            closeModal();
          })}
        >
          <Dropdown name="company" label="Empresa" options={companies?.map(c => ({ label: c.name, value: c.id })) ?? []} />
          <Button className="w-full mt-4" type="submit">
            Selecionar
          </Button>
        </Form>
      </Modal>
    </UserContext.Provider>
  );
};
