import { ICompanyUnity } from './ICompanyUnity';

export interface ISector {
  id: string;
  name: string;
  unityId: string;
  unity?: ICompanyUnity
}