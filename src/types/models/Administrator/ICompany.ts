export interface ICompany {
  id?: string;
  name: string;
  cnpj: number;
  responsible: string;
  phone: string;
  email: string;
  active: boolean;
  logoPath: string;
}