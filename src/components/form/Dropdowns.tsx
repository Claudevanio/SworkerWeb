'use client'
import { FormControl, MenuItem, Select, TextField, SelectChangeEvent } from "@mui/material";
import { Field, FieldProps } from "./Fields";
import Image from 'next/image';
import React from 'react';

interface Option {
  label: string;
  value: string | number;
  icon?: string;
}

interface DropdownProps extends Omit<FieldProps, "render"> {
  options: Option[];
  error?: any;
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  name,
  label,
  options,
  required,
  className = "rounded-lg h-10 mt-2",
  disabled, 
}) => {
  return ( 
    <Field
      name={name}
      label={label}
      required={required}
      render={{
        controlled: ({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
            <Select
              {...field}
              displayEmpty
              disabled={disabled}  
              inputProps={{
                id: "dropdown-select",
                variant: "standard",
              }}
              className={className}
              MenuProps={{
                sx: {
                  "& .MuiList-root": {
                    maxHeight: "200px",
                  },
                },
              }}
              sx={{
                fieldset: {
                  borderColor: "#00000070",
                  borderRadius: ".5rem",
                  backgroundColor: disabled && "#E2E8F066",
                },
                input: {
                  padding: "0.5rem",
                  fontWeight: 300,
                  color: "#404E67",
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
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    {option.icon && (
                      <Image
                        src={option.icon}
                        alt={`${option.label}`}
                        width={20}
                        height={15}
                      />
                    )}
                    <span
                      className="ml-2"
                      style={{ color: disabled ? "#020617" : "#404E67" }}
                    >
                      {option.label}
                    </span>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
      }}
    />
  );
};
 