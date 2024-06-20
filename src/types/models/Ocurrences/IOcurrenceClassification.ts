export interface IOcurrenceClassification {
  id: number;
  type: Type;
  description: string;
  severity: number;
  deleted_at: string;
}

interface Type {
  id: number;
  typeName?: string;
  description?: string;
  registerDate?: string;
}
