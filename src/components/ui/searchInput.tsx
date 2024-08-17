'use client';
import { SearchOutlined } from '@mui/icons-material';
import { debounce, TextField } from '@mui/material';
import React from 'react';

export function SearchInput({ value, onChange, reset }: { value: string; onChange: (value: string) => void; reset?: boolean }) {
  const [localValue, setLocalValue] = React.useState(value);

  const debouncedOnChange = React.useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const debounced = (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(value);
      }, 800);
    };

    debounced.clear = () => {
      clearTimeout(timeout);
    };

    return debounced;
  }, [onChange]);

  React.useEffect(() => {
    setLocalValue('');
  }, [reset]);

  return (
    <TextField
      placeholder="Pesquisar..."
      variant="outlined"
      InputProps={{
        startAdornment: <SearchOutlined className="text-[#BDBDBD]" />,
        sx: {
          gap: 1,
          border: '1px solid #F1F1F1',
          borderRadius: '8px',
          width: '100%',
          height: '48px'
        }
      }}
      sx={{
        width: '100%',
        height: '48px'
      }}
      value={localValue}
      onChange={e => {
        setLocalValue(e.target.value);
        debouncedOnChange(e.target.value);
      }}
    />
  );
}
