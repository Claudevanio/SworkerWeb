'use client';
import { Button, Dropdown, Form, Input } from '@/components';
import { useDialog } from '@/hooks/use-dialog';
import { ocurrenceCharacterizationService } from '@/services/Ocurrences/ocurrenceCharacterizationsService';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Button as ButtonMUI } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const schema = Yup.object({
  category: Yup.string(),
  occurrenceType: Yup.number()
});

type FormFields = Yup.InferType<typeof schema>;

export default function ModalAddAndUpdate({
  handleClose,
  types,
  characterizationSelected,
  isAdd,
  refetch
}: {
  handleClose: () => void;
  types: IOcurrenceType[];
  characterizationSelected: IOcurrenceCharacterization;
  isAdd: boolean;
  refetch: () => void;
}) {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      occurrenceType: characterizationSelected.type?.id,
      category: characterizationSelected.description
    }
  });

  const { confirmDialog } = useDialog();

  async function onSubmit(data: FormFields) {
    characterizationSelected.type.id = data.occurrenceType;
    characterizationSelected.description = data.category;

    if (isAdd) {
      try {
        await ocurrenceCharacterizationService.insertCharacterization(characterizationSelected);
      } catch (e) {
        confirmDialog({
          title: 'Houve um erro ao adicionar uma categoria',
          message: e.message
        });
      }
    } else {
      try {
        await ocurrenceCharacterizationService.updateCharacterization(characterizationSelected);
      } catch (e) {
        confirmDialog({
          title: 'Houve um erro ao editar a categoria',
          message: e.message
        });
      }
    }

    refetch();
    handleClose();
  }

  return (
    <Form onSubmit={data => onSubmit(data)} className="flex flex-col gap-4 pb-4" {...methods}>
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
      <Input name="category" label="Categoria" placeholder="Categoria" disabled={false} />
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
