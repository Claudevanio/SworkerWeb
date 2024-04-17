'use client'
import { basePagination } from './../../types/basePagination';
import { IEquipment, IEquipmentClassification, IEquipmentType } from '@/types';
import { api } from '../api';

export const equipmentTypeService = {
  async countEquipmentTypeAsync (code: string, description: string, term: string): Promise<number> {
    const response = await api.get<number>('/equipment-types/count', {
      params: { code, description, term },
    });
    return response.data;
  },

  async listEquipmentTypeAsync (term?: string, currentPage = 0, pageSize = 99): Promise<IEquipmentType[]> {
    const response = await api.get<IEquipmentType[]>('/equipment-types', {
      params: { term, currentPage, pageSize },
    });

    return response.data

    // const count = await this.countEquipmentTypeAsync(code, description, term);

    // return { items: response.data, count };
  },

  async addEquipmentTypeAsync (item: IEquipmentType): Promise<IEquipmentType> {
    const response = await api.post<IEquipmentType>('/equipment-types', item);
    return response.data;
  },

  async updateEquipmentTypeAsync (item: IEquipmentType): Promise<void> {
    await api.put<void>(`/equipment-types/${item.id}`, item);
  },

  async removeEquipmentTypeAsync (id: string): Promise<void> {
    await api.delete<void>(`/equipment-types/${id}`);
  },
};

export const equipmentClassificationService = {
  async countEquipmentClassificationAsync (code: string, description: string, typeId: string, term: string): Promise<number> {
    const response = await api.get<number>('/equipment-classifications/count', {
      params: { code, description, typeId, term },
    });
    return response.data;
  },

  async listEquipmentClassificationAsync (term?: string, currentPage = 0, pageSize = 99): Promise<IEquipmentClassification[]> {
    const response = await api.get<IEquipmentClassification[]>('/equipment-classifications', {
      params: { term, currentPage, pageSize },
    });
    return response.data;
  },

  async addEquipmentClassificationAsync (item: IEquipmentClassification): Promise<IEquipmentClassification> {
    const response = await api.post<IEquipmentClassification>('/equipment-classifications', item);
    return response.data;
  },

  async updateEquipmentClassificationAsync (item: IEquipmentClassification): Promise<void> {
    await api.put<void>(`/equipment-classifications/${item.id}`, item);
  },

  async removeEquipmentClassificationAsync (id: string): Promise<void> {
    await api.delete<void>(`/equipment-classifications/${id}`);
  },
};


export const equipmentService = {
  async countAsync ({
    uid,
    hwid,
    brand,
    manufacturer,
    classification,
    active,
    inspectionExpired,
    term,
  }: {
    uid?: string;
    hwid?: string;
    brand?: string;
    manufacturer?: string;
    classification?: string;
    active?: boolean;
    inspectionExpired?: boolean;
    term?: string;
  }): Promise<number> {
    const response = await api.get<{ count: number }>('/equipaments/count', {
      params: { uid, hwid, brand, manufacturer, classification, active, inspectionExpired, term },
    });
    const { count } = response.data;
    return count;
  },

  async getEquipmentsAsync ({
    uid,
    hwid,
    brand,
    manufacturer,
    classification,
    active,
    inspectionExpired,
    term,
    currentPage,
    pageSize,
  }: {
    uid?: string;
    hwid?: string;
    brand?: string;
    manufacturer?: string;
    classification?: string;
    active?: boolean;
    inspectionExpired?: boolean;
    term?: string;
    currentPage?: number;
    pageSize?: number;
  }): Promise<basePagination<IEquipment>> {

    // const mockData: basePagination<IEquipment> = {
    //   items: [
    //     {
    //       id: '1',
    //       uid: '1',
    //       hwid: '1',
    //       classificationId: '1',
    //       manufacturer: '1',
    //       model: '1',
    //       brand: '1',
    //       release: '1',
    //       context: '1',
    //       manualFile: '1',
    //       manufactureDate: '1',
    //       status: true,
    //       equipmentClassification: {
    //         id: '1',
    //         typeId: '1',
    //         name: '1',
    //         code: '1',
    //         description: '1',
    //       },
    //     },
    //     {
    //       id: '2',
    //       uid: '2',
    //       hwid: '2',
    //       classificationId: '2',
    //       manufacturer: '2',
    //       model: '2',
    //       brand: '2',
    //       release: '2',
    //       context: '2',
    //       manualFile: '2',
    //       manufactureDate: '2',
    //       status: true,
    //       equipmentClassification: {
    //         id: '2',
    //         typeId: '2',
    //         name: '2',
    //         code: '2',
    //         description: '2',
    //       },
    //     }
    //   ],
    //   count: 2,
    // };

    // const filteredData = mockData.items.filter(
    //   equipment => {
    //     if (term) {
    //       return Object.values(equipment).some(value => String(value).toLowerCase().includes(term.toLowerCase()));
    //     }
    //     return true;
    //   }
    // );

    // // Paginate
    // const startIndex = (currentPage - 1) * pageSize;
    // const endIndex = startIndex + pageSize;
    // const paginatedData = filteredData.slice(startIndex, endIndex);

    // return Promise.resolve(
    //   { items: paginatedData, count: paginatedData.length }
    // );

    const response = await api.get<IEquipment[]>('/equipaments', {
      params: { uid, hwid, brand, manufacturer, classification, active, inspectionExpired, term, currentPage, pageSize },
    });
    const count = await this.countAsync({ uid, hwid, brand, manufacturer, classification, active, inspectionExpired, term });

    return { items: response.data, count };

  },

  async getClassificationsAsync (): Promise<IEquipmentClassification[]> {
    const response = await api.get<any[]>('/equipaments/classifications');
    return response.data;
  },

  async getAssignmentsAsync (uid: string): Promise<any[]> {
    const response = await api.get<any[]>(`/equipaments/${uid}/assignments`);
    return response.data;
  },

  async getStoryAsync (uid: string): Promise<any[]> {
    const response = await api.get<any[]>(`/equipaments/${uid}/story`);
    return response.data;
  },

  async createEquipmentAsync (equipment: IEquipment): Promise<IEquipment> {
    const response = await api.post<IEquipment>('/equipaments', equipment);
    return response.data;
  },

  async createEquipmentInspectionAsync (equipmentInspection: any): Promise<any> {
    const response = await api.post<any>(`/equipaments/${equipmentInspection.equipamentId}/inspections`, equipmentInspection);
    return response.data;
  },

  async getEquipmentInspectionAsync (equipmentId: string): Promise<any[]> {
    const response = await api.get<any[]>(`/equipaments/${equipmentId}/inspections`);
    return response.data;
  },

  async updateEquipmentAsync (equipment: IEquipment): Promise<void> {
    await api.put<void>(`/equipaments/${equipment.id}`, equipment);
  },

  async removeEquipmentAsync (id: string): Promise<void> {
    await api.delete<void>(`/equipaments/${id}`);
  },

  async assignEquipmentAsync (item: any): Promise<any> {
    const response = await api.put<any>(`/equipaments/${item.uid}/pick-up`, item);
    return response.data;
  },

  async returnEquipmentAsync (item: any): Promise<any> {
    const response = await api.put<any>(`/equipaments/${item.uid}/return`, item);
    return response.data;
  },

  async getQrcodes (qrCodeList: string[]): Promise<any> {
    const query = qrCodeList.map(qrCode => `uis=${qrCode}`).join('&');
    const response = await api.get<any>('/equipaments/qrcode?' + query, {
      headers: {
        Accept: '*/*',
      },
      responseType: "arraybuffer"
    });

    if (response.data) {
      const newBlob = new Blob([response.data], { type: "arraybuffer" });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(newBlob);
      link.setAttribute('download', 'EquipamentsCode.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    }

    return response.data;
  },
};