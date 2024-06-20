'use client';
import { Button, Dropdown, Form, Input } from '@/components';
import { useDialog } from '@/hooks/use-dialog';
import { ocurrrenceClassificationService } from '@/services/Ocurrences';
import { IOcurrenceClassification } from '@/types/models/Ocurrences/IOcurrenceClassification';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Button as ButtonMUI } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const schema = Yup.object({
  description: Yup.string(),
  occurrenceType: Yup.number(),
  severity: Yup.number()
});

type FormFields = Yup.InferType<typeof schema>;

export default function ModalAddAndUpdate({
  handleClose,
  types,
  classificationSelected,
  isAdd,
  refetch
}: {
  handleClose: () => void;
  types: IOcurrenceType[];
  classificationSelected: IOcurrenceClassification;
  isAdd: boolean;
  refetch: () => void;
}) {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      occurrenceType: classificationSelected.type?.id,
      description: classificationSelected.description,
      severity: classificationSelected.severity
    }
  });

  const { confirmDialog } = useDialog();

  async function onSubmit(data: FormFields) {
    classificationSelected.type = { id: data.occurrenceType };
    classificationSelected.severity = data.severity;
    classificationSelected.description = data.description;

    if (isAdd) {
      try {
        await ocurrrenceClassificationService.insertClassification(classificationSelected);
      } catch (e) {
        confirmDialog({
          title: 'Houve um erro ao adicionar uma classificação',
          message: e.message
        });
      }
    } else {
      try {
        await ocurrrenceClassificationService.updateClassification(classificationSelected);
      } catch (e) {
        confirmDialog({
          title: 'Houve um erro ao editar a classificação',
          message: e.message
        });
      }
    }

    refetch();
    handleClose();
  }

  return (
    <Form onSubmit={(data: FormFields) => onSubmit(data)} className="flex flex-col gap-4 pb-4" {...methods}>
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
          Salvar
        </Button>
      </Stack>
    </Form>
  );
}
