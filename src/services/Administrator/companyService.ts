import { basePagination, ICompany } from '@/types';
import { api } from '../api';
import { AxiosError } from 'axios';


interface IAccessLogsParams {
  companyId: string;
  startLogin: string;
  endLogin: string;
  startLogout: string;
  endLogout: string;
  professionalName: string;
  ip: string;
  endSession: string;
  unityId: string;
  origin: string;
  term: string;
  currentPage: number;
  pageSize: number;
}

export const companyService = {
  async countCompanyAsync (): Promise<number> {
    const response = await api.get<number>('/companies/count');
    return response.data;
  },

  async listCompanyAsync (term: string, currentPage: number, pageSize: number): Promise<basePagination<ICompany>> {
    const response = await api.get<ICompany[]>('/companies', {
      params: { term, currentPage, pageSize }
    });


    const data = {
      items: response.data,
      count: 0
    }

    const { count } = await this.countCompanyAsync();

    data.count = count;

    return data as basePagination<ICompany>;
  },

  async countCompanyAccessLogsAsync (params: IAccessLogsParams): Promise<number> {
    const response = await api.get<number>('/companies/:companyId/access-logs/count', {
      params
    });
    return response.data;
  },

  async listCompanyAccessLogsAsync (params: IAccessLogsParams): Promise<basePagination<ICompany>> {
    const response = await api.get<basePagination<ICompany>>(`/companies/${params.companyId}/access-logs`, {
      params
    });
    return response.data;
  },

  async updateCompanyAsync (item: ICompany): Promise<void> {
    await api.put<void>(`/companies/${item.id}`, item);
  },

  async createCompanyAsync (item: ICompany): Promise<ICompany> {
    const response = await api.post<ICompany>(`/companies`, item);
    return response.data;
  },

  async removeCompanyAsync (id: string): Promise<void> {
    await api.delete<void>(`/companies/${id}`);
  },

  async getCompanyByIdAsync (id: string): Promise<ICompany> {
    const response = await api.get<ICompany>(`/companies/${id}`, {
      params: { id }
    });
    return response.data;
  },

  async getSboxUrl (): Promise<string> {
    const response = await api.get<string>('/companies/sbox-url');
    return response.data;
  }
};
