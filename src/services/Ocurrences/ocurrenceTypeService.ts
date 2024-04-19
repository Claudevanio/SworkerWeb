import { api } from "../api";

export const ocurrenceTypeService = {
  async getTypes(): Promise<any> {
    const response = await api.get<any>(
      `/occurrence-type?pageSize=100`
    );

    return response.data;
  },
};
