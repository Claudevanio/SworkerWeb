'use client';
import { SearchOutlined } from '@mui/icons-material';
import { debounce, TextField } from '@mui/material';
import React from 'react';

export function SearchInput({
  value,
  onChange,
  reset
}:{
  value: string,
  onChange: (value: string) => void,
  reset?: boolean
}){

  const [localValue, setLocalValue] = React.useState(value)
 
  function debounce(func: (...args: any[]) => void, wait: number = 800): (...args: any[]) => void & { clear: () => void } {
    let timeout: ReturnType<typeof setTimeout>;
  
    function debounced(...args: any[]) {
      const later = () => {
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
  
    debounced.clear = () => {
      clearTimeout(timeout);
    };
  
    return debounced as any;
  }
  
  React.useEffect(() => {
    setLocalValue('')
  }, [reset])


  return <TextField
    placeholder='Pesquisar...'
    variant="outlined"
    InputProps={{
      startAdornment: (
        <SearchOutlined 
          className='text-[#BDBDBD]'
        />
      ),
      sx:{
        gap:1,
        border: '1px solid #F1F1F1',
        borderRadius: '8px',
        width: '100%',
        height: '48px',
      }
    }} 
    sx={{
      width: '100%',
      height: '48px',
    }}
    value={localValue}
    onChange={
      (e) => {
        setLocalValue(e.target.value) 
        const debouncedOnChange = debounce(onChange);
        debouncedOnChange(e.target.value);
      }
    }
  />
}