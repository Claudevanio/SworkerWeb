import { IPermissions, IRole, basePagination } from '@/types';
import { api, authApi } from '../api';


export const RoleService = {
  async countAsync (): Promise<number> {
    const response = await authApi.get<number>('/roles/count');
    return response.data;
  },

  async getAll (): Promise<IRole[]> {
    const response = await authApi.get<IRole[]>('/roles/all');
    return response.data;
  },

  async listRolesAsync (term: string, currentPage: number, pageSize: number): Promise<basePagination<IRole>> {
    const response = await authApi.get<IRole[]>('/roles', {
      params: { term, currentPage, pageSize }
    });

    const data = {
      items: response.data,
      count: 0
    }
    const { count } = await this.countAsync();
    data.count = count;
    return data as basePagination<IRole>;
  },

  async addRoleAsync (item: IRole): Promise<IRole> {
    const response = await authApi.post<IRole>('/roles', item);
    return response.data;
  },

  async updateRoleAsync (item: IRole): Promise<IRole> {
    item.roleId = item.id;
    const response = await authApi.put<IRole>('/roles', item);
    return response.data;
  },

  async removeRoleAsync (item: IRole): Promise<void> {
    await authApi.delete<void>('/roles', { data: item });
  },

  async getRolesByUserIdAsync (userId: string): Promise<IRole[]> {
    const response = await authApi.get<IRole[]>(`/users/${userId}/roles`);
    return response.data;
  },

  async getPermissions () {
    const response = await authApi.get<IPermissions[]>('/permissions');
    return response.data;
  }
};
