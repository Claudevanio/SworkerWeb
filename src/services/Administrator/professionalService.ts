import { basePagination } from './../../types/basePagination';
import { IProfessional } from '@/types/';
import { api } from '../api';

interface IProfessionalParams {
  companyId: string;
  clinicalParameters?: string;
  name?: string;
  registerNumber?: string;
  startLastPeriodicExamDate?: string;
  endLastPeriodicExamDate?: string;
  normal?: boolean;
  term?: string;
  currentPage?: number;
  pageSize?: number;
  standardSupervisor?: boolean;
}

export const professionalService = {
  async countProfessionalAsync(params: IProfessionalParams): Promise<number> {
    const { companyId, ...queryParams } = params;
    const response = await api.get<number>(`/companies/${companyId}/professionals/count`, {
      params: queryParams
    });
    return response.data;
  },

  async listProfessionalAsync(params: IProfessionalParams): Promise<basePagination<IProfessional>> {
    const { companyId, ...queryParams } = params;

    (queryParams as any).offSet = queryParams.currentPage;
    (queryParams as any).itensPerPage = queryParams.pageSize;
    const response = await api.get<{ items: IProfessional[]; totalItems: number }>(`/companies/${companyId}/professionals`, {
      params: queryParams
    });

    const data = {
      items: response.data.items,
      count: response.data.totalItems
    };

    return data;
  },

  async getProfessionalByIdAsync(professionalId: string): Promise<IProfessional> {
    const response = await api.get<IProfessional>(`/professionals/${professionalId}`);
    return response.data;
  },

  async getAssignmentsAsync(id: string): Promise<any[]> {
    const response = await api.get<any[]>(`/professionals/${id}/assignments`);
    return response.data;
  },

  async addProfessionalAsync(companyId: string, item: IProfessional): Promise<any> {
    const response = await api.post<any>(`/companies/${companyId}/professionals`, item);
    return response.data;
  },

  async updateProfessionalAsync(companyId: string, item: IProfessional): Promise<any> {
    const response = await api.put<any>(`/companies/${companyId}/professionals/${item.id}`, item);
    return response.data;
  },

  async getProfessionalsCompanyUnitiesHistoryAsync(companyId: string, professionalId: string): Promise<any[]> {
    const response = await api.get<any[]>(`/companies/${companyId}/professionals/${professionalId}/company-unities/history`);
    return response.data;
  },

  async getUnits(professionalId: any): Promise<any[]> {
    const response = await api.get<any[]>(`/professionals/${professionalId}/unities`);
    return response.data;
  },

  async signUnit(professionalId: string, unitId: string): Promise<any> {
    const response = await api.put<any>(`/professionals/${professionalId}/singin/${unitId}`);
    return response.data;
  },

  async unsignUnit(professionalId: string, unitId: string): Promise<any> {
    const response = await api.put<any>(`/professionals/${professionalId}/singout/${unitId}`);
    return response.data;
  }
};
