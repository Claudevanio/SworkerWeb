import { logoPath } from '@/utils';

export const Logo = ({
  width = '100px',
  height = '100px'
}: {
  width?: string;
  height?: string;
}) => {
    return (
        <div className="logo">
            <img src={
              logoPath
            } alt="logo" 
            style={{
              width,
              height
            }}
            />
        </div>
    );
}