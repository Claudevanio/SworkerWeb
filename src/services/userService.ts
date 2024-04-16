import { IUser } from '@/types';
import { api } from './api';

interface ILogin {
  userName: string;
  password: string;
}

export const Userservice = {
  async createUser (data: IUser) {
    const response = await api.post('/users', data);
    return response.data as IUser;
  },
  async updateUser (data: IUser) {
    const response = await api.put('/users', data);
    return response.data;
  },
  async updateUserPasswordAsync (data: { password: string; item: any }) {
    const response = await api.put('/users/reset-password', data);
    return response.data;
  },
  async getUserById (id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  async updateUserLockoutAsync (data: IUser) {
    const response = await api.put(`/users/${data.id}/lockout`, data);
    return response.data;
  }
}