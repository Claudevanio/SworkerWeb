'use client';
import { useModal } from '@/hooks'; 
import { useDialog } from '@/hooks/use-dialog';
import { useUser } from '@/hooks/useUser';
import { professionalService } from '@/services';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService'; 
import { basePagination, IProfessional } from '@/types';
import { ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { createContext, useEffect, useState } from 'react'; 

 


interface ServiceOrderContextType { 
  modal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  }
  serviceOrders: {
    data: ServiceOrder[];
    isLoading: boolean;
    setFilter: React.Dispatch<React.SetStateAction<basicSearchQuery>>;
    filter: basicSearchQuery;
    changeStatus: (id: string, statusId: number, sourceId?:number) => void;
  },
  status: {
    data: Array<{
      id: number;
      description: string;
      sequence: number;
      count: number;
    }>; 
    isLoading?: boolean;
  }
  professionals: {
    data: IProfessional[];
    isLoading: boolean;
    setFilter: React.Dispatch<React.SetStateAction<{ standardSupervisor: boolean; companyId: string; }>>;
    filter: { standardSupervisor: boolean; companyId: string; };
  }
}

interface basicSearchQuery { 
  term: string | undefined; 
  page: number;
  pageSize: number; 
  start?: string;
  end?: string;
}

export const ServiceOrderContext = createContext<ServiceOrderContextType>({ 
  modal: { 
  } as any,
  serviceOrders: {
    data: undefined,
    isLoading: false,
    filter: {} as basicSearchQuery,
    setFilter: () => {},
    changeStatus: () => {},
  },
  status: {
    data: [],
    isLoading: false,
  },
  professionals: {
    data: [],
    isLoading: false,
    setFilter: () => {},
    filter: {
      standardSupervisor: true,
      companyId: ''
    },
  }
 });

export const ServiceOrderProvider = ({ children }: { children: React.ReactNode }) => { 

  const {
    confirmDialog
  } = useDialog()

  // #region Commons
  const [isModalOpen, openModal, closeModal] = useModal()

  // #endregion 

  //#region serviceOrder
    const [serviceOrderFilters, setServiceOrderFilters] = useState<basicSearchQuery>({ term: '', page: 0, pageSize: 999, start: dayjs().subtract(30, 'day').toDate().toISOString(), end: dayjs().toDate().toISOString() });

    const { data: serviceOrders, isLoading: serviceOrdersLoading } = useQuery({
      queryKey: ['serviceOrdersData', serviceOrderFilters],
      queryFn: () => serviceOrderService.listServiceOrderAsync({
        ...serviceOrderFilters,
        currentPage: serviceOrderFilters?.page ?? 0,
      }), 
      refetchOnWindowFocus: false,
    });

    const changeStatus = async (id: string, statusId: number, sourceId?: number) => {
      
      const forbiddenSource = {
        '4': 'Não é possível alterar o status de uma OS que foi cancelada',
        '3': 'Não é possível alterar o status de uma OS que foi finalizada',
      }

      if(forbiddenSource[sourceId]){
        confirmDialog({
          title: 'Ação não permitida',
          message: forbiddenSource[sourceId],
          variant: 'error',
        })
        return;
      }

      try{
        await serviceOrderService.updateServiceOrderStatus(id, statusId);
      } catch (error) {
        confirmDialog({
          title: 'Erro ao alterar status',
          message: error.message,
          variant: 'error',
        })
      }
    }



  // #endregion

  //#region serviceOrderStatus
    const {
      data : serviceOrderStatuses,
      isLoading: isLoadingServiceOrderStatuses
    } = useQuery({
      queryKey: ['serviceOrderStatuses', serviceOrderFilters],
      queryFn: () => serviceOrderService.getServiceOrderStatusesAsync(serviceOrderFilters),
      refetchOnWindowFocus: false,
    })
    
  // #endregion


  
  const {
    user
  } = useUser()

  const [professionalQueryObject, setProfessionalQueryObject] = useState({ 
    standardSupervisor: true,
    companyId: user?.companyId ?? ''
  })

  const { isLoading: isLoadingProfessionals, data: professionals } = useQuery<basePagination<IProfessional> | undefined>({
    queryKey: ['searchProfessionals', professionalQueryObject],
    queryFn: () => professionalService.listProfessionalAsync({ 
      standardSupervisor: professionalQueryObject.standardSupervisor,
      companyId: professionalQueryObject.companyId,
    }) as any,
    refetchOnWindowFocus: false,
    enabled: !!(professionalQueryObject.companyId && professionalQueryObject.companyId !== ''),
  });
  

  function handleCloseModal() { 
    closeModal();    
  }
  
  return (
    <ServiceOrderContext.Provider value= {{
      modal: {
        isOpen: isModalOpen,
        open: () => openModal(),
        close: () => handleCloseModal(),
      }, 
      serviceOrders:{
        data: serviceOrders,
        isLoading: serviceOrdersLoading,
        setFilter: setServiceOrderFilters,
        filter: serviceOrderFilters,
        changeStatus
      },
      status: {
        data: serviceOrderStatuses,
        isLoading: isLoadingServiceOrderStatuses
      },
      professionals: {
        data: professionals?.items,
        isLoading: isLoadingProfessionals,
        setFilter: setProfessionalQueryObject,
        filter: professionalQueryObject
      }
    }}>
  { children }
    </ServiceOrderContext.Provider>
  );
};

export const useServiceOrder = () => React.useContext(ServiceOrderContext);