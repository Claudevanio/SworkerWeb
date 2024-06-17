'use client';
import { createTheme } from '@mui/material';
import { Nunito } from 'next/font/google';
import { ENVIROMENTCOLORS } from './constants';

const nunito = Nunito({ subsets: ['latin'] });
interface ColorPalette {
  primary: {
    [key: string]: string;
    default: string;
  };
  base: {
    [key: string]: string;
  };
  secondary: string;
  sidebarHighlight: string;
  danger: string;
  erro: {
    [key: string]: string;
  };
  sucesso: {
    [key: string]: string;
  };
  success: string;
  warning: {
    [key: string]: string;
  };
  info: string;
  highlight: string;
  dark: string;
  gray: {
    [key: string]: string;
  };
}

const COLORSENV: ColorPalette = JSON.parse(ENVIROMENTCOLORS);

export const COLORS: ColorPalette = {
  ...COLORSENV
};

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary['600'],
      contrastText: '#ffffff'
    },
    secondary: {
      main: COLORS.base['8'],
      contrastText: '#ffffff'
    },
    info: {
      main: COLORS.info
    },
    success: {
      main: COLORS.success
    },
    warning: {
      main: COLORS.warning['3']
    },
    error: {
      main: COLORS.danger
    }
  },
  typography: {
    fontFamily: nunito.style.fontFamily
  }
});
