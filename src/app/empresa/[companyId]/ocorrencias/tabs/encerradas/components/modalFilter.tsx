'use client';
import { Button, Dropdown, Form, Input } from '@/components';
import { IFilterOcurrences } from '@/types/models/Ocurrences/IFilterOcurrences';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { IOcurrenceClassification } from '@/types/models/Ocurrences/IOcurrenceClassification';
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
  supervisor: Yup.string(),
  registerDateStart: Yup.string(),
  registerDateEnd: Yup.string(),
  recognitionDateStart: Yup.string(),
  recognitionDateEnd: Yup.string(),
  endingDateStart: Yup.string(),
  endingDateEnd: Yup.string(),
  occurrenceCaracterization: Yup.number(),
  occurrenceType: Yup.number(),
  classification: Yup.number(),
  origin: Yup.string()
});

type FormFieldsFilter = Yup.InferType<typeof schemaFilter>;

export default function ModalFilter({
  filterOcurrences,
  setFilterOcurrences,
  handleClose,
  characterizations,
  types,
  classifications
}: {
  filterOcurrences: IFilterOcurrences;
  setFilterOcurrences: Dispatch<SetStateAction<IFilterOcurrences>>;
  handleClose: () => void;
  characterizations: IOcurrenceCharacterization[];
  types: IOcurrenceType[];
  classifications: IOcurrenceClassification[];
}) {
  const methodsFilter = useForm<FormFieldsFilter>({
    resolver: yupResolver(schemaFilter),
    defaultValues: {
      ocurrenceNumber: filterOcurrences.numberOcurrence,
      professional: filterOcurrences.professional,
      supervisor: filterOcurrences.supervisor,
      registerDateStart: filterOcurrences.registerDateStart,
      registerDateEnd: filterOcurrences.registerDateEnd,
      recognitionDateStart: filterOcurrences.recognitionDateStart,
      recognitionDateEnd: filterOcurrences.recognitionDateEnd,
      endingDateStart: filterOcurrences.endingDateStart,
      endingDateEnd: filterOcurrences.endingDateEnd,
      occurrenceCaracterization: filterOcurrences.characterization,
      occurrenceType: filterOcurrences.type,
      classification: filterOcurrences.classification,
      origin: filterOcurrences.origin
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
      origin: data.origin,
      numberOcurrence: data.ocurrenceNumber,
      professional: data.professional,
      characterization: data.occurrenceCaracterization,
      type: data.occurrenceType,
      registerDateStart: data.registerDateStart ? dayjs(dateFormatter(data.registerDateStart)).toISOString() : '',
      registerDateEnd: data.registerDateEnd ? dayjs(dateFormatter(data.registerDateEnd)).toISOString() : '',
      recognitionDateStart: data.recognitionDateStart ? dayjs(dateFormatter(data.recognitionDateStart)).toISOString() : '',
      recognitionDateEnd: data.recognitionDateEnd ? dayjs(dateFormatter(data.recognitionDateEnd)).toISOString() : '',
      endingDateStart: data.endingDateStart ? dayjs(dateFormatter(data.endingDateStart)).toISOString() : '',
      endingDateEnd: data.endingDateEnd ? dayjs(dateFormatter(data.endingDateEnd)).toISOString() : ''
    });

    handleClose();
  }

  return (
    <Form onSubmit={data => onSubmitFilter(data as FormFieldsFilter)} className="flex flex-col gap-4 pb-4" {...methodsFilter}>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="professional" label="Profissional" placeholder="Profissional" disabled={false} />
        <Input name="supervisor" label="Supervisor" placeholder="Supervisor" disabled={false} />
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
          name="classification"
          label="Classificação"
          options={classifications.map(item => {
            return {
              label: item.description,
              value: item.id
            };
          })}
        />
        <Dropdown
          name="origin"
          label="Origem"
          options={[
            { label: '1', value: 1 },
            { label: '2', value: 2 }
          ]}
        />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="registerDateStart" label="Data de criação (Início)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
        <Input name="registerDateEnd" label="Data de criação (Fim)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="recognitionDateStart" label="Data de reconhecimento (Início)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
        <Input name="recognitionDateEnd" label="Data de reconhecimento (Fim)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="endingDateStart" label="Data de fechamento (Início)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
        <Input name="recognitionDateEnd" label="Data de fechamento (Fim)" placeholder="DD/MM/AAAA" disabled={false} mask={masks.DATE} />
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
