import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { api } from "../api";
import { basePagination } from "@/types";
import { IFilterClassification } from "@/types/models/Ocurrences/IFilterClassification";

export const ocurrrenceClassificationService = {
  async getClassifications(): Promise<IOcurrenceClassification[]> {
    const response = await api.get<IOcurrenceClassification[]>(
      `/occurrence-classifications`
    );

    return response.data;
  },

  async getClassificationsWithPagination(
    term: string,
    currentPage: number,
    pageSize: number,
    filter: IFilterClassification
  ): Promise<basePagination<IOcurrenceClassification>> {
    const response = await api.get<IOcurrenceClassification[]>(
      `/occurrence-classifications`,
      {
        params: {
          term: filter.query,
          currentPage,
          pageSize,
          severity: filter.severityId,
          type: filter.typeId,
          description: filter.description,
        },
      }
    );

    const data: IOcurrenceClassification[] = response.data;

    const responseCount = await api.get("/occurrence-classifications/count", {
      params: {
        term: filter.query,
        currentPage,
        pageSize,
        severity: filter.severityId,
        type: filter.typeId,
        description: filter.description,
      },
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async insertClassification(
    classification: IOcurrenceClassification
  ): Promise<void> {
    try {
      await api.post(`/occurrence-classifications`, {
        occurrenceTypeId: classification.type.id,
        description: classification.description,
        severity: classification.severity,
      });
    } catch (e) {
      throw e.response.data;
    }
  },

  async updateClassification(
    classification: IOcurrenceClassification
  ): Promise<void> {
    try {
      await api.put(`/occurrence-classifications/${classification.id}`, {
        id: classification.id,
        occurrenceTypeId: classification.type.id,
        description: classification.description,
        severity: classification.severity,
      });
    } catch (e) {
      throw e.response.data;
    }
  },

  async deleteClassification(classificationId: number): Promise<void> {
    try {
      await api.delete(`/occurrence-classifications/${classificationId}`);
    } catch (e) {
      throw e.response.data;
    }
  },
};
