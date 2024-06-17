import { Form } from '@/components/form';
import { Input, Modal } from '@/components/ui';
import { useServiceOperations } from '@/contexts/ServiceOperationsConfigProvider';
import { masks } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { version } from 'os';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

export function ModalFiltroTaskGroup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { taskGroups } = useServiceOperations();

  const schema = Yup.object({
    version: Yup.string(),
    startDate: Yup.string(),
    endDate: Yup.string(),
    name: Yup.string()
  });
  type FormFields = Yup.InferType<typeof schema>;

  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: FormFields) => {
    taskGroups.setFilter(prev => ({
      ...prev,
      ...data,
      page: 0
    }));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={'Filtrar Grupos'}
      width="530px"
      onSubmit={() => methods.handleSubmit(onSubmit)()}
      SubmitText="Filtrar"
    >
      <Form className="flex flex-col gap-4 md:gap-6" onSubmit={methods.handleSubmit(onSubmit)} {...methods}>
        <Input name="version" label="Versão" />

        <Input name="name" label="Nome" />

        <Input name="startDate" label="Data de início" mask={masks.DATE} />

        <Input name="endDate" label="Data de fim" mask={masks.DATE} />
      </Form>
    </Modal>
  );
}
