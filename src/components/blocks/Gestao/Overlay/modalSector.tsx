import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, ICompanyUnity, IPermissions, IRole, ISector } from '@/types';
import * as Yup from 'yup';
import { Form } from '@/components/form/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';
import { CustomSwitch } from '@/components/ui/switch';
import { useUser } from '@/hooks/useUser';
import { useGestao } from '@/contexts/GestaoProvider';
import { useDialog } from '@/hooks/use-dialog';

const schema = Yup.object({
  name: Yup.string().required('O nome é obrigatório'),
  companyId: Yup.string().required('A empresa é obrigatória')
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalSector({ isOpen, onClose, current, readonly }: { isOpen: boolean; onClose: () => void; current?: ISector; readonly?: boolean }) {
  const { currentCompany } = useUser();

  const { sectors } = useGestao();

  const { confirmDialog } = useDialog();

  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      companyId: currentCompany?.id ?? ''
    }
  });

  async function onSubmit(data: FormFields) {
    try {
      const newData: ISector = {
        description: data.name,
        companyId: data.companyId
      };
      if (current) {
        await sectors.update({ ...current, ...newData });
        onClose();
        return;
      }
      await sectors.create(newData);
      onClose();
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      confirmDialog({
        title: 'Houve um erro ao editar a categoria',
        message
      });
    }
  }

  React.useEffect(() => {
    if (!isOpen) return;
    if (current) {
      methods.reset({
        name: current.description,
        companyId: current.companyId as any
      });
      return;
    }
    methods.reset();
  }, [current, isOpen, methods]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={current ? (readonly ? current.description : 'Editar Setor') : 'Novo Setor'}
      width="550px"
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmit)()}
    >
      <Form onSubmit={data => onSubmit(data as FormFields)} className="flex flex-col gap-4 pb-4" {...methods}>
        <Input name="name" label="Nome do setor" required placeholder="Nome" error={methods.formState.errors.name} disabled={readonly} />
        {/* <Dropdown
          name="companyId"
          label="Empresa"
          required
          options={companiesList?.map(unit => ({ label: unit.name, value: unit.id }))}
          error={methods.formState.errors.companyId}
          disabled={readonly}
        /> */}
      </Form>
    </Modal>
  );
}
