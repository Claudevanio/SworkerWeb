
export interface ITags {
  id: number;
  uid: string;
  hwid: string;
  registrationDate: string;
  status: number;
  localization: null | any;
  mode: number;
  tagTypeId: number;
  customerId: number;
  description: string;
  customer: {
    id: number;
    name: string;
  };
}

export interface ITagsTasks {
  id?: number;
  tagId: number;
  task: {
    id: number;
    code: string;
    name: string;
    professionalsCount: number;
    estimatedTime: number;
    taskGroup: any;
    reviewTask: boolean;
    taskRandom: boolean;
    digitalSignature: boolean;
    occurrenceIdIncomplete: number;
  };
  sequence: number;
  number?: number;
  tagName: string;
  taskId?: number;
}

export interface ITagsTypes {
  id: number;
  description: string;
}