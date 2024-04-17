'use client'
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FilledInputProps, IconButton, InputProps, OutlinedInputProps, TextField } from '@mui/material';  
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
 
import { InputHTMLAttributes } from 'react';

import { ValidationRule } from 'react-hook-form';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    });

export interface IValidation<V, M = string> {
    value: V,
    message: M
}

export interface IRules {
    required: IValidation<boolean, string>;
    min?: IValidation<number, string>;
    max?: IValidation<number, string>;
    minLength?: IValidation<number, string>;
    maxLength?: IValidation<number, string>;
    pattern?: ValidationRule<RegExp>;
    validate?: ValidationRule<any>;
}

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name?: string;
    id?: string;
    type?: string;
    disabled?: boolean;
    isCpf?: boolean;
    setIsCpf?: (value: boolean) => void;
    mask?: (value: string) => string;
    rules?: IRules;
    errorText?: string | null; 
    defaultValue?: string;
    disabledClean?: boolean
    required?: boolean;
    value?: string;
    onClean?: () => void;
    pseudoDisabled?: boolean;
    error?: any;
    ref?: any;
    invisible?: boolean;
    inputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps>;
    multiline?: boolean;
    minRows?: number;
    placeholder?: string;
}

export const Input: React.FC<IInput> = ({
    label,
    name,
    id,
    mask,
    setIsCpf,
    rules,
    errorText, 
    defaultValue,
    isCpf,
    disabledClean,
    onClean,
    ref,
    pseudoDisabled,
    required,
    error,
    inputProps,
    invisible,
    ...rest
}) => {
    const { control, setValue, watch } = useFormContext();
    const [isFocused, setIsFocused] = useState(false);

    const [localIsPassword, setLocalIsPassword] = useState(rest?.type === 'password');

    const isValue = watch(name);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!inputRef.current || !ref) return;

        ref && ref(inputRef.current);
    }, [inputRef]);

    if(!name){
        return (
            <div className={`relative ${!invisible ? 'flex' : 'hidden'} w-full flex-col gap-2 ${errorText ? 'error' : ''} !${inter.className}`}>
                    {label && <label
                        htmlFor={id}
                        className='text-primary font-semibold'
                    >
                        {label}
                        {required && <span
                            className='text-[#EC0000]'
                        >
                                *
                            </span>}
                    </label>}
                    <TextField
                        value={defaultValue}
                        ref={inputRef}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        error={!!error}
                        // onChange={(e) => {
                        //     if (pseudoDisabled) return;
                        //     if (mask) {
                        //         // field.onChange(mask(e.target.value));
                        //         return;
                        //     } 
                        //     field.onChange(e.target.value);
                            
                        // }}
                        {...rest as any}
                        disabled={rest.disabled} 
                        variant='outlined' 
                        type={rest.type === 'password' ? (localIsPassword ? 'password' : 'text') : rest.type} 
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#00000070',
                                    borderRadius: '.5rem',
                                }, 
                                '& input': {
                                    padding: '0.5rem', 
                                    fontWeight: 300,
                                    color: '#404E67',
                                    '&:disabled': {
                                        color: '#020617 !important',
                                        '-webkit-text-fill-color': 'unset',

                                    }
                                },
                                '& textarea': {
                                    padding: '0.5rem', 
                                    fontWeight: 300,
                                    color: '404E67',
                                },
                                p:0,
                                '.Mui-disabled': {
                                    backgroundColor: '#E2E8F0',
                                    borderRadius: '.5rem',
                                }
                            },
                        }}
                        InputProps={{
                            endAdornment: rest.type === 'password' && (
                                <IconButton
                                    onClick={
                                        () => {
                                            setLocalIsPassword(!localIsPassword);
                                        }
                                    } 
                                    size='small'
                                    tabIndex={-1}
                                >
                                    {localIsPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                                </IconButton>
                            ),
                            ...inputProps,
                        }}
                    /> 
                    {error && error?.message !=='' && (
                        <p className="text-xs text-red-500 absolute bottom-[-1.2rem] left-0">{error.message}</p>
                    )}
                </div>
        )
    }

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={mask ? mask(defaultValue || "") : defaultValue}
            rules={rules}
            render={({ field }) => (
                <div className={`relative ${!invisible ? 'flex' : 'hidden'} w-full flex-col gap-2 ${errorText ? 'error' : ''} !${inter.className}`}>
                    {label && <label
                        htmlFor={id}
                        className='text-primary font-semibold'
                    >
                        {label}
                        {required && <span
                            className='text-[#EC0000]'
                        >
                                *
                            </span>}
                    </label>}
                    <TextField
                        {...field} 
                        ref={inputRef}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        error={!!error}
                        onChange={(e) => {
                            if (pseudoDisabled) return;
                            if (mask) {
                                field.onChange(mask(e.target.value));
                                return;
                            } 
                            field.onChange(e.target.value);
                            
                        }}
                        {...rest as any}
                        disabled={rest.disabled} 
                        variant='outlined' 
                        type={rest.type === 'password' ? (localIsPassword ? 'password' : 'text') : rest.type} 
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#00000070',
                                    borderRadius: '.5rem',
                                }, 
                                '& input': {
                                    padding: '0.5rem', 
                                    fontWeight: 300,
                                    color: '#404E67',
                                    '&:disabled': {
                                        color: '#020617 !important',
                                        '-webkit-text-fill-color': 'unset',

                                    }
                                },
                                '& textarea': {
                                    padding: '0.5rem', 
                                    fontWeight: 300,
                                    color: '404E67',
                                },
                                p:0,
                                '.Mui-disabled': {
                                    backgroundColor: '#E2E8F0',
                                    borderRadius: '.5rem',
                                }
                            },
                        }}
                        InputProps={{
                            endAdornment: rest.type === 'password' && (
                                <IconButton
                                    onClick={
                                        () => {
                                            setLocalIsPassword(!localIsPassword);
                                        }
                                    } 
                                    size='small'
                                    tabIndex={-1}
                                >
                                    {localIsPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                                </IconButton>
                            ),
                            ...inputProps,
                        }}
                    /> 
                    {error && error?.message !=='' && (
                        <p className="text-xs text-red-500 absolute bottom-[-1.2rem] left-0">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
};
