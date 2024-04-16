export interface IEquipment {
  id?: string;
  uid: string;
  hwid: string;
  classificationId: string;
  manufacturer: string;
  model: string;
  brand: string;
  release: string;
  context: string;
  manualFile: string;
  manufactureDate: string;
  status: boolean;
  equipmentClassification: IEquipmentClassification;
}

export interface IEquipmentType {
  id?: string;
  code: string;
  description: string;
}

export interface IEquipmentClassification {
  id?: string;
  typeId: string;
  name: string;
  code: string;
  description: string;
}