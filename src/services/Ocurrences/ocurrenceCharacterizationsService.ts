import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { api } from '../api';
import { IFilterCharacterization } from '@/types/models/Ocurrences/IFilterCharacterization';
import { basePagination } from '@/types';

export const ocurrenceCharacterizationService = {
  async getCharacterizations(): Promise<IOcurrenceCharacterization[]> {
    const response = await api.get<IOcurrenceCharacterization[]>(`/occurrence-characterizations`);

    return response.data;
  },

  async getCharacterizationsByTypeAsync(typeId: string | number): Promise<IOcurrenceCharacterization[]> {
    const response = await api.get<IOcurrenceCharacterization[]>(`/occurrence-characterizations/${typeId}`);

    return response.data;
  },

  async getCharacterizationsWithPagination(
    term: string,
    currentPage: number,
    pageSize: number,
    filter: IFilterCharacterization
  ): Promise<basePagination<IOcurrenceCharacterization>> {
    const response = await api.get<IOcurrenceCharacterization[]>(`/occurrence-characterizations`, {
      params: {
        term: filter.query,
        currentPage,
        pageSize
      }
    });

    const data: IOcurrenceCharacterization[] = response.data;

    const responseCount = await api.get('/occurrence-characterizations/count', {
      params: {
        term: filter.query,
        currentPage,
        pageSize
      }
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async insertCharacterization(characterization: IOcurrenceCharacterization): Promise<void> {
    try {
      await api.post(`/occurrence-characterizations`, {
        OcurrenceTypeId: characterization.type.id,
        Description: characterization.description
      });
    } catch (e) {
      throw e.response.data;
    }
  },

  async updateCharacterization(characterization: IOcurrenceCharacterization): Promise<void> {
    try {
      await api.put(`/occurrence-characterizations/${characterization.id}`, {
        id: characterization.id,
        occurrenceTypeId: characterization.type.id,
        description: characterization.description
      });
    } catch (e) {
      throw e.response.data;
    }
  },

  async deleteCharacterization(characterizationId: number): Promise<void> {
    try {
      await api.delete(`/occurrence-characterizations/${characterizationId}`);
    } catch (e) {
      throw e.response.data;
    }
  }
};
