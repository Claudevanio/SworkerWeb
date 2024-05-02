'use client'
import { Autocomplete as MuiAutoComplete, TextField } from '@mui/material';
import { Input } from './input';
import { ControllerRenderProps } from 'react-hook-form';
import { KeyboardArrowDown } from '@mui/icons-material';
import { COLORS } from '@/utils';

export function AutoComplete(
  {
    optionLabel = 'name',
    options,
    inputValue,
    inputOnChange,
    onSelect,
    label
  } : {
    options: any[], 
    style?: any, 
    optionLabel?: string;
    inputValue?: string;
    label?: string;
    onSelect: (value: any) => void;
    inputOnChange?: (value: string) => void;
  }
) {
  return ( <div
    className='flex flex-col gap-2 w-full'
  >
      {label && <label 
          className='text-primary font-semibold'
      >
          {label} 
      </label>}
      <MuiAutoComplete 
      clearIcon={null}
      noOptionsText={
        'Sem opções'
      } 
      clearOnEscape={false}
      clearOnBlur={false}
      popupIcon={<KeyboardArrowDown
        sx={{
          color: '#BDBDBD'
        }}
      />}
      options={options}
      getOptionLabel={(option : any) => option[optionLabel] || option.name}
      sx={{
        '& .MuiAutocomplete-inputRoot': {
          '& .MuiAutocomplete-input': { 
            fontWeight: 300,
            maxHeight: '.55rem',
            color:  COLORS['base']['7']
          },
        },  
        width: '100%',
      }}
      inputValue={inputValue}
      onInputChange={(_, value) => {
        if (inputOnChange) {
          inputOnChange(value);
        }
      }}
      onChange={(_, value) => {
        onSelect(value);
      }}
      renderInput={(params) => <TextField {...params} 
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: "#00000070",
              borderRadius: ".5rem", 
            }, 
            'input': { 
                fontWeight: 300,
            },
            p:0
        },
        input: {
          height: '2.5rem',
          minHeight: '1.25rem',
          padding: '1rem',
          width: '100%',
          fontWeight: 300,
          color: "#404E67",
          overflow: "hidden",
          textOverflow: "ellipsis",
          "&:disabled": {
            color: "#020617 !important",
            "-webkit-text-fill-color": "#020617 !important",
          },
        },
        "*:focus": {
          backgroundColor: "transparent !important",
        },
        "&:focus": {
          backgroundColor: "transparent !important",
        },
        "*": {
          borderRadius: ".5rem",
          color: "#020617 !important",
          "-webkit-text-fill-color": "#020617 !important",
        },
        width: '100%',
    }} />}
      />
  </div>
  );
}