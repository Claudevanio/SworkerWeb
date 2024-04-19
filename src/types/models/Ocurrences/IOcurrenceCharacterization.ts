export interface IOcurrenceCharacterization {
  id: number;
  type: Type;
  description: string;
}

interface Type {
  id: number;
  typeName: string;
  description: string;
  registerDate: string;
}
