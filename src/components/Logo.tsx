import { logoPath } from '@/utils';

export const Logo = ({
  width = '100px',
  height = '100px',
  className = ''
}: {
  width?: string;
  height?: string;
  className?: string;
}) => {
  if (!logoPath) {
    return null;
  }
    return (
        <div className={
          `flex items-center justify-center ${className}`
        
        }>
            <img src={
              logoPath
            } alt="logo" 
            style={{
              width,
              height
            }}
            className='aspect-video'
            />
        </div>
    );
}