import { basePagination } from "@/types";
import { IOcurrence } from "@/types/models/Ocurrences/IOcurrence";
import { api } from "../api";
import { IOcurrenceRecognize } from "@/types/models/Ocurrences/IOcurrenceRecognize";
import { IFilterOcurrences } from "@/types/models/Ocurrences/IFilterOcurrences";

export const generateService = {
  async listOcurrenceAsync(
    term: string,
    currentPage: number,
    pageSize: number,
    filter: IFilterOcurrences
  ): Promise<basePagination<IOcurrence>> {
    const response = await api.get<IOcurrence[]>(`/occurrences`, {
      params: {
        term: filter.queryCod,
        currentPage,
        pageSize,
        number: filter.numberOcurrence,
        professionalname: filter.professional,
        start: filter.registerDateStart,
        end: filter.registerDateEnd,
        statusofavaliation: filter.status,
        type: filter.type,
        origin: filter.origin,
        evaluationStart: filter.availableDateStart,
        evaluationEnd: filter.availableDateEnd,
      },
    });

    const data: IOcurrence[] = response.data;

    const responseCount = await api.get("/occurrences/count", {
      params: {
        term: filter.queryCod,
        currentPage,
        pageSize,
        number: filter.numberOcurrence,
        professionalname: filter.professional,
        start: filter.registerDateStart,
        end: filter.registerDateEnd,
        statusofavaliation: filter.status,
        type: filter.type,
        origin: filter.origin,
        evaluationStart: filter.availableDateStart,
        evaluationEnd: filter.availableDateEnd,
      },
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async updateOcurrenceAsync(item: IOcurrence): Promise<void> {
    try {
      await api.put<void>(
        `/occurrences/${item.id}`,
        {
          characterizationId: item.characterization.id,
          registerDate: item.registerDate,
          local: item.local,
          description: item.description,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
        }
      );
    } catch (e) {
      throw e.response.data;
    }
  },

  async recognizeOcurrenceAsync(item: IOcurrenceRecognize): Promise<void> {
    try {
      await api.post<void>(
        `/occurrences/${item.occurrenceId}/recognize`,
        item,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
        }
      );
    } catch (e) {
      throw e.response.data;
    }
  },
};
