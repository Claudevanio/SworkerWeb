import { COLORS } from '@/utils';
import { QrCode } from '@mui/icons-material';
import { CircularProgress, Button as MuiButton, SxProps } from '@mui/material';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'error';
  children: React.ReactNode;
  onClick?: (e: any) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  sx?: SxProps;
  isPillButton?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, isPillButton, isLoading = false, ...props }) => {
  const methods = useFormContext();
  return (
    <MuiButton
      variant={variant === 'primary' ? 'contained' : 'outlined'}
      className={`${className} ${isPillButton ? 'rounded-full' : 'rounded-lg'} flex items-center gap-2 px-4 py-2 md:h-11 normal-case text-xs md:text-base ${variant === 'primary' ? 'bg-primary-600 hover:bg-primary-600 text-white' : ' border-primary-600 text-primary-600 hover:border-primary-600 '} ${variant === 'error' && '!bg-erro-3 text-white !border-erro-3 outline-none hover:bg-erro-3'}  `}
      {...props}
      disabled={isLoading || props.disabled || methods?.control?._formState?.isSubmitting}
      sx={{
        '&:disabled': {
          backgroundColor: COLORS['primary']['300'],
          color: COLORS['base']['1'],
          cursor: 'not-allowed'
        }
      }}
    >
      {isLoading ? <CircularProgress size={20} color="inherit" /> : children}
    </MuiButton>
  );
};

interface FiltroButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  isMobile?: boolean;
}

export const FiltroButton: React.FC<FiltroButtonProps> = ({ onClick, className = '' }) => {
  return (
    <Button onClick={onClick} variant="secondary" className={'!border-primary-400 !text-primary-400' + className}>
      <FiltrarImage />
      Filtrar
    </Button>
  );
};

const FiltrarImage = () => (
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.25 17.25C14.2 17.25 13.3125 16.8875 12.5875 16.1625C11.8625 15.4375 11.5 14.55 11.5 13.5C11.5 12.45 11.8625 11.5625 12.5875 10.8375C13.3125 10.1125 14.2 9.75 15.25 9.75C16.3 9.75 17.1875 10.1125 17.9125 10.8375C18.6375 11.5625 19 12.45 19 13.5C19 14.55 18.6375 15.4375 17.9125 16.1625C17.1875 16.8875 16.3 17.25 15.25 17.25ZM15.25 15.25C15.7333 15.25 16.1458 15.0792 16.4875 14.7375C16.8292 14.3958 17 13.9833 17 13.5C17 13.0167 16.8292 12.6042 16.4875 12.2625C16.1458 11.9208 15.7333 11.75 15.25 11.75C14.7667 11.75 14.3542 11.9208 14.0125 12.2625C13.6708 12.6042 13.5 13.0167 13.5 13.5C13.5 13.9833 13.6708 14.3958 14.0125 14.7375C14.3542 15.0792 14.7667 15.25 15.25 15.25ZM1.5 14.5V12.5H9.5V14.5H1.5ZM3.75 8.25C2.7 8.25 1.8125 7.8875 1.0875 7.1625C0.3625 6.4375 0 5.55 0 4.5C0 3.45 0.3625 2.5625 1.0875 1.8375C1.8125 1.1125 2.7 0.75 3.75 0.75C4.8 0.75 5.6875 1.1125 6.4125 1.8375C7.1375 2.5625 7.5 3.45 7.5 4.5C7.5 5.55 7.1375 6.4375 6.4125 7.1625C5.6875 7.8875 4.8 8.25 3.75 8.25ZM3.75 6.25C4.23333 6.25 4.64583 6.07917 4.9875 5.7375C5.32917 5.39583 5.5 4.98333 5.5 4.5C5.5 4.01667 5.32917 3.60417 4.9875 3.2625C4.64583 2.92083 4.23333 2.75 3.75 2.75C3.26667 2.75 2.85417 2.92083 2.5125 3.2625C2.17083 3.60417 2 4.01667 2 4.5C2 4.98333 2.17083 5.39583 2.5125 5.7375C2.85417 6.07917 3.26667 6.25 3.75 6.25ZM9.5 5.5V3.5H17.5V5.5H9.5Z"
      fill={COLORS.primary['400']}
    />
  </svg>
);
