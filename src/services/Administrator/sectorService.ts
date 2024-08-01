import { basePagination, ISector } from '@/types';
import { api } from '../api';
import { getFilterParam } from '@/utils';

export const SectorService = {
  async countSectorAsync(): Promise<number> {
    const response = await api.get<number>('/sectors/count');
    return response.data;
  },

  async listSectorAsync({ page, pageSize, term }: { page: number; pageSize: number; term: string }): Promise<basePagination<ISector>> {
    
    const filter = getFilterParam({ 
      name: term
    });

    const response = await api.get<{
      pageSize: number;
      term: string;
      totalItems: number;
      items: ISector[];
    }>('/sector/list', {
      params: {
        offSet: page,
        itensPerPage: pageSize,
        filter
      }
    });

    const data = {
      items: response.data?.items,
      count: response.data?.totalItems
    };

    return data as basePagination<ISector>;
  },

  async listSectorByCompanyAsync({
    page,
    pageSize,
    term,
    companyId
  }: {
    page: number;
    pageSize: number;
    term: string;
    companyId: string;
  }): Promise<basePagination<ISector>> {
    const filter = getFilterParam({
      name: term
    })
    const response = await api.get<{
      pageSize: number;
      term: string;
      totalItems: number;
      items: ISector[];
    }>(`/companies/${companyId}/sectors`, {
      params: {
        offSet: page,
        itensPerPage: pageSize,
        filter
      }
    });

    const data = {
      items: response.data?.items,
      count: response.data?.totalItems
    };

    return data as basePagination<ISector>;
  },

  async getAll(): Promise<ISector[]> {
    const response = await api.get<{
      pageSize: number;
      term: string;
      totalItems: number;
      items: ISector[];
    }>('/sector/list');

    return response.data?.items;
  },

  async updateSectorAsync(item: ISector): Promise<void> {
    await api.put<ISector>(`/sector`, item);
  },

  async createSectorAsync(item: ISector): Promise<ISector> {
    const response = await api.post<ISector>(`/sector`, item);
    return response.data;
  },

  async removeSectorAsync(id: string): Promise<void> {
    // await api.delete<void>(`/sector`,);
  },

  async getSectorByIdAsync(id: string): Promise<ISector> {
    const response = await api.get<ISector>(`/sectors/${id}`, {
      params: { id }
    });
    return response.data;
  }
};
