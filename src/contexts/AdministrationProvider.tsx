'use client';
import { useModal } from '@/hooks';
import useTriggerEffect from '@/hooks/triggeredUseState';
import { companyUnityService, professionalService, RoleService , companyService} from '@/services'; 
import { equipmentService } from '@/services/Administrator/equipmentService';
import { SectorService } from '@/services/Administrator/sectorService';
import { basePagination, ICompany, ICompanyUnity, IRole, ISector, IProfessional, IEquipment, IPermissions } from '@/types'; 
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useEffect, useState } from 'react'; 

interface baseCRUD<T, Y = basicSearchQuery> {
  data: basePagination<T> | undefined;
  isLoading: boolean;
  create: (data: T) => void;
  update: (data: T) => void;
  remove: (data: T) => void;
  setFilter: React.Dispatch<React.SetStateAction<Y>>;
  current?: T;
  selectCurrent?: (data: T, readonly?: boolean) => void;
  filters?: Y;
  readonly?: boolean;
}

const crudInitialState = { data: undefined, isLoading: false, create: () => {}, update: () => {}, remove: () => {}, setFilter: () => {} };

type SearchEquipment = basicSearchQuery & {
  uid?: string;
  hwid?: string;
  brand?: string;
  manufacturer?: string;
  classification?: string;
  active?: boolean;
}
interface AdministratorContextType {
  permissions: baseCRUD<IRole> & {permissions?: IPermissions[]};
  companies: baseCRUD<ICompany>;
  companyUnities: baseCRUD<ICompanyUnity> & { inactivate?: (companyUnity: ICompanyUnity) => void };
  professionals: baseCRUD<IProfessional>;
  modal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  }
  sectors: baseCRUD<ISector>;
  equipments: baseCRUD<IEquipment, SearchEquipment>;
}

interface basicSearchQuery { 
  term: string | undefined; 
  page: number;
  pageSize: number; 
}

export const AdministratorContext = createContext<AdministratorContextType>({
  permissions: crudInitialState ,
  companies: crudInitialState,
  companyUnities: crudInitialState,
  professionals: crudInitialState,
  sectors: crudInitialState,
  equipments: crudInitialState,
  modal: { 
  } as any
 });

export const AdministratorProvider = ({ children }: { children: React.ReactNode }) => { 

  // #region Commons
  const [isModalOpen, openModal, closeModal] = useModal()

  // #endregion

  //#region Company

  const [companyReadOnly, setCompanyReadOnly] = useState<boolean>(false);

  const [companyQueryObject, setCompanyQueryObject] = useTriggerEffect<basicSearchQuery>({ 
    page: 0,
    pageSize: 5, 
    term: undefined,
  });

  const [currentCompany, setCurrentCompany] = useState<ICompany | undefined>(undefined);

  const selectCompany = (company: ICompany, readonly = false) => {
    setCurrentCompany(company);
    setCompanyReadOnly(readonly);
  }

  const { isLoading: isLoadingCompanies, data: companies,
    refetch: refetchCompanies
   } = useQuery<basePagination<ICompany> | undefined>({
    queryKey: ['searchCompanies', companyQueryObject],
    queryFn: () => companyService.listCompanyAsync(companyQueryObject.term, companyQueryObject.page, companyQueryObject.pageSize) as any,
    refetchOnWindowFocus: false,
  });

  const addCompany = async (company: ICompany) => {
    const response = await companyService.createCompanyAsync(company);
    if (response) {
      setCompanyQueryObject({ ...companyQueryObject, page: 0 });
      refetchCompanies();
    }
  }

  const updateCompany = async (company: ICompany) => {
    await companyService.updateCompanyAsync(company);
    setCompanyQueryObject({ ...companyQueryObject, page: 0 });
    refetchCompanies();
  }

  const removeCompany = async (company: ICompany) => {
    await companyService.removeCompanyAsync(company.id!);
    setCompanyQueryObject({ ...companyQueryObject, page: 0 });
    refetchCompanies();
  }

  //#endregion

  //#region Permissions
    const [currentPermission, setCurrentPermission] = useState<IRole | undefined>(undefined);

    const {isLoading, data: permissionsList} = useQuery<IPermissions[]>({
      queryKey: ['permissions'],
      queryFn: () => RoleService.getPermissions() as any,
      refetchOnWindowFocus: false,
    });

    const [permissionsQueryObject, setPermissionsQueryObject] = useTriggerEffect<basicSearchQuery>({
      page: 0,
      pageSize: 5,
      term: undefined,
    });
 
    
    const { isLoading: isLoadingPermissions, data: permissions, refetch: refetchPermissions } = useQuery<basePagination<IRole> | undefined>({
      queryKey: ['searchPermissions', {...permissionsQueryObject}],
      queryFn: () => RoleService.listRolesAsync(permissionsQueryObject.term, permissionsQueryObject.page, permissionsQueryObject.pageSize) as any,
      refetchOnWindowFocus: false,
    });
    

    const addPermission = async (permission: IRole) => {
      const response = await RoleService.addRoleAsync(permission); 
      if (response) {
        setPermissionsQueryObject({ ...permissionsQueryObject, page: 0 });
        refetchPermissions();
      }
    }


    const updatePermission = async (permission: IRole) => {
      const response = await RoleService.updateRoleAsync(permission as any);
      if (response) {
        setPermissionsQueryObject({ ...permissionsQueryObject, page: 0 });
        refetchPermissions();
      }
    }

    const removePermission = async (permission: IRole) => {
      await RoleService.removeRoleAsync(permission as any);
      setPermissionsQueryObject({ ...permissionsQueryObject, page: 0 });
      refetchPermissions();
    }

    const selectCurrentPermission = (permission: IRole) => { 
      setCurrentPermission(permission);
    }
    
  //#endregion

  //#region CompanyUnities

    const [currentCompanyUnity, setCurrentCompanyUnity] = useState<ICompanyUnity | undefined>(undefined);
    const [companyUnityReadOnly, setCompanyUnityReadOnly] = useState<boolean>(false);
    
    const [companyUnityQueryObject, setCompanyUnityQueryObject] = useTriggerEffect<basicSearchQuery>({
      page: 0,
      pageSize: 3,
      term: undefined,
    });

    const { isLoading: isLoadingCompanyUnities, data: companyUnities, refetch: refetchCompanyUnits } = useQuery<basePagination<ICompanyUnity> | undefined>({
      queryKey: ['searchCompanyUnities', companyUnityQueryObject],
      queryFn: () => companyUnityService.listCompanyUnityAsync(companyUnityQueryObject.term, companyUnityQueryObject.page, companyUnityQueryObject.pageSize) as any,
      refetchOnWindowFocus: false,
    });

    const selectCompanyUnity = (companyUnity: ICompanyUnity, readonly = false) => {
      setCurrentCompanyUnity(companyUnity);
      setCompanyUnityReadOnly(readonly);
    }

    const addCompanyUnity = async (companyUnity: ICompanyUnity) => {
      const response = await companyUnityService.createCompanyUnityAsync(companyUnity);
      if (response) {
        setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0 });
        refetchCompanyUnits();
      }
    }

    const updateCompanyUnity = async (companyUnity: ICompanyUnity) => {
      await companyUnityService.updateCompanyUnityAsync(companyUnity);
      setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0 });
      refetchCompanyUnits();
    }

    const removeCompanyUnity = async (companyUnity: ICompanyUnity) => {
      await companyUnityService.removeCompanyUnityAsync(companyUnity.id!);
      setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0 });
      refetchCompanyUnits();
    }

    const inactivateCompanyUnity = async (companyUnity: ICompanyUnity) => {
      await companyUnityService.inactivateCompanyUnityAsync(companyUnity.id!);
      setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0 });
      refetchCompanyUnits();
    }

  //#endregion

  //#region Professionals
  

  const currentUnityId = '1';

  const [professionalReadOnly, setProfessionalReadOnly] = useState<boolean>(false);
  
  const [currentProfessional, setCurrentProfessional] = useState<IProfessional | undefined>(undefined);


  const [professionalQueryObject, setProfessionalQueryObject] = useTriggerEffect<basicSearchQuery>({
    page: 0,
    pageSize: 3,
    term: undefined,
  });

  const { isLoading: isLoadingProfessionals, data: professionals } = useQuery<basePagination<IProfessional> | undefined>({
    queryKey: ['searchProfessionals', professionalQueryObject],
    queryFn: () => professionalService.listProfessionalAsync({
      pageSize: professionalQueryObject.pageSize,
      currentPage: professionalQueryObject.page,
      term: professionalQueryObject.term,
      companyId: currentUnityId,
    }) as any,
    refetchOnWindowFocus: false,
  });

  const selectProfessional = (professional: IProfessional, readonly = false) => {
    setCurrentProfessional(professional);
    setProfessionalReadOnly(readonly);
  }

  const addProfessional = async (professional: IProfessional) => {
    const response = await professionalService.addProfessionalAsync(currentUnityId, professional);
    if (response) {
      setProfessionalQueryObject({ ...professionalQueryObject, page: 0 });
    }
  }

  const updateProfessional = async (professional: IProfessional) => {
    await professionalService.updateProfessionalAsync(currentUnityId, professional);
    setProfessionalQueryObject({ ...professionalQueryObject, page: 0 });
  }

  const removeProfessional = async (professional: IProfessional) => {
    console.log(professional);
    // await professionalService.(currentUnityId, professional.id!);
    // setProfessionalQueryObject({ ...professionalQueryObject, page: 0 });
  } 

  
    
  //#endregion
  
  //#region Sector
    const [currentSector, setCurrentSector] = useState<ISector | undefined>(undefined);
    const [sectorReadOnly, setSectorReadOnly] = useState<boolean>(false);

    const [sectorQueryObject, setSectorQueryObject] = useTriggerEffect<basicSearchQuery>({
      page: 0,
      pageSize: 3,
      term: undefined,
    });

    const { isLoading: isLoadingSectors, data: sectors } = useQuery<basePagination<ISector> | undefined>({
      queryKey: ['searchSectors', sectorQueryObject],
      queryFn: () => SectorService.listSectorAsync(sectorQueryObject.term, sectorQueryObject.page, sectorQueryObject.pageSize) as any,
      refetchOnWindowFocus: false,
    });

    const selectSector = (sector: ISector, readonly = false) => {
      setCurrentSector(sector);
      setSectorReadOnly(readonly);
    }

    const addSector = async (sector: ISector) => {
      const response = await SectorService.createSectorAsync(sector);
      if (response) {
        setSectorQueryObject({ ...sectorQueryObject, page: 0 });
      }
    }

    const updateSector = async (sector: ISector) => {
      await SectorService.updateSectorAsync(sector);
      setSectorQueryObject({ ...sectorQueryObject, page: 0 });
    }

    const removeSector = async (sector: ISector) => {
      await SectorService.removeSectorAsync(sector.id!);
      setSectorQueryObject({ ...sectorQueryObject, page: 0 });
    } 
    
  //#endregion

  //#region Equipment
    
    const [currentEquipment, setCurrentEquipment] = useState<IEquipment | undefined>(undefined);
    const [equipmentReadOnly, setEquipmentReadOnly] = useState<boolean>(false);

    const [equipmentQueryObject, setEquipmentQueryObject] = useTriggerEffect<SearchEquipment>({
      page: 0,
      pageSize: 5,
      term: undefined,
    });

    const { isLoading: isLoadingEquipments, data: equipments, 
      refetch: refetchEquipments
     } = useQuery<basePagination<IEquipment> | undefined>({
      queryKey: ['searchEquipments', equipmentQueryObject],
      queryFn: () => equipmentService.getEquipmentsAsync({
        ...equipmentQueryObject,
        currentPage: equipmentQueryObject.page,
      }) as any,
      refetchOnWindowFocus: false,
    });

    const selectEquipment = (equipment: IEquipment, readonly = false) => {
      setCurrentEquipment(equipment);
      setEquipmentReadOnly(readonly);
    }

    const addEquipment = async (equipment: IEquipment) => {
      const response = await equipmentService.createEquipmentAsync(equipment);
      if (response) {
        setEquipmentQueryObject({ ...equipmentQueryObject, page: 0 });
        refetchEquipments();
      }
    }

    const updateEquipment = async (equipment: IEquipment) => {
      await equipmentService.updateEquipmentAsync(equipment);
      setEquipmentQueryObject({ ...equipmentQueryObject, page: 0 });
      refetchEquipments();
    }

    const removeEquipment = async (equipment: IEquipment) => { 
      console.log(equipment)
      await equipmentService.removeEquipmentAsync(equipment.id!);
      setEquipmentQueryObject({ ...equipmentQueryObject, page: 0 });
      refetchEquipments();
    }


  //#endregion

  function handleCloseModal() {
    setCurrentCompany(undefined);
    setCurrentCompanyUnity(undefined);
    setCurrentPermission(undefined);
    setCompanyReadOnly(false);
    setCompanyUnityReadOnly(false);
    setCurrentCompanyUnity(undefined);
    setCurrentSector(undefined);
    setSectorReadOnly(false);
    setCurrentProfessional(undefined);
    setProfessionalReadOnly(false);
    setCurrentEquipment(undefined);
    setEquipmentReadOnly(false);
    closeModal();    
  }
  
  return (
    <AdministratorContext.Provider value= {{
      modal: {
        isOpen: isModalOpen,
        open: () => openModal(),
        close: () => handleCloseModal(),
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
        permissions: permissionsList
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
      },
      companyUnities: {
        data: companyUnities,
        isLoading: isLoadingCompanyUnities,
        create: addCompanyUnity,
        update: updateCompanyUnity,
        remove: removeCompanyUnity,
        setFilter: setCompanyUnityQueryObject,
        inactivate: inactivateCompanyUnity,
        filters: companyUnityQueryObject,
        current: currentCompanyUnity,
        selectCurrent: selectCompanyUnity,
        readonly: companyUnityReadOnly,
      },    
      professionals: {
        data: professionals,
        isLoading: isLoadingProfessionals,
        create: addProfessional,
        update: updateProfessional,
        remove: removeProfessional,
        setFilter: setProfessionalQueryObject,
        filters: professionalQueryObject,
        current: currentProfessional,
        selectCurrent: selectProfessional,
        readonly: professionalReadOnly,
      },
      sectors: {
        data: sectors,
        isLoading: isLoadingSectors,
        create: addSector,
        update: updateSector,
        remove: removeSector,
        setFilter: setSectorQueryObject,
        filters: sectorQueryObject,
        current: currentSector,
        selectCurrent: selectSector,
        readonly: sectorReadOnly,
      },
      equipments: {
        data: equipments,
        isLoading: isLoadingEquipments,
        create: addEquipment,
        update: updateEquipment,
        remove: removeEquipment,
        setFilter: setEquipmentQueryObject,
        filters: equipmentQueryObject,
        current: currentEquipment,
        selectCurrent: selectEquipment,
        readonly: equipmentReadOnly,
      },
      
      
    }}>
  { children }
    </AdministratorContext.Provider>
  );
};

export const useAdministrator = () => React.useContext(AdministratorContext);