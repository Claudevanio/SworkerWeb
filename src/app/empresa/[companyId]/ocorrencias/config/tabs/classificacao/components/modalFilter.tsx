'use client';
import { Button, Dropdown, Form, Input } from '@/components';
import { IFilterClassification } from '@/types/models/Ocurrences/IFilterClassification';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { IOcurrenceClassification } from '@/types/models/Ocurrences/IOcurrenceClassification';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Button as ButtonMUI } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const schemaFilter = Yup.object({
  description: Yup.string(),
  occurrenceType: Yup.number(),
  severity: Yup.number()
});

type FormFieldsFilter = Yup.InferType<typeof schemaFilter>;

export default function ModalFilter({
  filter,
  setFilter,
  handleClose,
  types
}: {
  filter: IFilterClassification;
  setFilter: Dispatch<SetStateAction<IFilterClassification>>;
  handleClose: () => void;
  types: IOcurrenceType[];
}) {
  const methodsFilter = useForm<FormFieldsFilter>({
    resolver: yupResolver(schemaFilter),
    defaultValues: {
      occurrenceType: filter.typeId,
      description: filter.description,
      severity: filter.severityId
    }
  });

  async function onSubmitFilter(data: FormFieldsFilter) {
    setFilter({
      ...filter,
      description: data.description,
      typeId: data.occurrenceType,
      severityId: data.severity
    });

    handleClose();
  }

  return (
    <Form onSubmit={data => onSubmitFilter(data as FormFieldsFilter)} className="flex flex-col gap-4 pb-4" {...methodsFilter}>
      <Dropdown
        name="occurrenceType"
        label="Tipo de ocorrência"
        options={types.map(item => {
          return {
            label: item.description,
            value: item.id
          };
        })}
      />
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="description" label="Descrição" placeholder="Descrição" disabled={false} />
        <Dropdown
          name="severity"
          label="Severidade"
          options={[
            { label: 'Informativo', value: 1 },
            { label: 'Mobilização', value: 2 },
            { label: 'Atenção', value: 3 },
            { label: 'Alerta', value: 4 },
            { label: 'Crítico', value: 5 }
          ]}
        />
      </div>
      <Stack flexDirection="row" justifyContent="space-between">
        <ButtonMUI onClick={() => handleClose()} variant="text" sx={{ color: 'black' }}>
          Cancelar
        </ButtonMUI>
        <Button sx={{ width: '30%' }} type="submit">
          Filtrar
        </Button>
      </Stack>
    </Form>
  );
}
