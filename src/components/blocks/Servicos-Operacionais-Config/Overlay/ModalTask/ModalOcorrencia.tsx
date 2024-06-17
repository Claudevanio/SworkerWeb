import { Modal } from '@/components/ui/modal';
import { ISector } from '@/types';
import * as Yup from 'yup';
import { Form } from '@/components/form/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { IOcurrence } from '@/types/models/Ocurrences/IOcurrence';
import { ocurrenceCharacterizationService, ocurrenceService, ocurrenceTypeService, ocurrrenceClassificationService } from '@/services/Ocurrences';
import { useQuery } from '@tanstack/react-query';

const schema = Yup.object({
  typeId: Yup.string().required('Tipo é obrigatório'),
  characterizationId: Yup.string().required('Classificação é obrigatória'),
  ocurrenceId: Yup.string().required('Ocorrência é obrigatória')
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalOcorrencia({
  isOpen,
  onClose,
  current,
  readonly,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  current?: IOcurrence;
  readonly?: boolean;
  onSubmit: (data: IOcurrence) => void;
}) {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    if (!isOpen) return;
    if (current) {
      methods.reset({});
      return;
    }
    methods.reset();
  }, [current, isOpen, methods]);

  const { data: types, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['types'],
    queryFn: ocurrenceTypeService.getTypes,
    refetchOnWindowFocus: false
  });

  const typeId = methods.watch('typeId');

  const { data: characterizations, isLoading: isLoadingClassifications } = useQuery({
    queryKey: ['characterizationId', typeId],
    queryFn: () => ocurrenceCharacterizationService.getCharacterizationsByTypeAsync(typeId),
    refetchOnWindowFocus: false,
    enabled: !!(!!typeId && typeId !== '')
  });

  const characterizationId = methods.watch('characterizationId');

  const { data: ocurrences, isLoading: isLoadingOcurrences } = useQuery({
    queryKey: ['ocurrences', characterizationId],
    queryFn: () => ocurrenceService.getOcurrenceByCategoryAsync(characterizations.find((t: any) => t.id == characterizationId)?.description),
    refetchOnWindowFocus: false,
    enabled: !!(characterizationId && characterizationId !== '')
  });

  const typesOptions = types?.data?.data.map((t: any) => ({ label: t.description, value: t.id }));

  async function onSubmitForm(data: FormFields) {
    const currentOcurrency = ocurrences.find((t: any) => t.id == data.ocurrenceId);
    onSubmit(currentOcurrency as any);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={current ? (readonly ? current?.id + '' : 'Editar Ocorrencia') : 'Escolher Ocorrencia'}
      width="550px"
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmitForm)()}
    >
      <Form onSubmit={data => onSubmitForm(data as FormFields)} className="flex flex-col gap-4 pb-4" {...methods}>
        <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
          <Dropdown label="Tipo" name="typeId" options={typesOptions || []} disabled={isLoadingTypes} required />
          <Dropdown
            label="Classificação"
            name="characterizationId"
            disabled={isLoadingClassifications || !typeId || typeId === ''}
            options={(Array.isArray(characterizations) ? characterizations : []).map(t => ({ label: t.description, value: t.id })) || []}
            required
          />
        </div>
        <Dropdown
          label="Ocorrência"
          name="ocurrenceId"
          disabled={isLoadingOcurrences || !characterizationId || characterizationId === ''}
          options={ocurrences ? ocurrences.map((t: any) => ({ label: t.description, value: t.id })) : []}
          required
        />
      </Form>
    </Modal>
  );
}
