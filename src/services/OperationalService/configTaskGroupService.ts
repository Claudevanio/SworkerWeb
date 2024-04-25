import { basePagination } from "@/types";
import { api } from "../api";
import { ITaskGroup } from "@/types/models/ServiceOrder/ITaskGroup";

export const configTaskGroupService = {
  async listTaskGroupAsync (filters?: any): Promise<basePagination<ITaskGroup>> {
    const response = await api.get<ITaskGroup[]>(`/task-groups`, {
      data: {},
      params: {
        ...filters,
      },
    });

    const data: ITaskGroup[] = response.data;

    const responseCount = await api.get("/task-groups/count", {
      data: {},
      params: {
        ...filters,
      },
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async updateTaskGroup (
    TaskGroup: ITaskGroup
  ): Promise<void> {
    try {
      await api.put(`/task-groups/${TaskGroup.id}`, TaskGroup);
    } catch (e) {
      throw e.response.data;
    }
  },

  async createTaskGroup (
    TaskGroup: ITaskGroup
  ): Promise<void> {
    try {
      await api.post(`/task-groups`, TaskGroup);
    } catch (e) {
      throw e.response.data;
    }
  },

  async removeTaskGroup (
    TaskGroup: ITaskGroup
  ): Promise<void> {
    try {
      await api.delete(`/task-groups/${TaskGroup.id}`, {
        data: {}
      });
    } catch (e) {
      throw e.response.data;
    }
  },


};