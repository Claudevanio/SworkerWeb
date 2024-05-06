import { IOcurrenceClassification } from './IOcurrenceClassification';

export interface IOcurrenceType {
  id: number;
  typeName: string;
  description: string;
  registerDate: string;
  classifications?: IOcurrenceClassification[];
}