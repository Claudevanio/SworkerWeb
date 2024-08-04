import { basePagination } from '@/types';
import { IOcurrence } from '@/types/models/Ocurrences/IOcurrence';
import { api } from '../api';
import { IOcurrenceRecognize } from '@/types/models/Ocurrences/IOcurrenceRecognize';
import { IFilterOcurrences } from '@/types/models/Ocurrences/IFilterOcurrences';
import { getFilterParam } from '@/utils';

export const ocurrenceService = {
  async getCountOcurrence(companyId, dateStart: string, dateEnd: string) {
    const filter = getFilterParam({
      registerDateInicial: dateStart,
      registerDateFinal: dateEnd
    });
    const responseCount = await api.get(`/companies/${companyId}/occurrences`, {
      params: {
        filter
      }
    });

    const count: number = responseCount.data.totalItems;

    return count;
  },

  async getCountOcurrenceRecognize(companyId, dateStart: string, dateEnd: string) {
    const filter = getFilterParam({
      registerDateInicial: dateStart,
      registerDateFinal: dateEnd,
      closed: false
    });
    const responseCount = await api.get(`/companies/${companyId}/recognized-occurrences`, {
      params: {
        acknowledgedStart: dateStart,
        acknowledgedEnd: dateEnd,
        closed: false,
        filter
      }
    });

    const count: number = responseCount.data.totalItems;

    return count;
  },

  async getCountOcurrenceClose(companyId, dateStart: string, dateEnd: string) {
    const filter = getFilterParam({
      closedStart: dateStart,
      closedEnd: dateEnd,
      registerDateInicial: dateStart,
      registerDateFinal: dateEnd,
      closed: 1
    });

    const responseCount = await api.get(`/companies/${companyId}/occurrences`, {
      params: {
        closedStart: dateStart,
        closedEnd: dateEnd,
        closed: 1,
        filter
      }
    });

    const count: number = responseCount.data.totalItems;

    return count;
  },

  async listOcurrenceAsync(
    companyId: string | number,
    term: string | null,
    currentPage: number | null,
    pageSize: number | null,
    filter: IFilterOcurrences
  ): Promise<basePagination<IOcurrence>> {
    const filters = getFilterParam({
      number: filter.numberOcurrence,
      professionalname: filter.professional,
      registerDateInicial: filter.registerDateStart,
      registerDateFinal: filter.registerDateEnd,
      statusofavaliation: filter.status,
      type: filter.type,
      origin: filter.origin,
      evaluationStart: filter.availableDateStart,
      evaluationEnd: filter.availableDateEnd
    });

    const response = await api.get<{ items: IOcurrence[]; totalItems: number }>(`/companies/${companyId}/occurrences`, {
      params: {
        term: filter.queryCod,
        offSet: currentPage,
        itensPerPage: pageSize,
        filter: filters
      }
    });

    const data: IOcurrence[] = response.data.items;
    const count: number = response.data.totalItems;

    return Promise.resolve({ items: data, count: count });
  },

  async getOcurrenceByCategoryAsync(categoryId: string): Promise<IOcurrence[]> {
    const response = await api.get<IOcurrence[]>(`/occurrences`, {
      params: {
        cdescription: categoryId
      }
    });
    return response.data;
  },

  async getAllRecognizeOcurrenceAsync(companyId: string | number, pageSize?: number): Promise<{ items: IOcurrenceRecognize[] }> {
    debugger;
    const response = await api.get<{ items: IOcurrenceRecognize[] }>(`/companies/${companyId}/recognized-occurrences`, {
      params: {
        itensPerPage: pageSize
      }
    });
    return response.data;
  },

  async listOcurrenceRecognitionAsync(
    companyId: string | number,
    term: string,
    currentPage: number,
    pageSize: number,
    filter: IFilterOcurrences,
    closed?: boolean
  ): Promise<basePagination<IOcurrenceRecognize>> {
    const jsonFilter = getFilterParam({
      number: filter.numberOcurrence,
      professionalname: filter.professional,
      start: filter.registerDateStart,
      end: filter.registerDateEnd,
      statusofavaliation: filter.status,
      type: filter.type,
      origin: filter.origin,
      evaluationStart: filter.availableDateStart,
      evaluationEnd: filter.availableDateEnd,
      closed: closed ? 1 : 0
    });

    const response = await api.get<{ items: IOcurrenceRecognize[]; totalItems: number }>(`/companies/${companyId}/recognized-occurrences`, {
      params: {
        term: filter.queryCod,
        itensPerPage: pageSize,
        offSet: currentPage + 1,
        filter: jsonFilter
      }
    });

    const data: IOcurrenceRecognize[] = response.data.items;
    const count: number = response.data.totalItems;

    return Promise.resolve({ items: data, count: count });
  },

  async closeOcurrenceAsync(item: IOcurrenceRecognize): Promise<void> {
    await api.post<void>(`/occurrences/${item.occurrenceId}/recognize`, item, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json-patch+json'
      }
    });
  },

  async updateOcurrenceAsync(item: IOcurrence): Promise<void> {
    try {
      await api.put<void>(
        `/occurrences/${item.id}`,
        {
          characterizationId: item.characterization.id,
          registerDate: item.registerDate,
          local: item.local,
          description: item.description
        },
        {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json-patch+json'
          }
        }
      );
    } catch (e) {
      throw e.response.data;
    }
  },

  getById: async (id: string): Promise<IOcurrence> => {
    const response = await api.get<IOcurrence>(`/occurrences?id=${id}`);
    return response.data;
  },

  async recognizeOcurrenceAsync(item: IOcurrenceRecognize): Promise<void> {
    try {
      await api.post<void>(`/occurrences/${item.occurrenceId}/recognize`, item, {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json-patch+json'
        }
      });
    } catch (e) {
      throw e.response.data;
    }
  }
};
