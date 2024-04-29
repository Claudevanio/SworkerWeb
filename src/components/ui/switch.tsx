import { COLORS } from '@/utils';
import { CheckboxProps, styled, Switch, SwitchProps } from '@mui/material';
import { Controller } from 'react-hook-form';

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: COLORS['primary']['600'],
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: COLORS['primary']['600'],
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export function CustomSwitch({ label, ...props }: CheckboxProps & { label: string, control?: any, row?: boolean}) {
  return (
    <div className="flex flex-col gap-2 items-start"
      style={
        props.row
          ? { flexDirection: 'row-reverse', alignItems: 'center', width: 'fit-content' }
          : { }
      }
    >
      <label
        className={props.className + ' text-primary font-semibold'}
      >{label}</label>
      <Controller
        name={props.name}
        control={props?.control}
        render={({ field }) => (
          <IOSSwitch
            {...field}
            checked={field.value}
            disabled={props.disabled}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
    </div>
  )
}