import { basePagination } from "@/types";
import { IOcurrence } from "@/types/models/Ocurrences/IOcurrence";
import { api } from "../api";
import { IOcurrenceRecognize } from "@/types/models/Ocurrences/IOcurrenceRecognize";
import { IFilterOcurrences } from "@/types/models/Ocurrences/IFilterOcurrences";

export const ocurrenceService = {
  async getCountOcurrence(dateStart: string, dateEnd: string) {
    const responseCount = await api.get("/occurrences/count", {
      params: {
        start: dateStart,
        end: dateEnd,
      },
    });

    const count: number = responseCount.data.count;

    return count;
  },

  async getCountOcurrenceRecognize(dateStart: string, dateEnd: string) {
    const responseCount = await api.get("/recognized-occurrences/count", {
      params: {
        acknowledgedStart: dateStart,
        acknowledgedEnd: dateEnd,
        closed: false
      },
    });

    const count: number = responseCount.data.count;

    return count;
  },

  async getCountOcurrenceClose(dateStart: string, dateEnd: string) {
    const responseCount = await api.get("/recognized-occurrences/count", {
      params: {
        closedStart: dateStart,
        closedEnd: dateEnd,
        closed: true,
      },
    });

    const count: number = responseCount.data.count;

    return count;
  },

  async listOcurrenceAsync(
    term: string | null,
    currentPage: number | null,
    pageSize: number | null,
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

  async listOcurrenceRecognitionAsync(
    term: string,
    currentPage: number,
    pageSize: number,
    filter: IFilterOcurrences,
    closed?: boolean
  ): Promise<basePagination<IOcurrenceRecognize>> {
    const response = await api.get<IOcurrenceRecognize[]>(
      `/recognized-occurrences`,
      {
        params: {
          term: filter.queryCod,
          currentPage,
          pageSize,
          number: filter.numberOcurrence,
          professionalname: filter.professional,
          supervisorname: filter.supervisor,
          caracterizationId: filter.characterization,
          type: filter.type,
          classificationId: filter.classification,
          origin: filter.origin,
          start: filter.registerDateStart,
          end: filter.registerDateEnd,
          acknowledgedStart: filter.recognitionDateStart,
          acknowledgedEnd: filter.recognitionDateEnd,
          closedStart: filter.endingDateStart,
          closedEnd: filter.endingDateEnd,
          closed: closed,
        },
      }
    );

    const data: IOcurrenceRecognize[] = response.data;

    const responseCount = await api.get("/recognized-occurrences/count", {
      params: {
        term: filter.queryCod,
        currentPage,
        pageSize,
        number: filter.numberOcurrence,
        acknowledgedStart: filter.recognitionDateStart,
        acknowledgedEnd: filter.recognitionDateEnd,
        professionalname: filter.professional,
        supervisorname: filter.supervisor,
        start: filter.registerDateStart,
        end: filter.registerDateEnd,
        caracterizationId: filter.characterization,
        classificationId: filter.classification,
        type: filter.type,
        origin: filter.origin,
        closed: closed,
      },
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async closeOcurrenceAsync(item: IOcurrenceRecognize): Promise<void> {
    await api.post<void>(`/occurrences/${item.occurrenceId}/recognize`, item, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json-patch+json",
      },
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
