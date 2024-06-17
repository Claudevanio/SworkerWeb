import { authApi } from './api';

interface ILogin {
  userName: string;
  password: string;
}

export const Authservice = {
  async login(data: ILogin) {
    try {
      const newData = {
        UserName: data.userName,
        Password: data.password
      };
      const response = await authApi.post('/auth/login', { ...newData, type: 2 });
      return response.data;
    } catch (e) {
      throw e.response.data;
    }
  },
  async logout(userId: string) {
    const response = await authApi.get('/auth/logOff/' + userId);
    return response.data;
  },
  async forgotPassword(userName: string) {
    const response = await authApi.post('/auth/forgot-password', { email: userName });
    return response.data;
  },
  async resetPassword(data: { password: string; code: string; confirmPassword: string; id: string }) {
    const response = await authApi.post('/auth/reset-password', data);
    return response.data;
  }
};
