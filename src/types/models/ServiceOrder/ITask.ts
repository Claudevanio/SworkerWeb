import { ITaskGroup } from './ITaskGroup';

export interface ITask {
  id?: number;
  code: string;
  name: string;
  professionalsCount: number;
  estimatedTime: number;
  taskGroupId: number;
  taskGroup?: ITaskGroup;
  reviewTask: boolean;
  taskRandom: boolean;
  digitalSignature: boolean;
  occurrenceIdIncomplete: any;
}

export interface ITaskSteps {
  id: number;
  taskId: number;
  subTaskId: number;
  taskTypeId: number;
  draggable?: number;
  taskTypeComplement: string;
  number: string;
  description: string;
  descriptionType: string;
  development: string;
  risks: string;
  control: string;
  notes: string;
  executed: boolean;
}

export interface ITaskStepsCreate {
  number: string;
  taskTypeId: number;
  taskTypeComplement: string;
  development: string;
  risks: string;
  control: string;
  notes: string;
  taskId: number;
  subTaskId: number;
  questionType?: '',
  questionAlternatives: [],
}

export interface ITaskType {
  id: number;
  description: string;
}