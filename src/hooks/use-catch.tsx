import { IError } from '@/types';

export async function useCatch(showDialog: (params: { title: string; message: string }) => void, error: unknown, title?: string) {
  if (!error) return;

  const typedError = error as IError;

  const dialogTitle = title || 'Erro na requisição';

  const message = typedError.response?.data?.erros
    ? typedError.response?.data?.erros[0]
    : JSON.stringify(typedError.response?.data) ?? 'Erro desconhecido';

  await showDialog({
    title: dialogTitle,
    message
  });
}
