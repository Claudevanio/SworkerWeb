export interface IOcurrence {
  id: number;
  number: number;
  registerNumber: string;
  occurrenceType: ListOccurrenceTypeModel;
  occurrenceTypeId: number;
  professional: ListOccurrenceProfessionalModal;
  characterization: ListOccurrenceCharacterizationModel;
  serviceOrder: ListOccurrenceServiceOrder;
  context: ListOccurrenceContext;
  registerDate: string;
  evaluateDate: string;
  local: string;
  description: string;
  observation: string;
  origin: string;
  evaluated: boolean;
  acknowledged: boolean;
  auditStatus: boolean;
}

export interface ListOccurrenceTypeModel {
  id: number;
  typeName: string;
  description: string;
  registerDate: string;
}

export interface ListOccurrenceProfessionalModal {
  id: number;
  name: string;
}

export interface ListOccurrenceCharacterizationModel {
  id: number;
  type: ListOccurrenceTypeModel;
  description: string;
}

export interface ListOccurrenceServiceOrder {
  id: number;
  code: string;
  description: string;
  status: ListOccurrenceServiceOrderStatus;
}

export interface ListOccurrenceServiceOrderStatus {
  id: number;
  description: string;
}

export interface ListOccurrenceContext {
  name: string;
}
