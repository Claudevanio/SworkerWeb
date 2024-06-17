import { Button, Dropdown, Form, Input } from '@/components';
import { useDialog } from '@/hooks/use-dialog';
import { ocurrenceService } from '@/services/Ocurrences';
import { IOcurrence } from '@/types/models/Ocurrences/IOcurrence';
import { IOcurrenceClassification } from '@/types/models/Ocurrences/IOcurrenceClassification';
import { IOcurrenceRecognize } from '@/types/models/Ocurrences/IOcurrenceRecognize';
import { masks } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button as ButtonMUI, Stack, Switch, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const schemaRecognize = Yup.object({
  classification: Yup.number(),
  observation: Yup.string(),
  occurrenceType: Yup.number(),
  occurrenceCategorization: Yup.number(),
  occurrenceDate: Yup.string(),
  locale: Yup.string(),
  description: Yup.string()
});

export default function ModalRecognize({
  currentOcurrence,
  setCurrentOcurrence,
  classifications,
  handleClose,
  refetch
}: {
  currentOcurrence: IOcurrence;
  setCurrentOcurrence: Dispatch<SetStateAction<IOcurrence>>;
  classifications: IOcurrenceClassification[];
  handleClose: () => void;
  refetch: () => void;
}) {
  type FormFields = Yup.InferType<typeof schemaRecognize>;

  const methodsRecognize = useForm<FormFields>({
    resolver: yupResolver(schemaRecognize),
    defaultValues: {
      occurrenceType: currentOcurrence.occurrenceTypeId,
      occurrenceCategorization: currentOcurrence.characterization?.id,
      observation: currentOcurrence.observation,
      occurrenceDate: dayjs(currentOcurrence.registerDate).format('DD/MM/YYYY'),
      locale: currentOcurrence.local,
      description: currentOcurrence.description
    }
  });

  const { confirmDialog } = useDialog();

  async function onSubmit(data: FormFields) {
    const newOcurrenceRecognize = {
      absenceDays: 0,
      characterizationId: data.occurrenceCategorization,
      classificationId: data.classification,
      closed: false,
      daysWorkedAfterDayOff: 0,
      description: currentOcurrence.description,
      local: currentOcurrence.local,
      observation: data.observation,
      occurrenceId: currentOcurrence.id,
      professionalId: currentOcurrence.professional.id,
      recognized: currentOcurrence.acknowledged,
      registerDate: currentOcurrence.registerDate,
      supervisorId: 1
    } as IOcurrenceRecognize;
    try {
      await ocurrenceService.recognizeOcurrenceAsync(newOcurrenceRecognize);
    } catch (e) {
      confirmDialog({
        title: 'Houve um erro ao reconhecer a ocorrência',
        message: e.message
      });
    }

    refetch();
    handleClose();
  }

  return (
    <Form onSubmit={data => onSubmit(data as FormFields)} className="flex flex-col gap-4 pb-4" {...methodsRecognize}>
      <Stack flexDirection="row" alignItems="center">
        <Switch
          checked={currentOcurrence.acknowledged}
          onChange={e =>
            setCurrentOcurrence({
              ...currentOcurrence,
              acknowledged: e.target.checked
            })
          }
        />
        <Typography>Ocorrência aceita</Typography>
      </Stack>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Dropdown
          name="classification"
          label="Classificação da ocorrência"
          required
          error={methodsRecognize.formState.errors.classification}
          disabled={false}
          options={classifications.map(item => {
            return {
              label: item?.description,
              value: item?.id
            };
          })}
        />
        <Dropdown
          name="occurrenceType"
          label="Tipo de ocorrência"
          required
          disabled={true}
          options={[
            {
              label: currentOcurrence.occurrenceType?.typeName,
              value: currentOcurrence.occurrenceTypeId
            }
          ]}
        />
      </div>

      <Input name="observation" label="Observação" required placeholder="Texto descritivo" disabled={false} minRows={5} multiline={true} />
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Dropdown
          name="occurrenceCategorization"
          label="Categorização da ocorrência"
          required
          disabled={true}
          options={[
            {
              label: currentOcurrence.characterization?.description,
              value: currentOcurrence.characterization?.id
            }
          ]}
        />
        <Input name="occurrenceDate" label="Data da ocorrência" required placeholder="DD/MM/AAAA" disabled={true} mask={masks.DATE} />
      </div>
      <Stack width="50%">
        <Input name="locale" label="Local" required placeholder="Local" disabled={true} />
      </Stack>
      <Input name="description" label="Descrição" required placeholder="Texto descritivo" disabled={true} minRows={5} multiline={true} />
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <ButtonMUI onClick={() => handleClose()} variant="text" sx={{ color: 'black' }}>
          Cancelar
        </ButtonMUI>
        <Button type="submit">Salvar</Button>
      </Stack>
    </Form>
  );
}
