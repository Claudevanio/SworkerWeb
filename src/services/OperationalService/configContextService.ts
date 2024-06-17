import { basePagination } from '@/types';
import { api } from '../api';
import { IContext } from '@/types/models/ServiceOrder/IContext';

export const configContextService = {
  async listContextsAsync(term: string, currentPage: number, pageSize: number): Promise<basePagination<IContext>> {
    const response = await api.get<IContext[]>(`/contexts`, {
      params: {
        term: term,
        currentPage,
        pageSize
      }
    });

    const data: IContext[] = response.data;

    const responseCount = await api.get('/contexts/count', {
      params: {
        term: term,
        currentPage,
        pageSize
      }
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async updateContext(context: IContext): Promise<void> {
    try {
      console.log(context, 'Current Context');
      await api.put(`/contexts/${context.id}`, {
        Id: context.id,
        Code: context.code,
        Name: context.name,
        Application: context.application,
        Parameters: context.parameters,
        Type: context.type,
        CharacterizationId: context.characterizationId,
        IntervalTime: context.intervalTime
      });
    } catch (e) {
      throw e.response.data;
    }
  }
};
