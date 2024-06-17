import { COLORS } from '@/utils';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Checkbox, Radio } from '@mui/material';

interface CheckBoxProps {
  label?: string;
  value: boolean;
  onChange: () => void;
  className?: string;
  size?: string;
  variant?: 'primary' | 'secondary';
}

export function CheckBoxRadio({ label, size = '2rem', ...props }: CheckBoxProps) {
  return (
    <div className="flex gap-2 items-center">
      <Radio
        checked={props.value}
        onClick={props.onChange}
        icon={
          <RadioButtonUnchecked
            sx={{
              fontSize: size
            }}
          />
        }
        checkedIcon={
          <RadioButtonChecked
            sx={{
              fontSize: size
            }}
          />
        }
      />
      <label className={props.className}>{label}</label>
    </div>
  );
}

export function CheckBox({ label, variant = 'primary', ...props }: any) {
  return (
    <div className="flex gap-2 items-center">
      <Checkbox
        {...props}
        checked={props.value}
        onClick={props.onChange}
        sx={{
          '&.Mui-checked': {
            color: variant === 'secondary' ? COLORS['primary']['600'] : COLORS['base']['6']
          }
        }}
      />
      {label && <label className={props.className + ' text-primary font-semibold'}>{label}</label>}
    </div>
  );
}
