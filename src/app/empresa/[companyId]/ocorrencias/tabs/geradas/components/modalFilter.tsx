'use client';
import { Button, Dropdown, Form, Input } from '@/components';
import { IFilterOcurrences } from '@/types/models/Ocurrences/IFilterOcurrences';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { masks } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Button as ButtonMUI } from '@mui/material';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const schemaFilter = Yup.object({
  ocurrenceNumber: Yup.string(),
  professional: Yup.string(),
  registerDateStart: Yup.string(),
  registerDateEnd: Yup.string(),
  availableDateStart: Yup.string(),
  availableDateEnd: Yup.string(),
  occurrenceCaracterization: Yup.number(),
  occurrenceType: Yup.number(),
  origin: Yup.string(),
  recognitionStatus: Yup.string()
});

type FormFieldsFilter = Yup.InferType<typeof schemaFilter>;

export default function ModalFilter({
  filterOcurrences,
  setFilterOcurrences,
  handleClose,
  characterizations,
  types
}: {
  filterOcurrences: IFilterOcurrences;
  setFilterOcurrences: Dispatch<SetStateAction<IFilterOcurrences>>;
  handleClose: () => void;
  characterizations: IOcurrenceCharacterization[];
  types: IOcurrenceType[];
}) {
  const methodsFilter = useForm<FormFieldsFilter>({
    resolver: yupResolver(schemaFilter),
    defaultValues: {
      occurrenceCaracterization: filterOcurrences.characterization,
      origin: filterOcurrences.origin,
      recognitionStatus: filterOcurrences.status,
      occurrenceType: filterOcurrences.type,
      professional: filterOcurrences.professional,
      registerDateStart: filterOcurrences.registerDateStart,
      registerDateEnd: filterOcurrences.registerDateEnd,
      availableDateStart: filterOcurrences.availableDateStart,
      availableDateEnd: filterOcurrences.availableDateEnd,
      ocurrenceNumber: filterOcurrences.numberOcurrence
    }
  });

  const dateFormatter = (data: string) => {
    var partes = data.split('/');
    var data_formatada = partes[2] + '-' + partes[1] + '-' + partes[0];
    return data_formatada;
  };

  async function onSubmitFilter(data: FormFieldsFilter) {
    setFilterOcurrences({
      ...filterOcurrences,
      numberOcurrence: data.ocurrenceNumber,
      professional: data.professional,
      characterization: data.occurrenceCaracterization,
      type: data.occurrenceType,
      registerDateStart: data.registerDateStart ? dayjs(dateFormatter(data.registerDateStart)).toISOString() : '',
      registerDateEnd: data.registerDateEnd ? dayjs(dateFormatter(data.registerDateEnd)).toISOString() : '',
      availableDateStart: data.availableDateStart ? dayjs(dateFormatter(data.availableDateStart)).toISOString() : '',
      availableDateEnd: data.availableDateEnd ? dayjs(dateFormatter(data.availableDateEnd)).toISOString() : ''
    });

    handleClose();
  }

  return (
    <Form onSubmit={data => onSubmitFilter(data as FormFieldsFilter)} className="flex flex-col gap-4 pb-4" {...methodsFilter}>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="ocurrenceNumber" label="Número da ocorrência" placeholder="Número da ocorrência" disabled={false} />
        <Input name="professional" label="Profissional" placeholder="Profissional" disabled={false} />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Dropdown
          name="occurrenceCaracterization"
          label="Caracterização"
          options={characterizations.map(item => {
            return {
              label: item.description,
              value: item.id
            };
          })}
        />
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
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Dropdown
          name="origin"
          label="Origem"
          options={[
            { label: '1', value: 1 },
            { label: '2', value: 2 }
          ]}
        />
        <Dropdown
          name="recognitionStatus"
          label="Status de avaliação"
          options={[
            { label: 'Pendente', value: 'false' },
            { label: 'Concluido', value: 'true' }
          ]}
        />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="registerDateStart" label="Data de cadastro (Início)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
        <Input name="registerDateEnd" label="Data de cadastro (Fim)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="availableDateStart" label="Data de avaliação (Início)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
        <Input name="availableDateEnd" label="Data de avaliação (Fim)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
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
