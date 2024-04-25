export interface IContext {
  id: number;
  code: number;
  name: string;
  application: number;
  type: number;
  characterizationId: number;
  parameters: string
  intervalTime: number
  characterization: ICharacterization
}

interface ICharacterization {
    id: number
    type: number
    description: string
}