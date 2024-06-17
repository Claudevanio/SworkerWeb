import { ICompanyUnity } from './ICompanyUnity';

export interface ISector {
  id?: string;
  description?: string;
  hasErros?: boolean;
  companyId: string | number;
  erros?: any;
}
