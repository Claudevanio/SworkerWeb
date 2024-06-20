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
  };
  serviceOrders: {
    data: basePagination<ServiceOrder>;
    isLoading: boolean;
    setFilter: React.Dispatch<React.SetStateAction<basicSearchQuery>>;
    filter: basicSearchQuery;
    changeStatus: (id: string, statusId: number, sourceId?: number) => void;
  };
  status: {
    data: Array<{
      id: number;
      description: string;
      sequence: number;
    }>;
    isLoading?: boolean;
  };
}

interface basicSearchQuery {
  term: string | undefined;
  page: number;
  pageSize: number;
  start?: string;
  end?: string;
}

export const ServiceOrderContext = createContext<ServiceOrderContextType>({
  modal: {} as any,
  serviceOrders: {
    data: undefined,
    isLoading: false,
    filter: {} as basicSearchQuery,
    setFilter: () => {},
    changeStatus: () => {}
  },
  status: {
    data: [],
    isLoading: false
  }
});

export const ServiceOrderProvider = ({ children }: { children: React.ReactNode }) => {
  const { confirmDialog } = useDialog();

  // #region Commons
  const [isModalOpen, openModal, closeModal] = useModal();

  const { currentCompany } = useUser();

  // #endregion

  //#region serviceOrder

  const [serviceOrderFilters, setServiceOrderFilters] = useState<basicSearchQuery>({
    term: '',
    page: 0,
    pageSize: 999,
    start: dayjs().subtract(30, 'day').toDate().toISOString(),
    end: dayjs().toDate().toISOString()
  });

  const { data: serviceOrders, isLoading: serviceOrdersLoading } = useQuery({
    queryKey: ['serviceOrdersData', serviceOrderFilters],
    queryFn: () =>
      serviceOrderService.listServiceOrderByCompanyAsync(currentCompany?.id ?? '', {
        ...serviceOrderFilters,
        currentPage: serviceOrderFilters?.page ?? 0
      }),
    refetchOnWindowFocus: false,
    enabled: !!currentCompany
  });

  const changeStatus = async (id: string, statusId: number, sourceId?: number) => {
    const forbiddenSource = {
      '4': 'Não é possível alterar o status de uma OS que foi cancelada',
      '3': 'Não é possível alterar o status de uma OS que foi finalizada'
    };

    if (forbiddenSource[sourceId]) {
      confirmDialog({
        title: 'Ação não permitida',
        message: forbiddenSource[sourceId],
        variant: 'error'
      });
      return;
    }

    try {
      await serviceOrderService.updateServiceOrderStatus(id, statusId);
    } catch (error) {
      confirmDialog({
        title: 'Erro ao alterar status',
        message: error.message,
        variant: 'error'
      });
    }
  };

  // #endregion

  //#region serviceOrderStatus
  const { data: serviceOrderStatuses, isLoading: isLoadingServiceOrderStatuses } = useQuery({
    queryKey: ['serviceOrderStatuses'],
    queryFn: () => serviceOrderService.getServiceOrderStatusAsync(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,    
  });

  // #endregion

  const { user } = useUser();

  function handleCloseModal() {
    closeModal();
  }

  return (
    <ServiceOrderContext.Provider
      value={{
        modal: {
          isOpen: isModalOpen,
          open: () => openModal(),
          close: () => handleCloseModal()
        },
        serviceOrders: {
          data: serviceOrders,
          isLoading: serviceOrdersLoading,
          setFilter: setServiceOrderFilters,
          filter: serviceOrderFilters,
          changeStatus
        },
        status: {
          data: serviceOrderStatuses,
          isLoading: isLoadingServiceOrderStatuses
        }
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  );
};

export const useServiceOrder = () => React.useContext(ServiceOrderContext);
