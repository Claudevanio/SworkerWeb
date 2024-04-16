import { basePagination, ICompanyUnity } from '@/types';
import { api } from '../api';

export const companyUnityService = {
  async countCompanyUnityAsync () {
    const response = await api.get<number>('/company-unities/count');
    return response.data;
  },

  async listCompanyUnityAsync (term: string, currentPage: number, pageSize: number): Promise<basePagination<ICompanyUnity>> {

    const response = await api.get<ICompanyUnity[]>('/company-unities', {
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
  async updateCompanyUnityAsync (item: ICompanyUnity): Promise<void> {
    await api.put<void>(`/company-unities/`, item);
  },

  async createCompanyUnityAsync (item: ICompanyUnity): Promise<ICompanyUnity> {
    const response = await api.post<ICompanyUnity>('/company-unities', item);
    return response.data;
  },

  async removeCompanyUnityAsync (id: string): Promise<void> {
    await api.delete<void>(`/company-unities/${id}`);
  },

  async getCompanyUnityByIdAsync (id: string): Promise<ICompanyUnity> {
    const response = await api.get<ICompanyUnity>(`/company-unities/${id}`, {
      params: { id }
    });
    return response.data;
  },

  async activateCompanyUnityAsync (id: string): Promise<void> {
    await api.put<void>(`/company-unities/${id}/activate`);
  },

  async inactivateCompanyUnityAsync (id: string): Promise<void> {
    await api.put<void>(`/company-unities/${id}/inactivate`);
  }
};
