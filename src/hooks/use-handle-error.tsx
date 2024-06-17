import { useState, useEffect } from 'react';
import { useCatch } from './use-catch';
import { useDialog } from '@/hooks/use-dialog';

export function useHandleError() {
  const [error, setError] = useState<unknown | null>(null);
  const [title, setTitle] = useState<string | undefined>();
  const { confirmDialog } = useDialog();

  const catchError = useCatch;

  useEffect(() => {
    if (error) {
      catchError(confirmDialog, error, title);
      setError(null);
    }
  }, [error, confirmDialog, catchError, title]);

  const handleError = (error: unknown, title?: string) => {
    if (!error) {
      setError({
        response: {
          data: {
            erros: ['Erro desconhecido']
          }
        }
      });
      setTitle(title);
      return;
    }
    setError(error);
    setTitle(title);
  };

  return handleError;
}
