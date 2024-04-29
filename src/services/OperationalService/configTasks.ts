import { basePagination } from "@/types";
import { api } from "../api";
import { ITask, ITaskSteps, ITaskType } from "@/types/models/ServiceOrder/ITask";

export const configTaskService = {
  async listTaskAsync (filters?: any): Promise<basePagination<ITask>> {
    const response = await api.get<ITask[]>(`/tasks`, {
      data: {},
      params: {
        ...filters,
      },
    });

    const data: ITask[] = response.data;

    const responseCount = await api.get("/tasks/count", {
      data: {},
      params: {
        ...filters,
      },
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async updateTask (
    Task: ITask
  ): Promise<void> {
    try {
      await api.put(`/tasks/${Task.id}`, Task);
    } catch (e) {
      throw e.response.data;
    }
  },

  async createTask (
    Task: ITask
  ): Promise<{
    data: {
      id: number;
    };
  }> {
    try {
      const response = await api.post(`/tasks`, Task);
      return response.data;
    } catch (e) {
      throw e.response.data;
    }
  },

  async removeTask (
    Task: ITask
  ): Promise<void> {
    try {
      await api.delete(`/tasks/${Task.id}`, {
        data: {}
      });
    } catch (e) {
      throw e.response.data;
    }
  },

  async getTaskSteps (task: ITask): Promise<ITaskSteps[]> {
    const response = await api.get<ITaskSteps[]>(`/tasks/${task.id}/steps`, {
    });

    return response.data;
  },

  async createTaskStep (task: string | number, step: ITaskSteps): Promise<{
    data: {
      id: number;
    }
  }> {
    const response = await api.post(`/tasks/${task}/steps`, step);
    return response.data;
  },

  async updateTaskStep (task: string | number, step: ITaskSteps): Promise<void> {
    await api.put(`/tasks/${step.id}/steps/`, step);
  },

  async getTaskResources (task: ITask): Promise<any> {
    const response = await api.get<any>(`/tasks/${task.id}/resources`, {
    });

    return response.data;
  },

  async getTypes (): Promise<ITaskType[]> {
    const response = await api.get<ITaskType[]>('/task-types',
      {
        data: {},
      }
    );
    return response.data;
  },

  async createTasksResources (taskId: string | number, resourceId: string | number): Promise<void> {
    await api.post(`/tasks/${taskId}/resources`, { taskId, resourceId });
  },


};