import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { api } from "../api";

export const ocurrenceCharacterizationService = {
  async getCharacterizations(): Promise<IOcurrenceCharacterization[]> {
    const response = await api.get<IOcurrenceCharacterization[]>(
      `/occurrence-characterizations`
    );

    return response.data;
  },
};