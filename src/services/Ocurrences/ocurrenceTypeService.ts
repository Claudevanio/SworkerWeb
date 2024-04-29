import { basePagination } from "@/types";
import { api } from "../api";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";

export const ocurrenceTypeService = {
  async getTypes (): Promise<any> {
    const response = await api.get<any>(`/occurrence-type?pageSize=100`);

    return response.data;
  },

  async getTypesWithPagination (
    term: string,
    currentPage: number,
    pageSize: number
  ): Promise<basePagination<IOcurrenceType>> {
    const response = await api.get<any>(`/occurrence-type?pageSize=100`, {
      params: {
        term,
      },
    });

    console.log(response, "Response");

    const data: IOcurrenceType[] = response.data.data.data;

    const responseCount = await api.get("/occurrence-type/count", {
      params: {
        term,
        currentPage,
        pageSize,
      },
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async insertType (type: IOcurrenceType): Promise<void> {
    try {
      await api.post(`/occurrence-type/add`, {
        typeName: type.typeName,
        description: type.description,
        registerDate: new Date().toISOString(),
      });
    } catch (e) {
      throw e.response.data;
    }
  },

  async updateType (
    type: IOcurrenceType
  ): Promise<void> {
    try {
      await api.put(`/occurrence-type/edit`, {
        id: type.id,
        typeName: type.typeName,
        description: type.description,
        registerDate: type.registerDate
      });
    } catch (e) {
      throw e.response.data;
    }
  },

  async deleteType (typeId: number): Promise<void> {
    try {
      await api.delete(`/occurrence-type/delete?id=${typeId}`);
    } catch (e) {
      throw e.response.data;
    }
  },
};
