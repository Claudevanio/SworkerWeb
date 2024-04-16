'use client'
import { DialogProvider, UserProvider } from '@/contexts';
import { queryClient } from '@/core';
import { theme } from '@/utils/theme';
import { ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';

export const Providers : React.FC<{children: React.ReactNode}> = ({children}) => {
  return ( 
      <QueryClientProvider 
        client={queryClient}
      >
        <UserProvider>
          <DialogProvider>
            <ThemeProvider
              theme={theme}>
                {
                  children
                }
            </ThemeProvider>
          </DialogProvider>
        </UserProvider>
      </QueryClientProvider> 
  );
}