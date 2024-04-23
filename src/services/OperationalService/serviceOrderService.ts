import { ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
import { api } from '../api';

export const serviceOrderService = {
  async getServiceOrderStatusesAsync (): Promise<any[]> {
    const response = await api.get<any[]>('/service-orders/status');
    return response.data;
  },

  async getServiceOrderCodeAsync (): Promise<any> {
    const response = await api.get<any>('/service-orders/code');
    return response.data;
  },

  async getServiceOrderFilesAsync (id: string): Promise<any> {
    const response = await api.get<any>(`/service-orders/files?id=${id}`);
    return response.data;
  },

  async getServiceOrderProfessionalFilesAsync (osId: string, professionalId: string): Promise<any> {
    const response = await api.get<any>(`/service-orders/${osId}/${professionalId}/files`);
    return response.data;
  },

  async getServiceOrderTaskStepsAsync (id: string): Promise<any[]> {
    const response = await api.get<any[]>(`/service-orders/${id}/task-steps`);
    return response.data;
  },

  async updateServiceOrderStatus (id: string, statusId: number): Promise<void> {
    try {
      const data = {
        orderServiceId: id,
        statusId,
      }
      await api.put<void>(`/service-orders/${id}/status`, data);
    } catch (e) {
      throw e.response.data;
    }
  },

  async getServiceOrderById (id: string): Promise<ServiceOrder> {
    const response = await api.get<ServiceOrder>(`/service-orders/${id}`);
    return response.data;
  },

  async getListServiceOrderTaskStepsAsync (ids: string[]): Promise<any[]> {
    const response = await api.get<any[]>(`/service-orders/task-steps?ids=${ids}`);
    return response.data;
  },

  async countServiceOrderAsync (filters: any): Promise<number> {
    const response = await api.get<number>('/service-orders/count', { params: filters });
    return response.data;
  },

  async listServiceOrderAsync (filters: any): Promise<any[]> {
    console.log(filters)
    const response = await api.get<any[]>('/service-orders', { params: filters });
    return response.data;
  },

  async listServiceOrderByProfessionalAsync (professionalId: string): Promise<any[]> {
    const response = await api.get<any[]>(`/professionals/${professionalId}/service-orders`);
    return response.data;
  },

  // Implemente os demais métodos seguindo o mesmo padrão
  // ...
};