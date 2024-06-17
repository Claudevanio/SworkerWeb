import { DialogContext } from '@/contexts';
import { useContext } from 'react';

export const useDialog = () => useContext(DialogContext);
