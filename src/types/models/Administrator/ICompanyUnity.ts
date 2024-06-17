import { ICompany } from './ICompany';
import { ISector } from './ISector';

export interface ICompanyUnity {
  id?: string;
  name: string;
  phone: number;
  active: boolean;
  sectorId: string;
  address?: {
    companyUnityId: number;
    zipCode: string;
    state?: string;
    city?: string;
    neighborHood?: string;
    street?: string;
    number?: string;
    complement?: string;
  };
  company?: ICompany;
  sectors?: ISector[];
}
