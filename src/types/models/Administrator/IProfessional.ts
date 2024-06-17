import { ICompanyUnity } from './ICompanyUnity';
import { ISector } from './ISector';

export interface IProfessional {
  id: string;
  userId: string;
  companyUnityId: number;
  name: string;
  email: string;
  phone: string;
  registerNumber: string;
  roleId: string;
  standardSupervisor: boolean;
  unity: ICompanyUnity;
  unityProfessionals: {
    unityId: string;
    unityName: string;
  }[];
  cpf: string;
  active?: boolean;
  unityId?: string;
  sectorsIds: string[];
  sectors?: ISector[];
}
