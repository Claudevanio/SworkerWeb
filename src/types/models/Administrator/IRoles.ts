export interface IRole {
  id?: string;
  roleId: string;
  name: string;
  permissions: IPermissions[];
}


export enum EtipoPermissao {
  Nada = 0,
  Visualizacao = 1,
  Operacao = 2,
  Supervisao = 3,
  Administracao = 4
}


export interface IPermissions {
  type: string;
  value: EtipoPermissao;
  name: string;
}