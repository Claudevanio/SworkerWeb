'use client';
import { useModal } from '@/hooks';
import useTriggerEffect from '@/hooks/triggeredUseState';
import { useUser } from '@/hooks/useUser';
import { companyUnityService, professionalService, RoleService , companyService} from '@/services'; 
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
}
interface GestaoContextType { 
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

export const GestaoContext = createContext<GestaoContextType>({ 
  companyUnities: crudInitialState,
  professionals: crudInitialState,
  sectors: crudInitialState,
  equipments: crudInitialState,
  modal: { 
  } as any
 });

export const GestaoProvider = ({ children }: { children: React.ReactNode }) => { 

  // #region Commons
  const [isModalOpen, openModal, closeModal] = useModal()

  const {
    currentCompany
  } = useUser();

  // #endregion
 
  //#region CompanyUnities

    const [currentCompanyUnity, setCurrentCompanyUnity] = useState<ICompanyUnity | undefined>(undefined);
    const [companyUnityReadOnly, setCompanyUnityReadOnly] = useState<boolean>(false);
    
    const [companyUnityQueryObject, setCompanyUnityQueryObject] = useTriggerEffect<basicSearchQuery>({
      page: 0,
      pageSize: 3,
      term: undefined,
    });

    const { isLoading: isLoadingCompanyUnities, data: companyUnities, refetch: refetchCompanyUnits } = useQuery<basePagination<ICompanyUnity> | undefined>({
      queryKey: ['searchCompanyUnities', companyUnityQueryObject, currentCompany?.id],
      queryFn: () => companyUnityService.listUnitiesByCompanyAsync({
        companyId: currentCompany?.id!,
        term: companyUnityQueryObject.term,
        currentPage: companyUnityQueryObject.page,
        pageSize: companyUnityQueryObject.pageSize,
      }) as any,
      refetchOnWindowFocus: false,
      enabled: !!currentCompany,
    });

    const selectCompanyUnity = (companyUnity: ICompanyUnity, readonly = false) => {
      setCurrentCompanyUnity(companyUnity);
      setCompanyUnityReadOnly(readonly);
    }

    const addCompanyUnity = async (companyUnity: ICompanyUnity) => {
      const response = await companyUnityService.createCompanyUnityAsync(companyUnity);
      if (response) {
        setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0, term: undefined });
        refetchCompanyUnits();
      }
    }

    const updateCompanyUnity = async (companyUnity: ICompanyUnity) => {
      await companyUnityService.updateCompanyUnityAsync(companyUnity);
      setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0, term: undefined });
      refetchCompanyUnits();
    }

    const removeCompanyUnity = async (companyUnity: ICompanyUnity) => {
      await companyUnityService.removeCompanyUnityAsync(companyUnity.id!);
      setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0, term: undefined });
      refetchCompanyUnits();
    }

    const inactivateCompanyUnity = async (companyUnity: ICompanyUnity) => {
      await companyUnityService.inactivateCompanyUnityAsync(companyUnity.id!);
      setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0, term: undefined });
      refetchCompanyUnits();
    }

    const resetCompanyUnities = () => {
      setCompanyUnityQueryObject({ ...companyUnityQueryObject, page: 0, term: undefined });
      refetchCompanyUnits();
    }

  //#endregion

  //#region Professionals 
  const [professionalReadOnly, setProfessionalReadOnly] = useState<boolean>(false);
  
  const [currentProfessional, setCurrentProfessional] = useState<IProfessional | undefined>(undefined);


  const [professionalQueryObject, setProfessionalQueryObject] = useTriggerEffect<basicSearchQuery>({
    page: 0,
    pageSize: 3,
    term: undefined,
  });

  const { isLoading: isLoadingProfessionals, data: professionals, refetch: professionalsRefetch } = useQuery<basePagination<IProfessional> | undefined>({
    queryKey: ['searchProfessionals', professionalQueryObject, currentCompany?.id],
    queryFn: () => professionalService.listProfessionalAsync({
      pageSize: professionalQueryObject.pageSize,
      currentPage: professionalQueryObject.page,
      term: professionalQueryObject.term,
      companyId: currentCompany?.id!,
    }) as any,
    refetchOnWindowFocus: false,
    enabled: !!currentCompany?.id,
  });

  const selectProfessional = (professional: IProfessional, readonly = false) => {
    setCurrentProfessional(professional);
    setProfessionalReadOnly(readonly);
  }

  const addProfessional = async (professional: IProfessional) => {
    const response = await professionalService.addProfessionalAsync(currentCompany?.id!, professional);
    if (response) {
      setProfessionalQueryObject({ ...professionalQueryObject, page: 0, term: undefined });
      professionalsRefetch();
    }
    return response;
  }

  const updateProfessional = async (professional: IProfessional) => {
    await professionalService.updateProfessionalAsync(currentCompany?.id!, professional);
    setProfessionalQueryObject({ ...professionalQueryObject, page: 0, term: undefined });
    professionalsRefetch();
  }

  const removeProfessional = async (professional: IProfessional) => {
    console.log(professional);
    // await professionalService.(currentUnityId, professional.id!);
    // setProfessionalQueryObject({ ...professionalQueryObject, page: 0, term: undefined });
  } 

  const resetProfessionals = () => {
    setProfessionalQueryObject({ ...professionalQueryObject, page: 0, term: undefined });
    professionalsRefetch();
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

    const { isLoading: isLoadingSectors, data: sectors, refetch: refetchSector } = useQuery<basePagination<ISector> | undefined>({
      queryKey: ['searchSectors', sectorQueryObject, currentCompany?.id],
      queryFn: () => SectorService.listSectorByCompanyAsync({
        page: sectorQueryObject.page,
        pageSize: sectorQueryObject.pageSize,
        term: sectorQueryObject.term,
        companyId: currentCompany?.id!,
      }),
      refetchOnWindowFocus: false,
      enabled: !!currentCompany,
    });
    

    const selectSector = (sector: ISector, readonly = false) => {
      setCurrentSector(sector);
      setSectorReadOnly(readonly);
    }

    const addSector = async (sector: ISector) => {
      const response = await SectorService.createSectorAsync(sector);
      if (response) {
        setSectorQueryObject({ ...sectorQueryObject, page: 0, term: undefined });
      }
      refetchSector();
    }

    const updateSector = async (sector: ISector) => {
      await SectorService.updateSectorAsync(sector);
      setSectorQueryObject({ ...sectorQueryObject, page: 0, term: undefined });
      refetchSector();
    }

    const removeSector = async (sector: ISector) => {
      await SectorService.removeSectorAsync(sector.id!);
      setSectorQueryObject({ ...sectorQueryObject, page: 0, term: undefined });
      refetchSector();
    } 

    const resetSectors = () => {
      setSectorQueryObject({ ...sectorQueryObject, page: 0, term: undefined });
      refetchSector();
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
      queryKey: ['searchEquipments', equipmentQueryObject, currentCompany?.id],
      queryFn: () => equipmentService.getEquipmentsByCompanyAsync({
        ...equipmentQueryObject,
        currentPage: equipmentQueryObject.page,
        companyId: currentCompany?.id!,
      }) as any,
      refetchOnWindowFocus: false,
      enabled: !!currentCompany,
    });

    const selectEquipment = (equipment: IEquipment, readonly = false) => {
      setCurrentEquipment(equipment);
      setEquipmentReadOnly(readonly);
    }

    const addEquipment = async (equipment: IEquipment) => {
      const response = await equipmentService.createEquipmentAsync(equipment);
      if (response) {
        setEquipmentQueryObject({ ...equipmentQueryObject, page: 0, term: undefined });
        refetchEquipments();
      }
    }

    const updateEquipment = async (equipment: IEquipment) => {
      await equipmentService.updateEquipmentAsync(equipment);
      setEquipmentQueryObject({ ...equipmentQueryObject, page: 0, term: undefined });
      refetchEquipments();
    }

    const removeEquipment = async (equipment: IEquipment) => { 
      console.log(equipment)
      await equipmentService.removeEquipmentAsync(equipment.id!);
      setEquipmentQueryObject({ ...equipmentQueryObject, page: 0, term: undefined });
      refetchEquipments();
    }

    const resetEquipments = () => {
      setEquipmentQueryObject({ ...equipmentQueryObject, page: 0, term: undefined });
      refetchEquipments();
    }


  //#endregion

  function handleCloseModal() { 
    setCurrentCompanyUnity(undefined); 
    setCompanyUnityReadOnly(false);
    setCurrentCompanyUnity(undefined);
    setCurrentSector(undefined);
    setSectorReadOnly(false);
    setCurrentProfessional(undefined);
    setProfessionalReadOnly(false);
    setCurrentEquipment(undefined);
    setSectorReadOnly(false);
    setEquipmentReadOnly(false);
    closeModal();    
  }
  
  return (
    <GestaoContext.Provider value= {{
      modal: {
        isOpen: isModalOpen,
        open: () => openModal(),
        close: () => handleCloseModal(),
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
        reset: resetCompanyUnities,
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
        reset: resetProfessionals,
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
        reset: resetSectors,
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
        reset: resetEquipments,
      },
      
      
    }}>
  { children }
    </GestaoContext.Provider>
  );
};

export const useGestao = () => React.useContext(GestaoContext);