import { IUser } from '@/types';
import { authApi } from './api';

interface ILogin {
  userName: string;
  password: string;
}

export const Userservice = {
  async createUser(data: IUser) {
    const response = await authApi.post('/users', data);
    return response.data as IUser;
  },
  async updateUserName(userInfo: IUser) {
    const roleResponse = await authApi.get(`/users/${userInfo.userId}/roles`);

    const roleId = roleResponse.data[0].roleId;

    userInfo.roleId = roleId;

    const response = await authApi.put(`/users/`, userInfo);

    return response.data;
  },
  async updateUser(data: IUser) {
    const response = await authApi.put('/users', data);
    return response.data;
  },
  async updateUserPasswordAsync(data: { password: string; item: any }) {
    const response = await authApi.put('/users/reset-password', data);
    return response.data;
  },
  async updateLoggedUserPassword(
    id: string,
    data: {
      userName: string;
      password: string;
      newPassword: string;
      confirmPassword: string;
    }
  ) {
    try {
      const response = await authApi.put(`/users/${id}/password`, data, {
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      });
      return response.data;
    } catch (e) {
      throw e.response.data;
    }
  },
  async getUserById(id: string) {
    const response = await authApi.get(`/users/${id}`);
    return response.data;
  },
  async updateUserLockoutAsync(data: IUser) {
    const response = await authApi.put(`/users/${data.id}/lockout`, data);
    return response.data;
  }
};
