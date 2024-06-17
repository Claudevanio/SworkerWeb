'use client';
import { useModal } from '@/hooks';
import useTriggerEffect from '@/hooks/triggeredUseState';
import { companyUnityService, professionalService, RoleService, companyService } from '@/services';
import { equipmentService } from '@/services/Administrator/equipmentService';
import { SectorService } from '@/services/Administrator/sectorService';
import { basePagination, ICompany, ICompanyUnity, IRole, ISector, IProfessional, IEquipment, IPermissions } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useEffect, useState } from 'react';

interface baseCRUD<T, Y = basicSearchQuery> {
  data: basePagination<T> | undefined;
  isLoading: boolean;
  create: (data: T) => any;
  update: (data: T) => void;
  remove: (data: T) => void;
  setFilter: React.Dispatch<React.SetStateAction<Y>>;
  current?: T;
  selectCurrent?: (data: T, readonly?: boolean) => void;
  filters?: Y;
  readonly?: boolean;
  reset?: () => void;
}

const crudInitialState = { data: undefined, isLoading: false, create: () => {}, update: () => {}, remove: () => {}, setFilter: () => {} };

type SearchEquipment = basicSearchQuery & {
  uid?: string;
  hwid?: string;
  brand?: string;
  manufacturer?: string;
  classification?: string;
  active?: boolean;
};
interface AdministratorContextType {
  permissions: baseCRUD<IRole> & { permissions?: IPermissions[] };
  companies: baseCRUD<ICompany>;
  modal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
}

interface basicSearchQuery {
  term: string | undefined;
  page: number;
  pageSize: number;
}

export const AdministratorContext = createContext<AdministratorContextType>({
  permissions: crudInitialState,
  companies: crudInitialState,
  modal: {} as any
});

export const AdministratorProvider = ({ children }: { children: React.ReactNode }) => {
  // #region Commons
  const [isModalOpen, openModal, closeModal] = useModal();

  // #endregion

  //#region Company

  const [companyReadOnly, setCompanyReadOnly] = useState<boolean>(false);

  const [companyQueryObject, setCompanyQueryObject] = useTriggerEffect<basicSearchQuery>({
    page: 0,
    pageSize: 5,
    term: undefined
  });

  const [currentCompany, setCurrentCompany] = useState<ICompany | undefined>(undefined);

  const selectCompany = (company: ICompany, readonly = false) => {
    setCurrentCompany(company);
    setCompanyReadOnly(readonly);
  };

  const {
    isLoading: isLoadingCompanies,
    data: companies,
    refetch: refetchCompanies
  } = useQuery<basePagination<ICompany> | undefined>({
    queryKey: ['searchCompanies', companyQueryObject],
    queryFn: () => companyService.listCompanyAsync(companyQueryObject.term, companyQueryObject.page, companyQueryObject.pageSize) as any,
    refetchOnWindowFocus: false
  });

  const addCompany = async (company: ICompany) => {
    const response = await companyService.createCompanyAsync(company);
    if (response) {
      setCompanyQueryObject({ ...companyQueryObject, page: 0, term: undefined });
      refetchCompanies();
    }
  };

  const updateCompany = async (company: ICompany) => {
    await companyService.updateCompanyAsync(company);
    setCompanyQueryObject({ ...companyQueryObject, page: 0, term: undefined });
    refetchCompanies();
  };

  const removeCompany = async (company: ICompany) => {
    await companyService.removeCompanyAsync(company.id!);
    setCompanyQueryObject({ ...companyQueryObject, page: 0, term: undefined });
    refetchCompanies();
  };

  const resetCompanies = () => {
    setCompanyQueryObject({ ...companyQueryObject, page: 0, term: undefined });
    refetchCompanies();
  };

  //#endregion

  //#region Permissions
  const [currentPermission, setCurrentPermission] = useState<IRole | undefined>(undefined);

  const { isLoading, data: permissionsList } = useQuery<IPermissions[]>({
    queryKey: ['permissions'],
    queryFn: () => RoleService.getPermissions() as any,
    refetchOnWindowFocus: false
  });

  const [permissionsQueryObject, setPermissionsQueryObject] = useTriggerEffect<basicSearchQuery>({
    page: 0,
    pageSize: 5,
    term: undefined
  });

  const {
    isLoading: isLoadingPermissions,
    data: permissions,
    refetch: refetchPermissions
  } = useQuery<basePagination<IRole> | undefined>({
    queryKey: ['searchPermissions', { ...permissionsQueryObject }],
    queryFn: () => RoleService.listRolesAsync(permissionsQueryObject.term, permissionsQueryObject.page, permissionsQueryObject.pageSize) as any,
    refetchOnWindowFocus: false
  });

  const addPermission = async (permission: IRole) => {
    const response = await RoleService.addRoleAsync(permission);
    if (response) {
      setPermissionsQueryObject({ ...permissionsQueryObject, page: 0, term: undefined });
      refetchPermissions();
    }
  };

  const updatePermission = async (permission: IRole) => {
    const response = await RoleService.updateRoleAsync(permission as any);
    if (response) {
      setPermissionsQueryObject({ ...permissionsQueryObject, page: 0, term: undefined });
      refetchPermissions();
    }
  };

  const removePermission = async (permission: IRole) => {
    await RoleService.removeRoleAsync(permission as any);
    setPermissionsQueryObject({ ...permissionsQueryObject, page: 0, term: undefined });
    refetchPermissions();
  };

  const selectCurrentPermission = (permission: IRole) => {
    setCurrentPermission(permission);
  };

  const resetPermissions = () => {
    setPermissionsQueryObject({ ...permissionsQueryObject, page: 0, term: undefined });
    refetchPermissions();
  };

  //#endregion

  function handleCloseModal() {
    setCurrentCompany(undefined);
    setCurrentPermission(undefined);
    setCompanyReadOnly(false);
    closeModal();
  }

  return (
    <AdministratorContext.Provider
      value={{
        modal: {
          isOpen: isModalOpen,
          open: () => openModal(),
          close: () => handleCloseModal()
        },
        permissions: {
          data: permissions,
          isLoading: isLoadingPermissions,
          create: addPermission,
          update: updatePermission,
          remove: removePermission,
          setFilter: setPermissionsQueryObject,
          filters: permissionsQueryObject,
          current: currentPermission,
          selectCurrent: selectCurrentPermission,
          permissions: permissionsList,
          reset: resetPermissions
        },
        companies: {
          data: companies,
          isLoading: isLoadingCompanies,
          create: addCompany,
          update: updateCompany,
          remove: removeCompany,
          setFilter: setCompanyQueryObject,
          filters: companyQueryObject,
          current: currentCompany,
          selectCurrent: selectCompany,
          readonly: companyReadOnly,
          reset: resetCompanies
        }
      }}
    >
      {children}
    </AdministratorContext.Provider>
  );
};

export const useAdministrator = () => React.useContext(AdministratorContext);
