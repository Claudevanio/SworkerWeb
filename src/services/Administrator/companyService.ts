import { basePagination, ICompany } from '@/types';
import { api } from '../api';
import { AxiosError } from 'axios';
import { getFilterParam } from '@/utils';

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
  async countCompanyAsync(
    term
  ): Promise<number> {
    const response = await api.get<number>('/companies/count', {
      params: {
        term
      }
    });
    return response.data;
  },

  async listCompanyAsync(term: string, page: number, size: number): Promise<basePagination<ICompany>> {
    // const filter = getFilterParam({ name: term });
    let currentPage = page;
    let pageSize = size;

    const hasTerm = term && term !== '' && term?.length > 0;
    
    // Regra adicionada pq o count não estava retornando o valor correto quando filtrado
    if(hasTerm){
      currentPage = 0;
      pageSize = 99;
    }
    
    const response = await api.get<ICompany[]>('/companies', {
      params: { term, currentPage, pageSize, active: 1 }
    });

    
    const data = {
      items: response.data,
      count: 0
    };

    if(hasTerm){
      data.count = data.items.length;
      return data as basePagination<ICompany>;
    }
    
    const { count } = await this.countCompanyAsync(
      term
    );

    data.count = count;

    return data as basePagination<ICompany>;
  },

  async getAll(): Promise<ICompany[]> {
    const response = await api.get<ICompany[]>('/companies');
    return response.data;
  },

  async countCompanyAccessLogsAsync(params: IAccessLogsParams): Promise<number> {
    const response = await api.get<number>('/companies/:companyId/access-logs/count', {
      params
    });
    return response.data;
  },

  async listCompanyAccessLogsAsync(params: IAccessLogsParams): Promise<basePagination<ICompany>> {
    const response = await api.get<basePagination<ICompany>>(`/companies/${params.companyId}/access-logs`, {
      params
    });
    return response.data;
  },

  async updateCompanyAsync(item: ICompany): Promise<void> {
    await api.put<void>(`/companies/${item.id}`, item);
  },

  async createCompanyAsync(item: ICompany): Promise<ICompany> {
    const response = await api.post<ICompany>(`/companies`, item);
    return response.data;
  },

  async removeCompanyAsync(id: string): Promise<void> {
    await api.delete<void>(`/companies/${id}`);
  },

  async getCompanyByIdAsync(id: string): Promise<ICompany> {
    const response = await api.get<ICompany>(`/companies/${id}`, {
      params: { id }
    });
    return response.data;
  },

  async getSboxUrl(): Promise<string> {
    const response = await api.get<string>('/companies/sbox-url');
    return response.data;
  }
};
