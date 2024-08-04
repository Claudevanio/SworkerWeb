import { COLORS } from '@/utils';
import { Button as MuiButton, SxProps, Tooltip } from '@mui/material';
import Link from 'next/link';

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

export const MenuButton: React.FC<MenuButtonProps> = ({ variant = 'primary', children, className, sx, disabled, ...props }) => {
  const variantStyles: SxProps = {
    ...(variant === 'primary' && {}),
    ...sx
  };

  return (
    <>
      <Tooltip title={disabled ? 'Selecione uma empresa para prosseguir' : ''} placement="top">
        <MuiButton
          variant={'text'}
          style={
            variant === 'primary'
              ? {
                  backgroundColor: COLORS.sidebarHighlight,
                  border: '2px solid ' + COLORS.primary['400'],
                  borderRadius: '40px'
                }
              : {}
          }
          className={`flex items-center whitespace-nowrap rounded-2xl gap-2 p-4 h-14 w-full normal-case text-xs font-medium text-white ${className}`}
          sx={variantStyles}
          {...props}
        >
          {children}
        </MuiButton>
      </Tooltip>
    </>
  );
};

const disabledLinkClassNames = 'cursor-normal pointer-events-none text-primary-400';

export function LinkWithTooltip({
  href,
  children,
  className = '',
  disabled,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  disabled: boolean;
}) {
  return (
    <Tooltip title={disabled ? 'Selecione uma empresa para prosseguir' : ''} placement="bottom">
      <div>
        <Link href={href} className={disabled ? disabledLinkClassNames : className} {...props}>
          {children}
        </Link>
      </div>
    </Tooltip>
  );
}
