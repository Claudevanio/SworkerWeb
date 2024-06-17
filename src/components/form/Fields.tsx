import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormRegisterReturn,
  UseFormStateReturn,
  useFormContext
} from 'react-hook-form';

import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ChangeEvent, useEffect, useState } from 'react';
import { Avatar, IconButton } from '@mui/material';

export interface FieldProps {
  name: string;
  label: string;
  render: {
    controlled?: (props: {
      field: Omit<ControllerRenderProps, 'ref'>;
      fieldState: ControllerFieldState;
      formState: UseFormStateReturn<FieldValues>;
    }) => React.ReactElement;
    uncontrolled?: (props: { field: UseFormRegisterReturn }) => React.ReactElement;
  };
  required?: boolean;
}

export function Field({ label, render, ...rest }: FieldProps) {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <div className={`relative  w-full flex-col gap-2 `}>
      {label && (
        <label className="text-primary font-semibold">
          {label}
          {rest.required && <span className="text-[#EC0000]">*</span>}
        </label>
      )}

      {render.uncontrolled ? (
        render.uncontrolled({ field: { ...register(rest.name) } })
      ) : (
        <Controller
          render={({ field: { ref, ...field }, ...props }) => (render.controlled ? render.controlled({ field, ...props }) : <></>)}
          control={control}
          {...rest}
        />
      )}

      <span className="text-xs text-red-500">{errors[rest.name]?.message?.toString()}</span>
    </div>
  );
}

interface PhotoUploadFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

export const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({ name, label, required, placeholder, defaultValue }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { control, setValue, getValues } = useFormContext();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setValue(name, file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setValue(name, null);
  };

  return (
    <div className="flex flex-col items-center">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className="relative p-0 flex justify-center items-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isHovering ? (
          <>
            <Avatar
              src={(!previewUrl && !selectedFile && defaultValue) || previewUrl || placeholder || undefined}
              alt="Foto"
              sx={{
                width: 128,
                height: 128,
                img: {
                  objectFit: 'fill'
                }
              }}
              variant="circular"
              className="bg-gray-200 brightness-50 transition-all duration-300 m-0"
            />
            <div>
              <label htmlFor={name} className="absolute inset-0 flex justify-center items-center cursor-pointer gap-2">
                <input id={name} name={name} type="file" accept="image/*" onChange={handleImageChange} hidden required={required} />
                <IconButton size="small" className="text-white" component="span">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" className="text-red-300" component="span" onClick={handleRemoveImage}>
                  <DeleteOutlineIcon />
                </IconButton>
              </label>
            </div>
          </>
        ) : (
          <Avatar
            src={(!previewUrl && !selectedFile && defaultValue) || previewUrl || placeholder || undefined}
            alt="Foto"
            sx={{
              width: 128,
              height: 128,
              img: {
                objectFit: 'fill'
              }
            }}
            variant="circular"
            className="bg-gray-200 transition-all duration-300"
          />
        )}
        <input id={name} name={name} type="file" accept="image/*" onChange={handleImageChange} hidden required={required} />
      </div>
    </div>
  );
};
