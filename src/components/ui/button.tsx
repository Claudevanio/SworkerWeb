import { COLORS } from '@/utils';
import { QrCode } from '@mui/icons-material';
import { CircularProgress, Button as MuiButton, SxProps } from '@mui/material';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
 
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'error';
  children: React.ReactNode;
  onClick?: (e : any) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  sx?: SxProps;
  isPillButton?: boolean;
}

export const Button : React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  isPillButton,
  isLoading = false,
  ...props
}) => {
  const methods = useFormContext(); 
  return (
    <MuiButton  variant={variant === 'primary' ? 'contained' : 'outlined'}
      className={`${className} ${isPillButton ? "rounded-full" : "rounded-lg"} flex items-center gap-2 px-4 py-2 md:h-11 normal-case text-xs md:text-base ${variant === 'primary' ? 'bg-primary-600 hover:bg-primary-600 text-white' : ' border-primary-600 text-primary-600 hover:border-primary-600 '} ${variant === 'error' && '!bg-erro-3 text-white !border-erro-3 outline-none hover:bg-erro-3'}  `}
      {...props}
      disabled={isLoading || props.disabled || methods?.control?._formState?.isSubmitting}
      sx={{
        '&:disabled': {
          backgroundColor: COLORS['primary']['300'],
          color: COLORS['base']['1'],
          cursor: 'not-allowed'
        },
      }}
    >
      {
        isLoading ? (
          <CircularProgress
            size={20}
            color='inherit'
          />)
          : children
      }
    </MuiButton>
  );
}

interface FiltroButtonProps { 
  onClick: () => void; 
  className?: string;
  disabled?: boolean;
  isMobile?: boolean;
}

export const FiltroButton: React.FC<FiltroButtonProps> = ({ onClick, className = '' }) => {
  return (
    <Button
      onClick={onClick}
      variant='secondary'
      className={'!border-primary-400 !text-primary-400' + className}
      > 
      <Image
        src='/filter_icon.svg'
        width={24}
        alt='Filtrar'
        height={24} 
      />
        Filtrar
    </Button>
  )
}

export const ExportButton: React.FC<FiltroButtonProps> = ({ onClick, className='', disabled }) => {
  return (
    <Button
      onClick={onClick}
      variant={disabled ? 'secondary' : 'primary'} 
      className={className}
      > 
      <QrCode
        className='text-[1.5rem]'
      />
        Exportar
    </Button>
  )
}