import { KeyboardArrowLeft } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';

export const Linkback = ({ link, children, onClick }: { link?: string; children: React.ReactNode; onClick?: () => void }) => {
  return (
    <div className="text-[2rem] font-bold w-3/4 flex items-center gap-2">
      {onClick && (
        <div className="flex items-center text-xl">
          <IconButton onClick={onClick}>
            <KeyboardArrowLeft />
          </IconButton>
        </div>
      )}
      {link && (
        <Link href={link} className="flex items-center text-xl">
          <KeyboardArrowLeft />
        </Link>
      )}
      {children}
    </div>
  );
};
