import { basePagination } from '@/types';
import { api } from '../api';
import { ITags, ITagsTasks, ITagsTypes } from '@/types/models/ServiceOrder/ITags';
import { ITask } from '@/types/models/ServiceOrder/ITask';

export const TagsService = {
  async listTagsAsync(filters?: any): Promise<basePagination<ITags>> {
    const response = await api.get<ITags[]>(`/tags`, {
      data: {},
      params: {
        ...filters
      }
    });

    const data: ITags[] = response.data;

    const responseCount = await api.get('/tags/count', {
      data: {},
      params: {
        ...filters
      }
    });

    const count: number = responseCount.data.count;

    return Promise.resolve({ items: data, count: count });
  },

  async updateTags(Tags: ITags): Promise<void> {
    try {
      await api.put(`/tags/${Tags.id}`, Tags);
    } catch (e) {
      throw e.response.data;
    }
  },

  async createTags(Tags: ITags): Promise<{
    data: {
      id: number;
    };
  }> {
    try {
      const response = await api.post(`/tags`, Tags);
      return response.data;
    } catch (e) {
      throw e.response.data;
    }
  },

  async removeTags(Tags: ITags): Promise<void> {
    try {
      await api.delete(`/tags/${Tags.id}`, {
        data: {}
      });
    } catch (e) {
      throw e.response.data;
    }
  },

  async deleteTagsStep({ tagId, taskId }: { tagId: number; taskId: number }): Promise<void> {
    await api.delete(`/tags-tasks/${tagId}/${taskId}`, {
      data: {}
    });
  },

  async getAvailableTasks(id: number): Promise<ITask[]> {
    const response = await api.get<ITask[]>(`/tags/${id}/available-tasks`, {});

    return response.data;
  },

  async getTagsSteps(uid: string): Promise<ITagsTasks[]> {
    const response = await api.get<ITagsTasks[]>(`/tags-tasks?codigoUID=${uid}`, {});

    return response.data;
  },

  async createTagsStep(step: { tagId: number; taskId: number; sequence: number }): Promise<{
    data: {
      id: number;
    };
  }> {
    const response = await api.post(`/tags-tasks`, step);
    return response.data;
  },

  // async updateTagsStep (task: string | number, step: ITagsSteps): Promise<void> {
  //   await api.put(`/tags/${step.id}/steps/`, step);
  // },

  async getTagsResources(task: ITags): Promise<any> {
    const response = await api.get<any>(`/tags/${task.id}/resources`, {});

    return response.data;
  },

  async getTypes(): Promise<ITagsTypes[]> {
    const response = await api.get<ITagsTypes[]>('/tags_types', {
      data: {}
    });
    return response.data;
  },

  async createTagssResources(taskId: string | number, resourceId: string | number): Promise<void> {
    await api.post(`/tags/${taskId}/resources`, { taskId, resourceId });
  },

  async exportTags(uids: string[]): Promise<void> {
    if (uids.length === 0) return;
    const data = {};
    const response = await api.get<any>('/tags/qrcode', {
      params: {
        uis: uids.join('&')
      },
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json-patch+json'
      },
      data,
      responseType: 'arraybuffer'
    });

    if (response.data) {
      const newBlob = new Blob([response.data], { type: 'arraybuffer' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(newBlob);
      link.setAttribute('download', 'ProcedimentosQrCode.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    }

    return response.data;
  }
};
