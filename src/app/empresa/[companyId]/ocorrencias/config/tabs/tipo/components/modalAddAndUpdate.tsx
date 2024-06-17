'use client';
import { Button, Form, Input } from '@/components';
import { useDialog } from '@/hooks/use-dialog';
import { ocurrenceTypeService } from '@/services/Ocurrences/ocurrenceTypeService';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Button as ButtonMUI } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const schema = Yup.object({
  description: Yup.string(),
  typeOcurrence: Yup.string()
});

type FormFields = Yup.InferType<typeof schema>;

export default function ModalAddAndUpdate({
  handleClose,
  typeSelected,
  isAdd,
  refetch
}: {
  handleClose: () => void;
  typeSelected: IOcurrenceType;
  isAdd: boolean;
  refetch: () => void;
}) {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      typeOcurrence: typeSelected.typeName,
      description: typeSelected.description
    }
  });

  const { confirmDialog } = useDialog();

  async function onSubmit(data: FormFields) {
    typeSelected.typeName = data.typeOcurrence;
    typeSelected.description = data.description;

    if (isAdd) {
      try {
        await ocurrenceTypeService.insertType(typeSelected);
      } catch (e) {
        confirmDialog({
          title: 'Houve um erro ao adicionar uma classificação',
          message: e.message
        });
      }
    } else {
      try {
        await ocurrenceTypeService.updateType(typeSelected);
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
    <Form onSubmit={data => onSubmit(data)} className="flex flex-col gap-4 pb-4" {...methods}>
      <Input name="typeOcurrence" label="Tipo de ocorrência" placeholder="Tipo de ocorrência" disabled={false} />
      <Input name="description" label="Descrição" placeholder="Descrição" disabled={false} />
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
