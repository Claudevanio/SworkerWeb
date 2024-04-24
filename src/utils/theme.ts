'use client';
import { createTheme } from '@mui/material';
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export const COLORS = {
  primary: {
    '50': '#EFF6FF',
    '100': '#DBEAFE',
    '200': '#BFDBFE',
    '300': '#93C5FD',
    '400': '#60A5FA',
    '500': '#3B82F6',
    '600': '#2563EB',
    '700': '#1D4ED8',
    'default': '#3B82F6',
  },
  base: {
    '1': "#FCFEFF",
    '2': '#F1F5F9',
    '3': '#E2E8F0',
    '4': '#94A3B8',
    '5': '#2F465E',
    '6': '#1E293B',
    '7': '#0F172A',
    '8': '#020617'
  },
  secondary: '#00B5B8',
  sidebarHighlight: '#3B82F633',
  danger: '#EB5757',
  erro: {
    '1': '#F0C0C2',
    '2': '#FF6C6C',
    '3': '#FF0000',
    '4': '#990000',
  },
  sucesso: {
    '1': '#B8F7AE',
    '2': '#5CE271',
    '3': '#009918',
    '4': '#158D28',
  },
  success: '#27AE60',
  warning: {
    '1': '#E9C186',
    '2': '#FFA012',
    '3': '#DC8B13',
    '4': '#A46405',
  },
  info: '#2F80ED',
  highlight: '#00B5B8',
  dark: '#212121',
  gray: {
    '1': '#343A40',
    '2': '#979797',
    '3': '#D9D9D9',
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#333',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2F80ED',
    },
    success: {
      main: '#27AE60',
    },
    warning: {
      main: '#DC8B13',
    },
    error: {
      main: '#EB5757',
    },
  },
  typography: {
    fontFamily: nunito.style.fontFamily,
  },

});