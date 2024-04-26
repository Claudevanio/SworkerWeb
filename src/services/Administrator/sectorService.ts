import { basePagination, ISector } from '@/types';
import { api } from '../api';
import { AxiosError } from 'axios';



export const SectorService = {
  async countSectorAsync (): Promise<number> {
    const response = await api.get<number>('/sectors/count');
    return response.data;
  },

  async listSectorAsync (term: string, currentPage: number, pageSize: number): Promise<basePagination<ISector>> {

    const mockData: basePagination<ISector> = {
      items: [
        {
          id: '1',
          name: 'Sector 1',
          unityId: '1',
          unity: {
            companyId: '1',
            id: '1',
            name: 'Unidade 1',
            phone: 123456789,
            active: true,
            address: {
              companyUnityId: 1,
              zipCode: '12345678',
              state: 'SP',
              city: 'São Paulo',
              neighborHood: 'Vila Mariana',
              street: 'Rua Vergueiro',
              number: '123',
              complement: 'Complemento'
            },
          }
        },
        {
          id: '2',
          name: 'Sector 2',
          unityId: '1',
          unity: {
            companyId: '1',
            id: '1',
            name: 'Unidade 1',
            phone: 123456789,
            active: true,
            address: {
              companyUnityId: 1,
              zipCode: '12345678',
              state: 'SP',
              city: 'São Paulo',
              neighborHood: 'Vila Mariana',
              street: 'Rua Vergueiro',
              number: '123',
              complement: 'Complemento'
            },
          }
        },
        {
          id: '3',
          name: 'Sector 3',
          unityId: '1',
          unity: {
            companyId: '1',
            id: '1',
            name: 'Unidade 1',
            phone: 123456789,
            active: true,
            address: {
              companyUnityId: 1,
              zipCode: '12345678',
              state: 'SP',
              city: 'São Paulo',
              neighborHood: 'Vila Mariana',
              street: 'Rua Vergueiro',
              number: '123',
              complement: 'Complemento'
            },
          }
        },
        {
          id: '4',
          name: 'Sector 4',
          unityId: '2',
          unity: {
            companyId: '1',
            id: '1',
            name: 'Unidade 1',
            phone: 123456789,
            active: true,
            address: {
              companyUnityId: 1,
              zipCode: '12345678',
              state: 'SP',
              city: 'São Paulo',
              neighborHood: 'Vila Mariana',
              street: 'Rua Vergueiro',
              number: '123',
              complement: 'Complemento'
            },
          }
        }
      ],
      count: 3
    };

    const filteredData = mockData.items.filter(
      role => term ? role.name.toLowerCase().includes(term.toLowerCase()) : true
    );

    // Paginate
    const startIndex = (currentPage) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return Promise.resolve(
      { items: paginatedData, count: 5 }
    );


    const response = await api.get<ISector[]>('/sectors', {
      params: { term, currentPage, pageSize }
    });


    const data = {
      items: response.data,
      count: 0
    }

    data.count = await this.countSectorAsync();

    return data as basePagination<ISector>;
  },

  async getAll (): Promise<ISector[]> {
    const response = await api.get<ISector[]>('/sector-equip/sector-list');
    return response.data;
  },

  async updateSectorAsync (item: ISector): Promise<void> {
    await api.put<void>(`/sectors/${item.id}`, item);
  },

  async createSectorAsync (item: ISector): Promise<ISector> {
    const response = await api.post<ISector>(`/sectors/${item.id}`, item);
    return response.data;
  },

  async removeSectorAsync (id: string): Promise<void> {
    await api.delete<void>(`/sectors/${id}`);
  },

  async getSectorByIdAsync (id: string): Promise<ISector> {
    const response = await api.get<ISector>(`/sectors/${id}`, {
      params: { id }
    });
    return response.data;
  },
};
