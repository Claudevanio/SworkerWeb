'use client'
import { Autocomplete as MuiAutoComplete, TextField } from '@mui/material';
import { Input } from './input';
import { ControllerRenderProps } from 'react-hook-form';
import { KeyboardArrowDown } from '@mui/icons-material';

export function AutoComplete(
  {
    optionLabel = 'title',
    options,
    field
  } : {
    options: any[], 
    style: any,
    field: Omit<ControllerRenderProps, "ref">;
    optionLabel?: string;
  }
) {
  return (
    <MuiAutoComplete
    {...field}
    clearIcon={null}
    noOptionsText={
      'Sem opções'
    } 
    popupIcon={<KeyboardArrowDown
      sx={{
        color: '#BDBDBD'
      }}
    />}
    options={options}
    getOptionLabel={(option : any) => option[optionLabel] || option.title}
    sx={{
      '& .MuiAutocomplete-inputRoot': {
        '& .MuiAutocomplete-input': {
          padding: '1rem',
          fontWeight: 300,
          color: '#00B5B8'
        },
      },  
    }}
    onChange={(_, value) => {
      field.onChange(value)
    }}
    renderInput={(params) => <TextField {...params} 
    variant="standard"
    sx={{
      '& .MuiOutlinedInput-root': {
          '& fieldset': {
              borderColor: '#BDBDBD',
              borderRadius: '.5rem', 
          }, 
          'input': { 
              fontWeight: 300,
              color: '#00B5B8'
          },
          p:0
      },
  }} />}
    />
  );
}