import { basePagination, ICompanyUnity } from '@/types';
import { api } from '../api';

export const companyUnityService = {
  async countCompanyUnityAsync () {
    const response = await api.get<number>('/unities/count');
    return response.data;
  },

  async listCompanyUnityAsync (term: string, currentPage: number, pageSize: number): Promise<basePagination<ICompanyUnity>> {

    const response = await api.get<ICompanyUnity[]>('/unities', {
      params: { term, currentPage, pageSize }
    });

    const data = {
      items: response.data,
      count: 0
    }

    const { count } = await companyUnityService.countCompanyUnityAsync() as any;

    data.count = count;

    return data as basePagination<ICompanyUnity>;
  },

  async listUnitiesByCompanyAsync ({
    companyId,
    term,
    currentPage,
    pageSize
  }: {
    companyId: string;
    term: string;
    currentPage: number;
    pageSize: number;
  }): Promise<basePagination<ICompanyUnity>> {
    const response = await api.get(`/companies/${companyId}/unities`, {
      params: { filter: term, itensPerPage: pageSize, offSet: currentPage + 1 }
    });

    const data = {
      items: response.data.items,
      count: response.data.totalItems
    }

    return data as basePagination<ICompanyUnity>;

  },

  async getAll (): Promise<ICompanyUnity[]> {
    const response = await api.get<ICompanyUnity[]>('/unities');
    return response.data;
  },

  async updateCompanyUnityAsync (item: ICompanyUnity): Promise<void> {
    await api.put<void>(`/unities/`, item);
  },

  async createCompanyUnityAsync (item: ICompanyUnity): Promise<ICompanyUnity> {
    const response = await api.post<ICompanyUnity>('/unities', item);
    return response.data;
  },

  async removeCompanyUnityAsync (id: string): Promise<void> {
    await api.delete<void>(`/unities/${id}`);
  },

  async getCompanyUnityByIdAsync (id: string): Promise<ICompanyUnity> {
    const response = await api.get<ICompanyUnity>(`/unities/${id}`, {
      params: { id }
    });
    return response.data;
  },

  async activateCompanyUnityAsync (id: string): Promise<void> {
    await api.put<void>(`/unities/${id}/activate`);
  },

  async inactivateCompanyUnityAsync (id: string): Promise<void> {
    await api.put<void>(`/unities/${id}/inactivate`);
  }
};
