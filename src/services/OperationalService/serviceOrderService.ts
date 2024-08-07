import { ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
import { api } from '../api';
import dayjs from 'dayjs';
import { basePagination } from '@/types';
import { getFilterParam } from '@/utils';

export const serviceOrderService = {
  async getServiceOrderStatusesAsync(filters?: any): Promise<any[]> {
    const { page, pageSize, ...rest } = filters;
    const response = await api.get<any[]>('/service-orders/status');

    const { data } = response;

    if (!filters) return data;

    const countObj = await Promise.all(
      data.map(async (status: any) => {
        const details = await api.get<{ count: number }>(`/service-orders/count?status=${status.id}`, {
          params: rest
        });
        const obj = {
          ...status,
          count: details.data.count
        };
        return obj;
      })
    );

    return countObj;
  },

  async getServiceOrderStatusAsync(): Promise<any[]> {
    const response = await api.get<any[]>('/service-orders/status');
    return response.data;
  },

  async getServiceOrderCodeAsync(): Promise<any> {
    const response = await api.get<any>('/service-orders/code');
    return response.data;
  },

  async getServiceOrderFilesAsync(id: string): Promise<any> {
    const response = await api.get<any>(`/service-orders/files?id=${id}`);
    return response.data;
  },

  async getServiceOrderProfessionalFilesAsync(osId: string, professionalId: string): Promise<any> {
    const response = await api.get<any>(`/${osId}/${professionalId}/files`);
    return response.data;
  },

  async getServiceOrderByProfessionalIdAsync(professionalId: string): Promise<ServiceOrder[]> {
    if (!professionalId || professionalId === '') return [];
    const response = await api.get<ServiceOrder[]>(`/professionals/${professionalId}/service-orders`);
    return response.data;
  },

  async listDay(companyId: string): Promise<any[]> {
    const response = await api.get<any[]>(`companies/${companyId}/service-orders/list-day`);
    return response.data;
  },

  async getServiceOrderTaskStepsAsync(id: string): Promise<any[]> {
    const response = await api.get<any[]>(`/service-orders/${id}/task-steps`);
    return response.data;
  },

  async updateServiceOrderStatus(id: string, statusId: number): Promise<void> {
    try {
      const data = {
        orderServiceId: id,
        statusId
      };
      await api.put<void>(`/service-orders/${id}/status`, data);
    } catch (e) {
      throw e.response.data;
    }
  },

  async getServiceOrderById(id: string): Promise<ServiceOrder> {
    const response = await api.get<ServiceOrder>(`/service-orders/${id}`);
    return response.data;
  },

  async getServiceOrderDetailById(id: string): Promise<any> {
    const response = await api.get<ServiceOrder>(`/${id}/detail`);
    return response.data;
  },

  async getOcurrencesByServiceOrderId(id: string): Promise<any[]> {
    const response = await api.get<any[]>(`/service-orders/${id}/occurrences?id=${id}`);
    return response.data;
  },

  async getListServiceOrderTaskStepsAsync(ids: string[]): Promise<any[]> {
    const response = await api.get<any[]>(`/service-orders/task-steps?ids=${ids}`);
    return response.data;
  },

  async listServiceOrderAsync(filters: any): Promise<any[]> {
    console.log(filters);
    const response = await api.get<any[]>('/service-orders', { params: filters });
    return response.data;
  },

  async listServicesDay(companyId: string): Promise<any[]> {
    const response = await api.get<any[]>(`companies/${companyId}/service-orders/list-day`);
    return response.data;
  },

  async listServiceOrderByCompanyAsync(companyId: string, filters: any): Promise<basePagination<any>> {
    const { page, pageSize, currentPage, ...rest } = filters;
    const filter = getFilterParam({
      ...rest,
      requestDateInicial: rest?.start,
      requestDateFinal: rest?.end
    });
    const response = await api.get<{
      items: any[];
      totalItems: number;
    }>(`/companies/${companyId}/service-orders`, {
      params: {
        offSet: filters.currentPage,
        itensPerPage: filters.pageSize,
        filter
      }
    });
    const responseBody: basePagination<any> = {
      items: response.data.items,
      count: response.data.totalItems
    };
    return responseBody;
  },

  async listServiceOrderByProfessionalAsync(professionalId: string): Promise<any[]> {
    const response = await api.get<any[]>(`/professionals/${professionalId}/service-orders`);
    return response.data;
  },

  dashboardData: {
    ocurrenceData: async (companyId, filters: { start: string; end: string }): Promise<any> => {
      const dateDiff = dayjs(filters.end).diff(dayjs(filters.start), 'day');

      const UnfilteredParams = getFilterParam({
        registerDateInicial: dayjs(filters.start).subtract(dateDiff, 'day').format('YYYY-MM-DD'),
        registerDateFinal: filters.start
      });

      const filterString = getFilterParam({
        registerDateInicial: filters.start,
        registerDateFinal: filters.end
      });

      const [geradas, reconhecidas, geradasFiltered, reconhecidasFiltered] = await Promise.all([
        api.get<any>(`/companies/${companyId}/occurrences`, {
          params: {
            filter: UnfilteredParams,
            pageSize: 1
          }
        }),
        api.get<any>(`/companies/${companyId}/recognized-occurrences`, {
          params: {
            filter: UnfilteredParams,
            pageSize: 1
          }
        }),
        api.get<any>(`/companies/${companyId}/occurrences`, {
          params: {
            filter: filterString,
            pageSize: 1
          }
        }),
        api.get<any>(`/companies/${companyId}/recognized-occurrences`, {
          params: {
            filter: filterString,
            pageSize: 1
          }
        })
      ]);

      const unfilteredGeradasCount = geradas.data.totalItems;
      const unfilteredReconhecidasCount = reconhecidas.data.totalItems;
      const unfilteredClosedCount = unfilteredGeradasCount - unfilteredReconhecidasCount;

      const filteredGeradasCount = geradasFiltered.data.totalItems;
      const filteredReconhecidasCount = reconhecidasFiltered.data.totalItems;
      const filteredClosedCount = filteredGeradasCount - filteredReconhecidasCount;

      let geradasChangePercent;
      if (unfilteredGeradasCount !== 0) {
        geradasChangePercent = ((filteredGeradasCount - unfilteredGeradasCount) / unfilteredGeradasCount) * 100;
      } else {
        geradasChangePercent = 100;
      }

      let reconhecidasChangePercent;
      if (unfilteredReconhecidasCount !== 0) {
        reconhecidasChangePercent = ((filteredReconhecidasCount - unfilteredReconhecidasCount) / unfilteredReconhecidasCount) * 100;
      } else {
        reconhecidasChangePercent = 100;
      }

      let closedChangePercent;
      if (unfilteredClosedCount !== 0) {
        closedChangePercent = ((filteredClosedCount - unfilteredClosedCount) / unfilteredClosedCount) * 100;
      } else {
        closedChangePercent = 100;
      }
      return {
        geradas: {
          count: filteredGeradasCount,
          change: geradasChangePercent,
          unfilteredCount: unfilteredGeradasCount
        },
        reconhecidas: {
          count: filteredReconhecidasCount,
          change: reconhecidasChangePercent,
          unfilteredCount: unfilteredReconhecidasCount
        },
        closed: {
          count: filteredClosedCount,
          change: closedChangePercent,
          unfilteredCount: unfilteredClosedCount
        }
      };
    },
    listTaskSpentTime: async (filters: { start: string; end: string }): Promise<any> => {
      const filter = getFilterParam(filters);
      const response = await api.get<any>('/tasks/spent', { params: { ...filters, filter } });
      return response.data;
    }
  }

  // Implemente os demais métodos seguindo o mesmo padrão
  // ...
};
