import { ICompanyUnity } from './ICompanyUnity';

export interface ISector {
  id: string;
  name: string;
  description?: string;
  unityId: string;
  unity?: ICompanyUnity
}