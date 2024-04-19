'use client';
import { useModal } from '@/hooks'; 
import { useDialog } from '@/hooks/use-dialog';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService'; 
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
    data: any;
    isLoading: boolean;
    setFilter: React.Dispatch<React.SetStateAction<basicSearchQuery>>;
    changeStatus: (id: string, statusId: number, sourceId?:number) => void;
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
    setFilter: () => {},
    changeStatus: () => {},
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
    const [serviceOrderFilters, setServiceOrderFilters] = useState<basicSearchQuery>({ term: '', page: 1, pageSize: 999, start: dayjs().subtract(30, 'day').toDate().toISOString() });

    const { data: serviceOrders, isLoading: serviceOrdersLoading } = useQuery({
      queryKey: ['serviceOrders', serviceOrderFilters],
      queryFn: () => serviceOrderService.listServiceOrderAsync(serviceOrderFilters), 
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
        console.log(error);
      }
    }



  // #endregion

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
        changeStatus
      }
    }}>
  { children }
    </ServiceOrderContext.Provider>
  );
};

export const useServiceOrder = () => React.useContext(ServiceOrderContext);