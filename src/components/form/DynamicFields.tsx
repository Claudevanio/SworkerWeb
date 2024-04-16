import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "../ui";
import { Avatar, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface DynamicInputFieldProps {
  individualLabel: string;
  label?: string;
  maxInputs: number;
  required?: boolean;
  error?: any;
  placeholder?: string;
  name: string;
  initialInputs?: number;
}

export const DynamicInputField: React.FC<DynamicInputFieldProps> = ({ individualLabel, name, label, maxInputs, required, placeholder, initialInputs = 1, error }) => {
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name, 
  });

  const initialRender = useRef(true);

  useEffect(() => {
      if (initialRender.current && fields.length < initialInputs) {
          for (let i = fields.length; i < initialInputs; i++) {
              append({ value: '' });
          }
      }
      initialRender.current = false;
  }, [append, fields.length, initialInputs]);

  const handleAddInput = () => {
      if (fields.length < maxInputs) {
          append({ value: '' });
      }
  };

  return (
    <>
      <div className="flex gap-8 items-center w-full flex-col">
          {label && (
              <div className="mb-4">
                  <label className="text-primary font-semibold">{label}</label>
              </div>
          )}
          <div className="w-full flex flex-wrap gap-8 items-center justify-start">
              {fields.map((field, index) => (
                  <div key={field.id} className="w-full md:w-[calc(33.333%-1.333rem)]">
                    <Controller
                      control={control}
                      name={`${name}[${index}].value`}
                      rules={{ required: index === 0 ? required : false }}
                      render={({ field, fieldState }) => (
                        <Input
                          label={`${individualLabel} ${index + 1}`}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required={index === 0 ? required : false}
                          error={error}
                          placeholder={placeholder || ''}
                        />
                      )}
                    />
                  </div>
              ))}
          </div>
          
          {fields.length < maxInputs && (
              <div className="flex w-full cursor-pointer">
                  <span onClick={handleAddInput} className="text-primary font-semibold flex items-center gap-4">
                      <AddIcon />
                      {`Adicionar outro ${individualLabel.toLowerCase()}`}
                  </span>
              </div>
          )}
      </div>
    </>
  );
};



interface FileUploadProps {
name: string;
label?: string;
maxInputs: number;
required?: boolean;
type: 'image' | 'file';
}

interface FileInputField {
  id: string;
  file: File | null;
  fileName: string;
}

interface FormValues {
files: FileInputField[];
}

interface FileInputField {
id: string;
file: File | null;
fileName: string;
}

interface FileUploadProps {
name: string;
label?: string;
maxInputs: number;
required?: boolean;
type: 'image' | 'file';
}

interface FormValues {
[key: string]: FileInputField[];
}

interface FileNameMapping {
[key: string]: string;
}

export const DynamicFileUploadField: React.FC<FileUploadProps> = ({
label,
maxInputs,
required,
type,
name,
}) => {
const { control, setValue } = useFormContext<FormValues>();
const { fields, append, remove } = useFieldArray({
  control,
  name,
});

const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

useEffect(() => { 
  const initialFileNames: FileNameMapping = {};
  fields.forEach((field) => {
    initialFileNames[field.id] = field.fileName || '';
  });
  setFileNames(initialFileNames);
}, [fields]);

const [fileNames, setFileNames] = useState<FileNameMapping>({});

const handleAddInput = () => {
  if (fields.length < maxInputs) {
    append({ id: `field-${fields.length}`, file: null, fileName: '' });
  }
};

const handleInputClick = (fieldId: string) => {
  fileInputRefs.current[fieldId]?.click();
};

const handleFileChange = (index: number, file: File | null) => {
  const newFileNames = { ...fileNames };
  const fieldId = fields[index].id;

  if (file) { 
      setValue(`${name}.${index}.file`, file);
      newFileNames[fieldId] = file.name;
      setValue(`${name}.${index}.fileName`, file.name);
  } else {
      setValue(`${name}.${index}.file`, null);
      newFileNames[fieldId] = '';
      setValue(`${name}.${index}.fileName`, '');
  }

  setFileNames(newFileNames);
};

return (
  <div className="flex flex-col gap-4 w-full">
      {label && <label className="text-primary font-semibold">{label}</label>}
      <div className="flex flex-wrap flex-col w-full md:flex-row items-center gap-8"> 
          {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 w-full xl:w-[calc(33.333%-1.333rem)]">
                  <div className="flex flex-nowrap rounded-lg h-10 mb-4">
                      <OutlinedInput
                          className="flex-grow"
                          type="text"
                          value={fileNames[field.id] || ''}
                          fullWidth
                          startAdornment={
                              <InputAdornment position="start" className="flex items-center">
                                  <AttachFileIcon />
                                  <span className="font-semibold text-black ml-2 pr-14 sm:border-r-2">
                                      Arquivo
                                  </span>
                                  {!fileNames[field.id] && <span className="hidden sm:block ml-2">Clique para enviar</span>}
                              </InputAdornment>
                          }
                          readOnly
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleInputClick(field.id)}
                      />
                      <input
                          ref={(el) => (fileInputRefs.current[field.id] = el)}
                          id={field.id}
                          name={`${name}[${index}].file`}
                          type="file"
                          hidden
                          accept={type === 'image' ? 'image/*' : '*/*'}
                          onChange={(e) => handleFileChange(index, e.target.files ? e.target.files[0] : null)}
                          required={required && index === 0}
                      />
                      {fields.length > 1 && (
                          <IconButton onClick={() => remove(index)} size="small">
                              <DeleteIcon />
                          </IconButton>
                      )}
                  </div>
              </div>
          ))}
      </div>
      {fields.length < maxInputs && (
          <div className="flex w-full cursor-pointer mt-4">
              <span onClick={handleAddInput} className="text-primary font-semibold flex items-center gap-4">
                  <AddIcon />
                  Adicionar outro arquivo
              </span>
          </div>
      )}
  </div>
);
};