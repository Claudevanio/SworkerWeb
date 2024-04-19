import { basePagination } from "@/types";
import { IFilterOcurrences } from "@/types/models/Ocurrences/IFilterOcurrences";
import { api } from "..";
import { IOcurrenceRecognize } from "@/types/models/Ocurrences/IOcurrenceRecognize";

export const recognitionService = {
  async listOcurrenceAsync(
    term: string,
    currentPage: number,
    pageSize: number,
    filter: IFilterOcurrences,
    closed: boolean
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
};
