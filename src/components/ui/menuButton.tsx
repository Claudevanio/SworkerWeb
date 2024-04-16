import { Button as MuiButton, SxProps } from '@mui/material';

interface MenuButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined';
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  sx?: SxProps;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  variant = 'primary',
  children,
  className,
  sx,
  ...props
}) => {
  const variantStyles: SxProps = {
    ...(variant === 'primary' && {
    }), 
    ...sx,
  };

  return (
    <MuiButton
      variant={'text'}
      style={
        variant ===  'primary' ?
        {
        backgroundColor: '#3B82F633',
        border: '2px solid #60A5FA',
        borderRadius: '40px', 
      } : {}
    }
      className={`flex items-center whitespace-nowrap rounded-2xl gap-2 p-4 h-14 w-full normal-case text-xs font-medium text-white ${className}`}
      sx={variantStyles}
      {...props}
    >
      {children}
    </MuiButton>
  );
}