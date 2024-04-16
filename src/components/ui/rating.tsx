import { Rating as MuiRating} from '@mui/material';

export const Rating = ({ 
  value,
  onChange,
}: { 
  value: number
  onChange?: (event: React.ChangeEvent<{}>, value: number | null) => void
}) => {
  return <MuiRating defaultValue={0} precision={0.5}
    value={value}
    onChange={onChange}
    sx={{
    color: '#00B5B8',
    '& .MuiRating-iconFilled': {
    },
    '& .MuiRating-iconHover': {
      color: '#00B5B8',
    },
  
    }}
  />
}