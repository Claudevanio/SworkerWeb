import { AddOutlined } from '@mui/icons-material';
import { Button } from '../ui';
import { IconButton } from '@mui/material';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  button: {
    label: string;
    onClick: () => void;
    isAdd?: boolean;
    hideOnMobile?: boolean;
  }
}

export function PageTitle(
  { title, subtitle, onBack, button }: PageTitleProps
) {
  return (
    <>
    <div
      className='hidden flex-col gap-2 md:flex'
    >
      <div
        className=' md:flex items-center justify-between w-full'
      >
        <h1
          className='text-base-8 text-2xl font-bold'
        >
          {title}
        </h1>
        
      <Button
        onClick={
          () => button.onClick()
        }
      >
        {button.isAdd && <AddOutlined/>}
        {button.label}
      </Button>
      </div>
        {subtitle && (
          <p
            className='text-base-5 text-base font-medium'
          >
            {subtitle}
          </p>
        )}
    </div>
      {
        !button.hideOnMobile &&
        <IconButton
          onClick={button.onClick}
          className='bg-primary-700 text-primary-50 md:hidden focus:!bg-primary-600 hover:!bg-primary-600 fixed right-8 bottom-[20%] z-[2] w-14 h-14'
        >
          <AddOutlined
            fontSize='large'
          />
        </IconButton>
      }
    </>
  )
}