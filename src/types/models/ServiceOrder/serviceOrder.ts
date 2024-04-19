import { IEquipment } from '../Administrator';

export interface ServiceOrder {
  id: number;
  code: string;
  description: string;
  street: string;
  number: string | null;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string | null;
  serviceOrderStatusId: number;
  supervisorId: number;
  requestDate: string;
  executionDate: string;
  checkInMode: number;
  checkOutMode: number;
  checkInDate: string;
  checkOutDate: string;
  checkInEndereco: string;
  checkOutEndereco: string;
  supervisor?: {
    id: number;
    name: string;
  };
  status?: {
    id: number;
    description: string;
  };
  dispatchMode?: number;
  isActive: boolean;
  tagId: number;
  customerId: number;
  meetingStatus: number;
  customer?: {
    id: number;
    name: string;
  };
  serviceOrderProfessionals?: {
    professionalId: number;
    professionalName: string;
    isResponsible: boolean;
    checkInDate: string;
    checkOutDate: string;
  }[];
  serviceOrderTasks?: {
    taskId: number;
    taskCode: string;
    taskName: string;
    planned: boolean;
    executed: boolean;
    sequence: number;
    checkinDate: string;
  }[];
  serviceOrderTaskSteps?: any[]; // You can define the structure for this if available
  incompleteTaskStatus: boolean;
  integrated: boolean;
  integrationId: string;
  version: number;
  equipments?: IEquipment[]; // You can define the structure for this if available
}
